(() => {
  const TOTAL = 53;
  const pagePath = n => `pages/${String(n).padStart(3,'0')}.webp`;
  let page = 1, animating = false, touchX = null;
  const $ = id => document.getElementById(id);
  const els = {book:$('book'),left:$('leftPage'),right:$('rightPage'),mobile:$('mobilePage'),flip:$('flipSheet'),ff:$('flipFront'),fb:$('flipBack'),prev:$('prevBtn'),next:$('nextBtn'),prevS:$('prevSmall'),nextS:$('nextSmall'),slider:$('pageSlider'),label:$('pageLabel'),count:$('pageCount'),fs:$('fullscreenBtn'),stage:$('bookStage'),loading:$('loading')};
  const mobile = () => matchMedia('(max-width:760px)').matches;
  function preload(n){ if(n<1||n>TOTAL)return; const i=new Image(); i.src=pagePath(n); }
  function spreadFor(n){ if(n<=1)return [null,1]; if(n>=TOTAL && TOTAL%2===1)return [TOTAL,null]; const left=n%2===0?n:n-1; return [left,left+1<=TOTAL?left+1:null]; }
  function normalize(n){ n=Math.max(1,Math.min(TOTAL,n)); if(mobile()) return n; if(n===1||n===TOTAL)return n; return n%2===0?n:n-1; }
  function setImg(img,n){ if(!n){img.removeAttribute('src');img.parentElement.style.visibility='hidden';return;} img.parentElement.style.visibility='visible';img.src=pagePath(n);img.alt=`VARYN: FRACTURA CERO - página ${n}`; }
  function render(){ page=normalize(page); els.book.classList.toggle('cover-mode',!mobile()&&page===1); els.book.classList.toggle('end-mode',!mobile()&&page===TOTAL&&TOTAL%2===1); if(mobile()){setImg(els.mobile,page)}else{const [l,r]=spreadFor(page);setImg(els.left,l);setImg(els.right,r)} const shown=mobile()?page:(page===1?1:(page===TOTAL?TOTAL:spreadFor(page)[0])); els.slider.value=shown; els.label.textContent=shown===1?'Portada':(shown===TOTAL?'Última página':`Página ${shown}`); els.count.textContent=`${shown} / ${TOTAL}`; els.prev.disabled=els.prevS.disabled=page<=1; els.next.disabled=els.nextS.disabled=page>=TOTAL; preload(Math.min(TOTAL,page+2)); preload(Math.max(1,page-2)); }
  function step(dir){ if(animating)return; if(mobile()){const target=page+dir;if(target<1||target>TOTAL)return;page=target;render();return;} let target;if(page===1&&dir>0)target=2;else if(page===2&&dir<0)target=1;else if(page===TOTAL&&dir<0)target=TOTAL-1-(TOTAL%2===1?1:0);else target=page+dir*2;if(target<1||target>TOTAL)return; animate(dir,target); }
  function animate(dir,target){animating=true; const [cl,cr]=spreadFor(page),[nl,nr]=spreadFor(target); els.flip.className='flip-sheet'; if(dir>0){setImg(els.ff,cr||cl);setImg(els.fb,nl||nr);els.flip.classList.add('forward')}else{setImg(els.ff,cl||cr);setImg(els.fb,nr||nl);els.flip.classList.add('backward')} setTimeout(()=>{page=target;els.flip.className='flip-sheet';render();animating=false},590);}
  els.prev.onclick=els.prevS.onclick=()=>step(-1); els.next.onclick=els.nextS.onclick=()=>step(1);
  els.slider.addEventListener('input',e=>{page=Number(e.target.value);render()});
  document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='PageDown')step(1);if(e.key==='ArrowLeft'||e.key==='PageUp')step(-1)});
  els.stage.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX},{passive:true}); els.stage.addEventListener('touchend',e=>{if(touchX===null)return;const d=e.changedTouches[0].clientX-touchX;if(Math.abs(d)>45)step(d<0?1:-1);touchX=null},{passive:true});
  els.stage.addEventListener('click',e=>{if(!mobile())return;const x=e.clientX/window.innerWidth;if(x>.72)step(1);else if(x<.28)step(-1)});
  els.fs.onclick=async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}catch{}};
  addEventListener('resize',render); window.VARYN_READER={goTo:n=>{page=Number(n)||1;render()},next:()=>step(1),prev:()=>step(-1)}; render(); setTimeout(()=>{for(let i=1;i<=Math.min(TOTAL,6);i++)preload(i)},300);
})();