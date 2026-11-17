/* Lyric Junk Removal contact form – Cloudflare Pages, Resend, Turnstile. */
(()=>{const form=document.getElementById('lyric-junk-contact-form');if(!form)return;
const status=document.getElementById('lyric-junk-status'),button=form.querySelector('[type="submit"]'),target=document.getElementById('lyric-junk-turnstile');
let siteKey='',widgetId=null;
function render(){if(!window.turnstile||!siteKey||widgetId!==null)return;widgetId=window.turnstile.render(target,{sitekey:siteKey,theme:'light'})}
window.lyricJunkTurnstileReady=render;
fetch('/api/contact-config',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Configuration unavailable');return r.json()}).then(c=>{siteKey=c.siteKey||'';if(!siteKey)throw Error('Site key unavailable');render()}).catch(()=>{status.textContent='Contact form temporarily unavailable. Please try later.';button.disabled=true});
form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form);
if(!String(d.get('email')||'').trim()&&!String(d.get('phone')||'').trim()){status.textContent='Please provide an email or phone number.';return}
const token=widgetId!==null?window.turnstile?.getResponse(widgetId):'';
if(!token){status.textContent='Please complete the security check.';return}
button.disabled=true;status.classList.remove('lyric-junk-success');status.textContent='Sending your message…';
try{const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:d.get('name'),email:d.get('email'),phone:d.get('phone'),message:d.get('message'),companyWebsite:d.get('companyWebsite'),turnstileToken:token})});
if(!(r.headers.get('content-type')||'').includes('application/json'))throw Error('Contact service unavailable. Please try later.');
const j=await r.json();if(!r.ok||!j.success)throw Error(j.error||'Unable to send your message.');
form.reset();window.turnstile?.reset(widgetId);status.classList.add('lyric-junk-success');status.textContent='Thank you! Your message has been sent. We’ll be in touch shortly.'}
catch(err){status.textContent=err.message||'Unable to send. Please try again.';window.turnstile?.reset(widgetId)}finally{button.disabled=false}});
})();