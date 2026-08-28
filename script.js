// PASTE YOUR SUPABASE KEYS HERE
const SUPABASE_URL = "https://kiwbitgnulmxjjqicvob.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpd2JpdGdudWxteGpqcWljdm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4OTg0MzEsImV4cCI6MjEwMzQ3NDQzMX0.dU-objJn2-8TdzzKuweKKQyhu906HNnPXA_IbFnmKj8";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let songs=JSON.parse(localStorage.getItem('custom_songs'))||[
{id:1,title:"BTS (방탄소년단) 'Dynamite' Official MV",yt:"https://www.youtube.com/embed/gdZLi9oWNZg",thumb:"https://img.youtube.com/vi/gdZLi9oWNZg/maxresdefault.jpg",views:"1.9B views",channel:"HYBE LABELS"},
{id:2,title:"BTS (방탄소년단) 'Butter' Official MV",yt:"https://www.youtube.com/embed/WMweEpGlu_U",thumb:"https://img.youtube.com/vi/WMweEpGlu_U/maxresdefault.jpg",views:"1.1B views",channel:"HYBE LABELS"},
{id:3,title:"BTS (방탄소년단) 'IDOL' Official MV",yt:"https://www.youtube.com/embed/pBuZEGg_SF0",thumb:"https://img.youtube.com/vi/pBuZEGg_SF0/maxresdefault.jpg",views:"1.4B views",channel:"HYBE LABELS"},
{id:4,title:"BTS 'ON' Official MV",yt:"https://www.youtube.com/embed/mPVDGOVjRQ0",thumb:"https://img.youtube.com/vi/mPVDGOVjRQ0/maxresdefault.jpg",views:"480M views",channel:"HYBE LABELS"},
{id:5,title:"BTS 'Permission to Dance' Official MV",yt:"https://www.youtube.com/embed/CuklIb9d3fI",thumb:"https://img.youtube.com/vi/CuklIb9d3fI/maxresdefault.jpg",views:"690M views",channel:"HYBE LABELS"},
{id:6,title:"BTS 'Boy With Luv (feat. Halsey)' Official MV",yt:"https://www.youtube.com/embed/XsX3ATcCjYA",thumb:"https://img.youtube.com/vi/XsX3ATcCjYA/maxresdefault.jpg",views:"1.8B views",channel:"HYBE LABELS"},
{id:7,title:"BTS 'Run BTS' Official MV",yt:"https://www.youtube.com/embed/qGjAWJ2zWWI",thumb:"https://img.youtube.com/vi/qGjAWJ2zWWI/maxresdefault.jpg",views:"300M views",channel:"HYBE LABELS"},
{id:8,title:"BTS 'Yet To Come' Official MV",yt:"https://www.youtube.com/embed/9mwRYhJ7aKo",thumb:"https://img.youtube.com/vi/9mwRYhJ7aKo/maxresdefault.jpg",views:"250M views",channel:"HYBE LABELS"}
];
const faqs=[
{q:"What is borahae.fm?",a:"A fan-made scrapbook for ARMY to track streams, save memories, and celebrate BTS comebacks together. Borahae means 'I Purple You' - coined by V in 2016."},
{q:"How does streaming count work?",a:"Every time you watch a mission MV and click 'Mark as Watched', we save it locally and (after login) to Supabase. It's a love note, not a chart manipulation."},
{q:"Why HYBE LABELS only?",a:"We only list official MVs from HYBE LABELS / BANGTANTV to respect official views. Custom links you add are marked separately."},
{q:"Is my data safe?",a:"Yes. Google login uses Supabase Auth. Your email is never shared. You can logout and delete local history anytime from Settings."},
{q:"Can I add my own videos?",a:"Yes! Use 'Add MV/Videos' button. Paste any YouTube link. If it's already in the list you'll see 🔴 red dot, if new you'll see ✅ green tick."},
{q:"Will this app work after enlistment comeback?",a:"Yes! Designed to keep the purple light on forever. We will keep adding new MVs like ARIRANG era."}
];

let watched=JSON.parse(localStorage.getItem('watched'))||[];let streams=parseInt(localStorage.getItem('streams'))||0;let current=null;let pendingYT=null;

