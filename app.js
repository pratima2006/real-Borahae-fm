let defaultVideos = [
  {title:"BTS Dynamite", id:"Rs2q5IdJdEA"}, {title:"BTS Butter", id:"WMweEpGlu_U"},
  {title:"BTS IDOL", id:"pBuZEGYXA6E"}, {title:"BTS ON", id:"mPVDGOVjRQ0"}
];
let customVideos = JSON.parse(localStorage.getItem('customMVs')||"[]");

function renderVideos(){
  const grid=document.getElementById('videoGrid'); if(!grid) return;
  grid.innerHTML="";
  [...defaultVideos,...customVideos].forEach(v=>{
    grid.innerHTML+=`<div class="card"><img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg"><div style="padding:8px"><p style="font-size:11px;font-weight:600;margin:0">${v.title}</p></div></div>`;
  });
}
function openAddModal(){document.getElementById('addModal').style.display='flex'}
function closeAdd(){document.getElementById('addModal').style.display='none'}
function getYTId(url){const m=url.match(/(?:v=|youtu\.be\/)([^&\s]+)/);return m?m[1]:null}
function previewYT(url){const id=getYTId(url); if(id){document.getElementById('ytThumb').src=`https://img.youtube.com/vi/${id}/hqdefault.jpg`;document.getElementById('ytPreview').style.display='block';document.getElementById('ytStatus').innerText="✅ Ready to add";document.getElementById('ytStatus').dataset.id=id}}
function addVideo(){const id=document.getElementById('ytStatus').dataset.id; if(!id) return alert("Paste link first"); customVideos.push({title:`Custom MV - ${id}`, id}); localStorage.setItem('customMVs',JSON.stringify(customVideos)); closeAdd(); renderVideos();}

document.addEventListener('DOMContentLoaded', renderVideos);
