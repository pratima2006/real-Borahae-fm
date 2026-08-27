const songs=[{id:1,title:"BTS 'Dynamite' Official MV",yt:"https://www.youtube.com/embed/gdZLi9oWNZg",thumb:"https://i.ytimg.com/vi/gdZLi9oWNZg/hqdefault.jpg",views:"2.1B",dur:"3:44"},{id:2,title:"BTS 'Boy With Luv' Official MV",yt:"https://www.youtube.com/embed/XsX3ATcCjYA",thumb:"https://i.ytimg.com/vi/XsX3ATcCjYA/hqdefault.jpg",views:"1.6B",dur:"4:15"},{id:3,title:"BTS 'DNA' Official MV",yt:"https://www.youtube.com/embed/MBdVXkSdhwU",thumb:"https://i.ytimg.com/vi/MBdVXkSdhwU/hqdefault.jpg",views:"1.7B",dur:"3:50"},{id:4,title:"BTS 'Butter' Official MV",yt:"https://www.youtube.com/embed/WMweEpGlu_U",thumb:"https://i.ytimg.com/vi/WMweEpGlu_U/hqdefault.jpg",views:"1B",dur:"3:02"},{id:5,title:"BTS 'FAKE LOVE' Official MV",yt:"https://www.youtube.com/embed/7C2z4GqqS5E",thumb:"https://i.ytimg.com/vi/7C2z4GqqS5E/hqdefault.jpg",views:"1.4B",dur:"4:10"},{id:6,title:"BTS 'Spring Day' Official MV",yt:"https://www.youtube.com/embed/xEeFrLSkMm8",thumb:"https://i.ytimg.com/vi/xEeFrLSkMm8/hqdefault.jpg",views:"374M",dur:"4:20"}];

let watched=JSON.parse(localStorage.getItem('watched'))||[];let streams=parseInt(localStorage.getItem('streams'))||0;let current=null;

function openApp(){document.getElementById('landing').classList.add('hidden');document.getElementById('app').classList.remove('hidden');document.getElementById('date').innerText=new Date().toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}).toUpperCase();updateUI();}
document.getElementById('menu-btn').onclick=()=>document.getElementById('sidebar').classList.toggle('open');

function showMissions(){
  document.getElementById('continue-box').classList.add('hidden');
  const grid=document.getElementById('missions-grid');grid.classList.remove('hidden');
  grid.innerHTML=songs.map(s=>`<div class="mission" onclick="openVid(${s.id})"><img src="${s.thumb}"><div class="mission-body"><div class="tag-small">NEW - ADDED WITHIN 3 DAYS <span style="float:right">${s.dur}</span></div><h4>${s.title}</h4><small>HYBE LABELS • ${s.views} views</small></div></div>`).join('');
}

function openVid(id){current=songs.find(s=>s.id===id);document.getElementById('yt').src=current.yt;document.getElementById('video-popup').classList.remove('hidden');}
function closePopup(){document.getElementById('video-popup').classList.add('hidden');document.getElementById('yt').src="";}
function markWatched(){if(!watched.find(w=>w.id===current.id))watched.push({...current,count:1});else watched.find(w=>w.id===current.id).count++;streams++;localStorage.setItem('watched',JSON.stringify(watched));localStorage.setItem('streams',streams);updateUI();closePopup();}

function updateUI(){
  document.getElementById('today-count').innerHTML=`${streams} <span>/ 10 streams</span>`;
  document.getElementById('all-count').innerText=streams;
  document.getElementById('progress').style.width=(streams*10)+'%';
  if(watched.length>0){
    document.getElementById('continue-box').innerHTML=watched.slice(-7).reverse().map(w=>`<div style="display:flex;gap:10px;background:#fff;padding:10px;border-radius:10px;margin-bottom:10px"><img src="${w.thumb}" style="width:100px;height:60px;border-radius:8px"><div><h4 style="font-size:14px;margin:0">${w.title}</h4><small>Watched ${w.count} times</small></div></div>`).join('');
  }
}
