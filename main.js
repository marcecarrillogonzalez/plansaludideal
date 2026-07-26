/* ===== NAV / HAMBURGER ===== */
const hbg=document.getElementById('hamburger'),nl=document.getElementById('navlinks');
if(hbg){hbg.addEventListener('click',()=>{nl.classList.toggle('open');hbg.setAttribute('aria-expanded',nl.classList.contains('open'));});
nl.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nl.classList.remove('open');hbg.setAttribute('aria-expanded','false');}));}

/* ===== TABS CLINICAS ===== */
function showTab(id,btn){document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));document.querySelectorAll('.tab').forEach(t=>{t.classList.remove('active');t.setAttribute('aria-selected','false');});document.getElementById('tab-'+id).classList.add('active');btn.classList.add('active');btn.setAttribute('aria-selected','true');}

/* ===== FAQ ACORDEON ===== */
function toggleFaq(el){
  const open=el.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(f=>f.classList.remove('open'));
  if(!open)el.classList.add('open');
}

/* ===== MAPA DE CHILE: ZONAS DE CLINICAS ===== */
function showZone(id,btn){
  document.querySelectorAll('#clinicas .tab-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.map-node').forEach(n=>n.classList.remove('active'));
  const panel=document.getElementById('tab-'+id);
  if(panel)panel.classList.add('active');
  btn.classList.add('active');
}

/* ===== FORMULARIO MULTIPASO ===== */
const FORMSPREE_ENDPOINT='https://formspree.io/f/xbdvlenk';
const WA_NUMBER='56977511346';
const state={nombre:null,isapre:null,preocupa:null,renta:null,preexistencia:null,preexistenciaDetalle:'',cargas:null,edadesCargas:'',clinicas:'',telefono:'',email:'',viaContacto:null};

function setupOptionGroup(groupId,stateKey){
  const group=document.getElementById(groupId);
  if(!group)return;
  group.querySelectorAll('.opt').forEach(btn=>{
    btn.addEventListener('click',()=>{
      group.querySelectorAll('.opt').forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
      state[stateKey]=btn.dataset.value;
      if(stateKey==='preexistencia'){
        const g=document.getElementById('preexistenciaDetalleGroup');
        if(btn.dataset.value==='Si'){g.style.display='block';}
        else{g.style.display='none';document.getElementById('fieldPreexistenciaDetalle').value='';}
      }
      if(stateKey==='cargas'){
        const g=document.getElementById('cargasEdadesGroup');
        if(btn.dataset.value==='Si'){g.style.display='block';}
        else{g.style.display='none';document.getElementById('fieldEdadesCargas').value='';state.edadesCargas='';}
      }
      checkStepValid();
    });
  });
}
['opt-isapre|isapre','opt-preocupa|preocupa','opt-renta|renta','opt-preexistencia|preexistencia','opt-cargas|cargas','opt-viaContacto|viaContacto'].forEach(pair=>{const[g,k]=pair.split('|');setupOptionGroup(g,k);});

function checkStepValid(){
  const nombreVal=document.getElementById('fieldNombre').value.trim();
  state.nombre=nombreVal;
  document.getElementById('next1').disabled=!(nombreVal.length>1);
  document.getElementById('next2').disabled=!state.isapre;
  document.getElementById('next3').disabled=!state.preocupa;
  const edadesOk=state.cargas!=='Si'||document.getElementById('fieldEdadesCargas').value.trim().length>0;
  const clinicasOk=document.getElementById('fieldClinicas').value.trim().length>0;
  document.getElementById('next4').disabled=!(state.renta&&state.preexistencia&&state.cargas&&edadesOk&&clinicasOk);
  checkContact();
}
['fieldNombre','fieldEdadesCargas','fieldClinicas'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('input',checkStepValid);});

function checkContact(){
  const t=document.getElementById('fieldTelefono').value.trim();
  const e=document.getElementById('fieldEmail').value.trim();
  const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  document.getElementById('next5').disabled=!(t.length>5&&emailOk&&state.viaContacto);
}
['fieldTelefono','fieldEmail'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('input',checkContact);});

function goStep(n){
  document.querySelectorAll('.form-step').forEach(s=>s.classList.remove('active'));
  document.querySelector(`.form-step[data-step="${n}"]`).classList.add('active');
  const pct=Math.min(n,5)*20;
  document.getElementById('progressFill').style.width=pct+'%';
  document.getElementById('progressLabel').textContent=`Paso ${Math.min(n,5)} de 5`;
  if(n===2){const name=state.nombre||document.getElementById('fieldNombre').value.trim();document.getElementById('greetingTitle').textContent=`Hola ${name}, ¡que bueno que estes aqui!`;}
  if(n===5){const name=state.nombre||document.getElementById('fieldNombre').value.trim();document.getElementById('contactTitle').textContent=`¡Gracias, ${name}, por llegar hasta aqui!`;}
}

