const OWNER_EMAIL = "pratima2006"; // tera github username check
const GEMINI_KEY = "YOUR_FREE_GEMINI_KEY"; // yaha apni free key paste kar

function checkOwner(){ const e=localStorage.getItem('user_email')||""; if(e.toLowerCase().includes(OWNER_EMAIL) || e.toLowerCase().includes("pratima")){ document.getElementById('owner-ai-btn').style.display='flex'; }}
function toggleAI(){ document.getElementById('owner-ai-panel').classList.toggle('hidden'); }
async function askOwnerAI(){
  const prompt=document.getElementById('ai-prompt').value; if(!prompt) return;
  const chat=document.getElementById('ai-chat'); chat.innerHTML+=`<div class="msg user">${prompt}</div>`; document.getElementById('ai-prompt').value="";
  chat.innerHTML+=`<div class="msg ai">Socha ja raha hai... ✨</div>`;
  try{
    const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:`You are a code editor for borahae.fm app. User wants: ${prompt}. Give ONLY the HTML/CSS/JS snippet to change, explain in Hinglish. Current page: ${window.location.pathname}` }]}]})});
    const data=await res.json(); const reply=data.candidates?.[0]?.content?.parts?.[0]?.text||"API key check kar, ya prompt dobara bol";
    chat.innerHTML+=`<div class="msg ai">${reply.replace(/\n/g,"<br>")}</div>`; chat.scrollTop=chat.scrollHeight;
  }catch(err){ chat.innerHTML+=`<div class="msg ai">Error: Free key daali kya? ${err.message}</div>`; }
}
document.addEventListener('DOMContentLoaded',checkOwner);
