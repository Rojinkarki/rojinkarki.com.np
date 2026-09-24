/* Static portfolio retrieval assistant. All matching runs locally in the browser. */
(function () {
  'use strict';
  const bank = typeof ROJIN_KNOWLEDGE !== 'undefined' ? ROJIN_KNOWLEDGE : [];
  const stops = new Set('a an and are as at be can could did do does for from has have he her him his how i in is it me my of on or rojin karki she tell the their there to was were what when where which who why will with you your about please'.split(' '));
  const aliases = {cyber:'cybersecurity', security:'cybersecurity', netsec:'network', networking:'network', networks:'network', networked:'network', ad:'active directory', gpo:'group policy', certificate:'certification', certificates:'certification', certified:'certification', awards:'award', classes:'coursework', school:'education', college:'education', job:'experience', jobs:'experience', worked:'experience', work:'experience', ai:'artificial intelligence', labs:'lab', toolkit:'py netsec', python:'python', rovers:'rover', github:'github', linkedin:'linkedin', uni:'university', internship:'experience', intern:'experience', experience:'experience'};
  function normalize(s){return String(s).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();}
  function tokens(s){return normalize(s).split(' ').flatMap(t => (aliases[t] || t).split(' ')).filter(t => t.length>1 && !stops.has(t));}
  function grams(s){const t='  '+normalize(s)+'  ';const g=new Set();for(let i=0;i<t.length-2;i++)g.add(t.slice(i,i+3));return g;}
  function similarity(a,b){const ga=grams(a),gb=grams(b);let same=0;ga.forEach(g=>{if(gb.has(g))same++});return 2*same/(ga.size+gb.size||1);}
  const prepared=bank.map(item=>({...item,norm:normalize(item.question),words:new Set(tokens(item.question))}));
  function answer(question){
    const q=normalize(question);if(!q)return null;
    const qw=new Set(tokens(question));
    const scored=prepared.map(item=>{
      let overlap=0;qw.forEach(t=>{if(item.words.has(t))overlap += t.length>5?1.2:1});
      const coverage=overlap/Math.max(1,qw.size);
      const precision=overlap/Math.max(1,item.words.size);
      const fuzzy=similarity(q,item.norm);
      const exact=q===item.norm?5:0;
      const phrase=q.length>10&&(item.norm.includes(q)||q.includes(item.norm))?0.5:0;
      return {item,score:exact+phrase+0.57*coverage+0.23*precision+0.20*fuzzy};
    }).sort((a,b)=>b.score-a.score);
    const best=scored[0];
    // Refuse unsupported prompts instead of filling gaps with invented claims.
    if(!best||best.score<0.42)return null;
    return best.item;
  }
  if(typeof module!=='undefined'&&module.exports){module.exports={answer,normalize,tokens,count:bank.length};}
  if(typeof document==='undefined')return;
  const widget=document.querySelector('.portfolio-assistant');
  if(widget){
    const launcher=widget.querySelector('.assistant-launcher');const panel=widget.querySelector('.assistant-panel');const close=widget.querySelector('.assistant-close');const input=widget.querySelector('.assistant-form input');const messages=widget.querySelector('.assistant-messages');
    function setOpen(open){panel.hidden=!open;launcher.setAttribute('aria-expanded',String(open));if(open)input.focus();else launcher.focus();}
    launcher.addEventListener('click',()=>setOpen(panel.hidden));close.addEventListener('click',()=>setOpen(false));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)setOpen(false)});
    function addMessage(value,kind,href){
      const div=document.createElement('div');div.className='assistant-message assistant-'+kind;div.textContent=value;
      if(href){const a=document.createElement('a');a.className='assistant-source';a.href=href.startsWith('portfolio-details.html')?href:((document.body.classList.contains('details-page')?'index.html':'')+'#'+href);a.textContent='Explore this section ↗';div.append(a)}
      messages.append(div);messages.scrollTop=messages.scrollHeight;
    }
    function ask(value){const q=value.trim().slice(0,240);if(!q)return;addMessage(q,'user');const found=answer(q);if(found){addMessage(found.answer,'bot',found.href)}else{addMessage('I can answer questions grounded in this portfolio. Try asking about Rojin’s projects, skills, education, experience, or contact details. You can also browse the full question list.','bot')};input.value='';}
    widget.querySelector('.assistant-form').addEventListener('submit',e=>{e.preventDefault();ask(input.value)});
    widget.querySelectorAll('.assistant-prompts button').forEach(b=>b.addEventListener('click',()=>ask(b.textContent)));
  }
  const search=document.querySelector('#faq-search');
  if(search){const items=[...document.querySelectorAll('.faq-item')];const groups=[...document.querySelectorAll('.faq-group')];const count=document.querySelector('.faq-count');search.addEventListener('input',()=>{const q=normalize(search.value);let visible=0;for(const item of items){item.hidden=!!q&&!normalize(item.textContent).includes(q);if(!item.hidden)visible++}for(const group of groups)group.hidden=![...group.querySelectorAll('.faq-item')].some(item=>!item.hidden);count.textContent=`Showing ${visible} of ${items.length} questions`});}
})();
