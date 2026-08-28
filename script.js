// PASTE YOUR SUPABASE KEYS HERE
const SUPABASE_URL = "https://kiwbitgnulmxjjqicvob.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpd2JpdGdudWxteGpqcWljdm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4OTg0MzEsImV4cCI6MjEwMzQ3NDQzMX0.dU-objJn2-8TdzzKuweKKQyhu906HNnPXA_IbFnmKj8";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const defaultVideos = [
  {title:"BTS 'Dynamite' Official MV", channel:"HYBE LABELS • 1.9B views", id:"Rs2q5IdJdEA"},
  {title:"BTS 'Butter' Official MV", channel:"HYBE LABELS • 1.1B views", id:"WMweEpGlu_U"},
  {title:"BTS 'IDOL' Official MV", channel:"HYBE LABELS • 1.4B views", id:"pBuZEGYXA6E"},
  {title:"BTS 'ON' Official MV", channel:"HYBE LABELS • 450M views", id:"mPVDGOVjRQ0"},
];

let customVideos = JSON.parse(localStorage.getItem('customMVs') || "[]");

function openScrapbook(){document.getElementById('homeView').style.display='none';document.getElementById('scrapbookView').style.display='block';renderVideos()}
function renderVideos(){
  const grid=document.getElementById('videoGrid');grid.innerHTML="";
  [...defaultVideos, ...customVideos].forEach(v=>{
    grid.innerHTML+=`<div class="card"><img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg"><div style="padding:8px"><p style="font-size:11px;font-weight:600;margin:0">${v.title}</p><p style="font-size:9px;color:gray">${v.channel}</p></div></div>`
  })
}
function openAddModal(){document.getElementById('addModal').style.display='flex'}
function closeAdd(){document.getElementById('addModal').style.display='none'}
function closeAuth(){document.getElementById('authModal').style.display='none'}
document.getElementById('loginBtn').onclick=()=>document.getElementById('authModal').style.display='flex';

async function loginWithGoogle(){
  const {error} = await supabaseClient.auth.signInWithOAuth({provider:'google', options:{redirectTo: window.location.origin}});
  if(error) alert(error.message);
}
async function handleEmailAuth(){
  const email=document.getElementById('email').value, password=document.getElementById('password').value;
  const {error} = await supabaseClient.auth.signUp({email,password});
  if(error){ const {error:err2}=await supabaseClient.auth.signInWithPassword({email,password}); if(err2) alert(err2.message); else alert("Logged in!"); closeAuth(); }
  else {alert("Check email or logged in!"); closeAuth();}
}
function getYTId(url){const reg=/(?:youtube\.com.*v=|youtu\.be\/)([^&\s]+)/;const m=url.match(reg);return m?m[1]:null}
function previewYT(url){const id=getYTId(url);if(id){document.getElementById('ytThumb').src=`https://img.youtube.com/vi/${id}/hqdefault.jpg`;document.getElementById('ytPreview').style.display='block';document.getElementById('ytStatus').innerText="✅ New video - ready to add";document.getElementById('ytStatus').dataset.id=id}else{document.getElementById('ytPreview').style.display='none';document.getElementById('ytStatus').innerText="";}}
function addVideo(){const id=document.getElementById('ytStatus').dataset.id;if(!id) return alert("Paste valid link first");customVideos.push({title:`Custom MV - ${id}`, channel:"Custom Added • New", id});localStorage.setItem('customMVs', JSON.stringify(customVideos));closeAdd();renderVideos();}
renderVideos();
