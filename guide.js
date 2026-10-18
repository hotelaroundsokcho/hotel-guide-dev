/* 호텔어라운드 속초 가이드 공통 스크립트 (언어 토글 · 운영 상태 · 시간대 테마) */
function setLang(lang){
  document.body.className = lang;
  var labels = {ko:'한국어', en:'English', zh:'中文'};
  document.querySelectorAll('.lpill').forEach(function(b){
    b.classList.toggle('on', b.textContent.trim() === labels[lang]);
  });
  document.querySelectorAll('[data-ko],[data-en],[data-zh]').forEach(function(el){
    if(el.classList.contains('lpill')) return;
    if(el.hasAttribute('data-ko')) el.style.display = (lang==='ko') ? '' : 'none';
    if(el.hasAttribute('data-en')) el.style.display = (lang==='en') ? '' : 'none';
    if(el.hasAttribute('data-zh')) el.style.display = (lang==='zh') ? '' : 'none';
  });
  document.documentElement.lang = lang;
  document.querySelectorAll('a[data-base]').forEach(function(a){ a.href = a.getAttribute('data-base') + '?lang=' + lang; });
  updateStatus();
  try { localStorage.setItem('hg_lang', lang); } catch(e){}
}
function seoulNow(){
  try { return new Date(new Date().toLocaleString('en-US', {timeZone:'Asia/Seoul'})); }
  catch(e){ return new Date(); }
}
function updateStatus(){
  var bar = document.getElementById('statusBar');
  var text = document.getElementById('statusText');
  if(!bar || !text) return;
  var n = seoulNow();
  var h = n.getHours() + n.getMinutes()/60;
  var lang = (document.body.className==='en' || document.body.className==='zh') ? document.body.className : 'ko';
  var cls, m;
  if(h >= 9 && h < 19){ cls='open'; m={ko:'편하게 문의하세요, 지금 응대 가능합니다', en:"Feel free to reach out — we're here now", zh:'欢迎随时咨询，现在为您在线服务'}; }
  else if(h >= 19 && h < 20){ cls='closing'; m={ko:'오늘 응대는 곧 마감돼요 (20:00까지)', en:'Support closes soon today (by 8:00 PM)', zh:'今日服务即将结束（20:00截止）'}; }
  else { cls='night'; m={ko:'지금은 조용한 시간이에요. 아침 9시에 다시 만나요', en:"It's quiet hours now. We'll be here from 9 AM", zh:'现在是休息时间，早上9点再见'}; }
  bar.className = 'status-bar ' + cls;
  text.textContent = m[lang];
}
/* 시간대 테마: 새벽 04–08 · 낮 08–17 · 일몰 17–20 · 밤 20–04 (서울 기준, ?time= 오버라이드) */
var PHASES = ['dawn','day','dusk','night'];
var PHASE_THEME = {dawn:'#D4D2E8', day:'#E6EAED', dusk:'#E3CFD6', night:'#15222F'};
function phaseOf(h){
  if(h >= 4 && h < 8) return 'dawn';
  if(h >= 8 && h < 17) return 'day';
  if(h >= 17 && h < 20) return 'dusk';
  return 'night';
}
function applyPhase(){
  var p = null;
  try { var q = new URLSearchParams(location.search).get('time'); p = PHASES.indexOf(q) > -1 ? q : null; } catch(e){}
  if(!p) p = phaseOf(seoulNow().getHours());
  document.documentElement.setAttribute('data-time', p);
  var meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute('content', PHASE_THEME[p]);
}
(function init(){
  var saved = null;
  try { saved = localStorage.getItem('hg_lang'); } catch(e){}
  var bl = navigator.language || '';
  var lang = (saved==='ko'||saved==='en'||saved==='zh') ? saved : (bl.indexOf('ko')===0 ? 'ko' : (bl.indexOf('zh')===0 ? 'zh' : 'en'));
  try { var ql = new URLSearchParams(location.search).get('lang'); if(ql==='ko'||ql==='en'||ql==='zh') lang = ql; } catch(e){}
  setLang(lang);
  applyPhase();
  setInterval(function(){ updateStatus(); applyPhase(); }, 60000);
})();