function openApp(){document.getElementById('landing').classList.add('hidden');document.getElementById('app').classList.remove('hidden');document.getElementById('date').innerText=new Date().toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}).toUpperCase();updateUI();showHome();checkUser();}
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('open');document.getElementById('overlay').classList.toggle('show');}
document.getElementById('menu-btn').onclick=toggleSidebar;
function hideAllPages(){['home-content','missions-grid','history-page','music-page','faq-page','watch-page'].forEach(id=>document.getElementById(id).classList.add('hidden'));document.querySelectorAll('aside li').forEach(li=>li.classList.remove('active'));}
function showHome(){hideAllPages();document.getElementById('home-content').classList.remove('hidden');document.getElementById('nav-home').classList.add('active');}
function showMissions(){hideAllPages();const grid=document.getElementById('missions-grid');grid.classList.remove('hidden');document.getElementById('nav-missions').classList.add('active');grid.innerHTML=songs.map(s=>`<div class="mission" onclick="openWatchPage(${s.id})"><img src="${s.thumb}"><div class="mission-body"><h4 style="font-size:14px">${s.title}</h4><small>${s.channel} • ${s.views}</small></div></div>`).join('');}
function showMusicPage(){hideAllPages();document.getElementById('music-page').classList.remove('hidden');document.getElementById('nav-music').classList.add('active');document.getElementById('music-list').innerHTML=songs.map(s=>`<div class="music-card" onclick="openWatchPage(${s.id})"><img src="${s.thumb}"><div class="music-body"><h4 style="font-size:13px">${s.title}</h4><small>${s.channel} • ${s.views}</small></div></div>`).join('');}
function showHistoryPage(){hideAllPages();document.getElementById('history-page').classList.remove('hidden');document.getElementById('nav-history').classList.add('active');const box=document.getElementById('history-box');box.innerHTML=watched.length?watched.slice().reverse().map(w=>`<div class="music-card"><img src="${w.thumb}"><div class="music-body"><h4 style="font-size:13px">${w.title}</h4><small>Watched ${w.count}x</small></div></div>`).join(''):`<div class="empty"><p>No history yet</p></div>`;}
function showFaqPage(){hideAllPages();document.getElementById('faq-page').classList.remove('hidden');document.getElementById('nav-faq').classList.add('active');document.getElementById('faq-box').innerHTML=faqs.map(f=>`<div class="faq-item"><h4>${f.q}</h4><p>${f.a}</p></div>`).join('');}
function openWatchPage(id){current=songs.find(s=>s.id===id);hideAllPages();document.getElementById('watch-page').classList.remove('hidden');document.getElementById('watch-yt').src=current.yt;document.getElementById('watch-title').innerText=current.title;document.getElementById('watch-meta').innerText=`${current.channel} • ${current.views}`;}
function markWatchedFromWatch(){if(!watched.find(w=>w.id===current.id))watched.push({...current,count:1});else watched.find(w=>w.id===current.id).count++;streams++;localStorage.setItem('watched',JSON.stringify(watched));localStorage.setItem('streams',streams);updateUI();alert('Marked as watched 💜');}
function updateUI(){document.getElementById('today-count').innerHTML=`${streams} <span>/ 10 streams</span>`;document.getElementById('progress').style.width=Math.min(streams*10,100)+'%';}

// LOGIN
function openLogin(){document.getElementById('login-popup').classList.remove('hidden');}
function closeLogin(){document.getElementById('login-popup').classList.add('hidden');}
async function loginWithGoogle(){const {error}=await supabaseClient.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.href}});if(error)alert(error.message);}
async function loginWithEmail(){const email=document.getElementById('email').value;const pass=document.getElementById('pass').value;const {error}=await supabaseClient.auth.signUp({email,password:pass});if(error){const {error:err2}=await supabaseClient.auth.signInWithPassword({email,password:pass});if(err2)alert(err2.message);else location.reload();}else{alert('Check email or logged in');location.reload();}}
async function checkUser(){const {data:{user}}=await supabaseClient.auth.getUser();if(user){document.getElementById('user-name-display').innerText=user.email.split('@')[0];document.getElementById('welcome-name').innerText=user.email.split('@')[0];document.getElementById('profile-name').innerText=user.email.split('@')[0];document.getElementById('profile-email').innerText=user.email;document.getElementById('profile-letter').innerText=user.email[0].toUpperCase();document.getElementById('auth-btn').innerText='Logout';document.getElementById('auth-btn').onclick=async()=>{await supabaseClient.auth.signOut();location.reload();}}}
checkUser();

// ADD MV LOGIC
function openAddMV(){document.getElementById('add-mv-popup').classList.remove('hidden');}
function closeAddMV(){document.getElementById('add-mv-popup').classList.add('hidden');document.getElementById('yt-link-input').value='';document.getElementById('yt-preview').innerHTML='';document.getElementById('yt-status').innerHTML='';document.getElementById('add-mv-btn').classList.add('hidden');}
function extractYTId(url){const reg=/(?:youtube\.com\/.*v=|youtu\.be\/)([^&\n?#]+)/;const m=url.match(reg);return m?m[1]:null;}
function checkYTLink(){const url=document.getElementById('yt-link-input').value;const id=extractYTId(url);const status=document.getElementById('yt-status');const preview=document.getElementById('yt-preview');const btn=document.getElementById('add-mv-btn');if(!id){status.innerHTML='';preview.innerHTML='';btn.classList.add('hidden');return;}const exists=songs.find(s=>s.yt.includes(id)||s.thumb.includes(id));preview.innerHTML=`<img src="https://img.youtube.com/vi/${id}/maxresdefault.jpg" style="width:100%;border-radius:10px;max-height:180px;object-fit:cover">`;if(exists){status.innerHTML=`🔴 Already available in music - <b>${exists.title}</b>`;btn.classList.add('hidden');pendingYT=null;}else{status.innerHTML=`✅ New video - ready to add`;btn.classList.remove('hidden');pendingYT={id,url};}}
function addNewMV(){if(!pendingYT)return;const newId=Date.now();const newSong={id:newId,title:`Custom MV - ${pendingYT.id}`,yt:`https://www.youtube.com/embed/${pendingYT.id}`,thumb:`https://img.youtube.com/vi/${pendingYT.id}/maxresdefault.jpg`,views:"New",channel:"Custom Added"};songs.push(newSong);localStorage.setItem('custom_songs',JSON.stringify(songs));closeAddMV();showMusicPage();alert('Added to Music 💜');}