function submitForm(){
  state.email=document.getElementById('fieldEmail').value.trim();
  state.preexistenciaDetalle=document.getElementById('fieldPreexistenciaDetalle').value.trim();
  state.edadesCargas=document.getElementById('fieldEdadesCargas').value.trim();
  state.clinicas=document.getElementById('fieldClinicas').value.trim();
  state.telefono=document.getElementById('fieldTelefono').value.trim();

  const payload={
    _subject:'Nueva solicitud de comparativa ISAPRE - Plan Salud Ideal',
    Nombre:state.nombre,Isapre_actual:state.isapre,Preocupacion:state.preocupa,
    Renta:state.renta,Preexistencia:state.preexistencia,Detalle_preexistencia:state.preexistenciaDetalle,
    Cargas:state.cargas,Edades_cargas:state.edadesCargas,Clinicas:state.clinicas,
    Telefono:state.telefono,Email:state.email,Via_contacto:state.viaContacto
  };
  fetch(FORMSPREE_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)})
    .catch(err=>console.error('Error enviando:',err));

  document.getElementById('progressArea').style.display='none';
  document.querySelectorAll('.form-step').forEach(s=>s.classList.remove('active'));
  document.querySelector('.form-step[data-step="6"]').classList.add('active');
  document.getElementById('confirmTitle').textContent=`¡Gracias, ${state.nombre}!`;
}

/* ===== CONTADORES ANIMADOS ===== */
function animateCounters(){document.querySelectorAll('.stat-num,.hstat-num').forEach(el=>{const txt=el.textContent.trim();const firstD=txt.search(/[0-9]/);if(firstD<0)return;let lastD=firstD;for(let k=txt.length-1;k>=0;k--){if(/[0-9]/.test(txt[k])){lastD=k;break;}}const prefix=txt.slice(0,firstD);const suffix=txt.slice(lastD+1);const num=parseInt(txt.slice(firstD,lastD+1).replace(/\D/g,''),10);if(isNaN(num))return;let startTime=null;function step(ts){if(!startTime)startTime=ts;const prog=Math.min((ts-startTime)/1500,1);const ease=1-Math.pow(1-prog,3);const val=Math.floor(ease*num).toLocaleString('es-CL');el.textContent=prefix+val+suffix;if(prog<1)requestAnimationFrame(step);}requestAnimationFrame(step);});}
const statsGrid=document.querySelector('.stats-grid');
if(statsGrid){const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){animateCounters();obs.disconnect();}});},{threshold:.3});obs.observe(statsGrid);}

/* ===== CONTADOR EN VIVO DEL CTA ===== */
(function(){
  const el=document.getElementById('ctaLive');if(!el)return;
  let n=9;
  setInterval(()=>{
    n+=Math.floor(Math.random()*5)-2; // deriva suave
    if(n<4)n=4;if(n>17)n=17;
    el.textContent=n;
  },4200);
})();

/* ===== COTIZACION EN VIVO (barra superior) ===== */
(function(){
  const box=document.getElementById('liveQuote');
  if(!box)return;
  const isapres=['Banmedica','Consalud','Colmena','Cruz Blanca','Nueva Masvida','Vida Tres','Esencial'];
  const clinicas=['Clinica Alemana','Clinica Santa Maria','Clinica Davila','UC Christus','Clinica Indisa','RedSalud','Clinica Meds','Bupa Santiago'];
  const results=['Plan sugerido en 30 min · sin costo','Comparando 7 isapres activas','Ahorro estimado segun tu renta','Analisis personalizado listo','Cobertura optimizada para tu clinica'];
  const iEl=document.getElementById('lqIsapre'),cEl=document.getElementById('lqClinica'),rEl=document.getElementById('lqResult');
  function rand(a){return a[Math.floor(Math.random()*a.length)];}
  function cycle(){
    [iEl,cEl,rEl].forEach(e=>e.classList.add('lq-fade'));
    setTimeout(()=>{
      iEl.textContent=rand(isapres);cEl.textContent=rand(clinicas);rEl.textContent=rand(results);
      [iEl,cEl,rEl].forEach(e=>e.classList.remove('lq-fade'));
    },320);
  }
  setInterval(cycle,3800);
})();
