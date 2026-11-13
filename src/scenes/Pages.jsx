import React, { useEffect, useRef, useState } from 'react'
import { ArrowRight, BusFront, Bell, Camera, Heart, Play, Pause, Sparkles, Volume2, WandSparkles, RefreshCw } from 'lucide-react'
import Photo from '../components/Photo.jsx'
import PhotoNote from '../components/PhotoNote.jsx'
import Scenery from '../components/Scenery.jsx'
import { playSceneSound } from '../components/sceneAudio.js'
import RingReveal from '../components/RingReveal.jsx'
import { PAGE_COPY } from '../data/copy.js'
import { BOOTH_STRIPS, INSTANT_IDS, JOURNEY_IDS, PAGE_TITLES, START_DATE, WALL_IDS } from '../data/album.js'

function Folio({ n }) { return <span className="folio">{String(n).padStart(2,'0')} <span className="folio-dot">✦</span> 18</span> }
function Header({ n, eyebrow, title, subtitle }) {
  return <div className="scene-heading">{eyebrow!==''&&<span className="eyebrow">{eyebrow ?? 'Bê & Mô · Dois anos de nós'}</span>}<h2>{title || PAGE_TITLES[n - 1]}</h2>{subtitle && <p className="scene-subtitle">{subtitle}</p>}</div>
}
function Leaf({ className = '' }) { return <svg className={`leaf-art ${className}`} viewBox="0 0 125 165" fill="none" aria-hidden="true"><path d="M17 159Q45 114 62 80Q81 44 106 10" stroke="currentColor" strokeWidth="2.2"/><path d="M58 86Q32 72 27 48Q56 49 66 69M75 56Q49 30 55 13Q83 23 84 42M45 111Q19 102 7 79Q35 83 53 99M79 54Q106 52 119 32Q98 28 84 43M62 80Q95 85 108 68Q87 66 68 71" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> }
function Starfield({ count = 20 }) { return <div className="local-stars" aria-hidden="true">{Array.from({ length:count },(_,i) => <i key={i} style={{left:`${(i*37+17)%96}%`,top:`${(i*23+9)%91}%`,animationDelay:`${i*.23}s`,opacity:.3+(i%5)*.13}}/>)}</div> }
function SmallButton({ children, onClick, icon:Icon=Sparkles, className='' }) { return <button className={`small-action ${className}`} data-interactive onClick={onClick}><Icon size={15} />{children}</button> }

function Page1() {
 const [opened,setOpened]=useState(false)
 return <div className="scene-page scene-letter-intro"><Header n={1} eyebrow={PAGE_COPY[1].eyebrow} title={PAGE_COPY[1].title}/><div className={`intro-stage ${opened?'letter-open':''}`}>
 <div className="letter-reveal" aria-hidden={!opened}><span className="letter-greeting">Minha Mô,</span><p>{PAGE_COPY[1].paragraphs[0]}</p><p>{PAGE_COPY[1].paragraphs[1]}</p><span className="signature">Com amor, seu Bê</span></div>
 <button className={`envelope ${opened?'unsealed':''}`} aria-label={opened?'Guardar a carta':'Abrir a carta'} aria-expanded={opened} onClick={()=>{if(!opened)playSceneSound('letter');setOpened(!opened)}} data-interactive><div className="envelope-back"/><div className="envelope-flap"/><div className="envelope-front"/><Leaf className="envelope-ornament"/><span className="wax-seal">B ♡ M</span><span className="envelope-address">Para meu amor</span></button>
 <span className="tap-hint">{opened?'Toque no envelope para guardar':'Uma carta para você'}</span></div><Folio n={1}/></div>
}
function Page2() {return <div className="scene-page scene-letter"><Header n={2} eyebrow={PAGE_COPY[2].eyebrow} title={PAGE_COPY[2].title}/>
  <div className="letter-sheet"><span className="letter-greeting">Meu amor,</span>
    <p>{PAGE_COPY[2].paragraphs[0]}</p>
    <p>{PAGE_COPY[2].paragraphs[1]}</p>
    <p>{PAGE_COPY[2].paragraphs[2]}</p>
    <span className="signature">Com amor, seu Bê ♡</span></div><Leaf className="page-leaf"/><Folio n={2}/></div>}

function Page3({active}){const [selected,setSelected]=useState(0);useEffect(()=>{if(active)playSceneSound('stars')},[active]);const nodes=[{title:'Antes de nós',body:'Nossas vidas sempre estiveram tão perto e tão longe ao mesmo tempo.'},{title:'Perto sem perceber',body:'A gente tava tão perto sem perceber. Quem diria que eu ainda ia viver tudo isso com você?'},{title:'No tempo de Deus',body:'Que bom que a gente se encontrou no tempo certo. Deus cuidou disso também.'}];return <div className="scene-page scene-stars"><Starfield count={35}/><Header n={3} eyebrow={PAGE_COPY[3].eyebrow} title={PAGE_COPY[3].title} subtitle={PAGE_COPY[3].subtitle}/>
    <div className="fate-line"><svg viewBox="0 0 640 150" preserveAspectRatio="none" aria-hidden="true"><path d="M72 95 C190 8 330 155 568 45" fill="none" stroke="#c9a76e" strokeWidth="2" strokeDasharray="5 7"/></svg>
    {nodes.map((node,i)=><button key={node.title} data-interactive className={`fate-star fate-star-${i} ${selected===i?'active':''}`} onClick={()=>setSelected(i)} aria-label={node.title}><span>✦</span><small>{node.title}</small></button>)}</div>
    <div className="fate-note"><span>✧</span><p>{nodes[selected].body}</p><span>✧</span></div><Folio n={3}/></div>}
function Page4({onPhoto}){const [color,setColor]=useState(false);return <div className="scene-page scene-encounter"><Header n={4} eyebrow={PAGE_COPY[4].eyebrow} title={PAGE_COPY[4].title}/>
    <div className="encounter-layout"><div className={`encounter-frame ${color?'colorful':''}`}><Photo id={1} caption={false} onClick={()=>onPhoto(1)}/><span className="encounter-glow"/></div><div className="encounter-text"><span className="mini-title">Eu só fui te ver...</span><p>{PAGE_COPY[4].paragraphs[0]}</p><p>{PAGE_COPY[4].paragraphs[1]}</p><button type="button" className="small-action rustic-action color-switch" data-interactive aria-label={color?'Rever aquele encanto':'Devolver a cor ao mundo'} aria-pressed={color} onClick={()=>setColor(v=>!v)}><WandSparkles size={15}/>{color?'Rever':'Dar cor'}</button></div></div><Folio n={4}/></div>}
function Page5(){const [ticket,setTicket]=useState(false);return <div className="scene-page scene-travel"><Header n={5} eyebrow={PAGE_COPY[5].eyebrow} title={PAGE_COPY[5].title}/>
  <div className={`travel-grid ${ticket?'journey-running':''}`}><div className="ticket-wrap"><button data-interactive className={`travel-ticket ${ticket?'flipped':''}`} onClick={()=>setTicket(v=>!v)}><span>UMA VIAGEM ATÉ VOCÊ</span><div><strong>Paraopeba, MG</strong><span className="ticket-route"><small>24 horas</small><ArrowRight size={17}/></span><strong>Pirapora, MG</strong></div><small>Só pensava em te encontrar</small><span className="ticket-stamp">✦ GUARDEI ESSA VONTADE ✦</span></button><p className="tap-hint">Toque no bilhete</p></div>{ticket&&<div className="travel-orbit" aria-label="Um ônibus dá voltas ao redor de um relógio"><div className="orbit-clock"><span/><i/><small>24 h</small></div><div className="bus-orbit"><BusFront size={24}/></div></div>}<div className="travel-letter"><p>{PAGE_COPY[5].paragraphs[0]}</p></div></div><Folio n={5}/></div>}
function Page6(){const [revealed,setRevealed]=useState(false);return <div className="scene-page scene-3am"><Header n={6} eyebrow={PAGE_COPY[6].eyebrow} title={PAGE_COPY[6].title}/>
  <div className="three-layout"><time className="late-hour">03:00</time><div className="three-copy"><p>{PAGE_COPY[6].paragraphs[0]}</p><p>Mas a maior surpresa veio na noite seguinte, quando a gente saiu. Do nada, <em>você disse “eu te amo” primeiro.</em></p><button data-interactive className={`folded-note ${revealed?'revealed':''}`} onClick={()=>setRevealed(v=>!v)}><Heart size={17} fill="currentColor"/>{revealed?<span>Quando eu ouvi aquilo, fiquei tão feliz que parecia que nem era real. Eu te amo, meu Mô.</span>:<span>Toque para abrir uma lembrança</span>}</button></div></div><Folio n={6}/></div>}
function useElapsed(active){const [elapsed,setElapsed]=useState(()=>Math.max(0,Math.floor((Date.now()-START_DATE.getTime())/1000)));useEffect(()=>{if(!active)return;function update(){setElapsed(Math.max(0,Math.floor((Date.now()-START_DATE.getTime())/1000)))}update();const timer=setInterval(update,1000);return()=>clearInterval(timer)},[active]);return {days:Math.floor(elapsed/86400),hours:Math.floor(elapsed/3600)%24,minutes:Math.floor(elapsed/60)%60,seconds:elapsed%60}}
function Page7({active}){
 const t=useElapsed(active)
 const bell=useRef(null)
 const [clock,setClock]=useState(()=>new Date())
 function ring(){
  playSceneSound('bell')
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)bell.current?.animate?.([{transform:'rotate(0deg)'},{transform:'rotate(15deg)'},{transform:'rotate(-12deg)'},{transform:'rotate(0deg)'}],{duration:520,iterations:2})
 }
 useEffect(()=>{
  if(!active)return
  setClock(new Date())
  ring()
  const timer=setInterval(()=>setClock(new Date()),1000)
  return()=>clearInterval(timer)
 },[active])
 return <div className="scene-page scene-time"><Scenery birds/><Header n={7} eyebrow={PAGE_COPY[7].eyebrow} title={PAGE_COPY[7].title} subtitle={PAGE_COPY[7].subtitle}/><div className="clock-tower"><div className="tower-spire"/><div className="tower-roof"/><button className="tower-bell" aria-label="Tocar o sino" onClick={ring}><span ref={bell}><Bell/></span></button><div className="tower-clock-wall"><div className="tower-clock" aria-hidden="true"><div className="clock-ticks"/><span className="clock-hand hand-hour" style={{transform:`rotate(${clock.getHours()*30+clock.getMinutes()/2}deg)`}}/><span className="clock-hand hand-minute" style={{transform:`rotate(${clock.getMinutes()*6+clock.getSeconds()/10}deg)`}}/><span className="clock-hand hand-second" style={{transform:`rotate(${clock.getSeconds()*6}deg)`}}/><i/></div></div><div className="tower-body"><span className="tower-caption">JUNTOS HÁ</span><strong className="tower-days">{t.days.toLocaleString('pt-BR')}</strong><span className="tower-unit">dias de nós</span><div className="time-stats">{[['horas',t.hours],['minutos',t.minutes],['segundos',t.seconds]].map(([name,val])=><div key={name}><strong>{String(val).padStart(2,'0')}</strong><span>{name}</span></div>)}</div><div className="tower-arches"><i/><i/><i/></div></div><div className="tower-base"/></div><p className="center-footnote">E em cada segundo, eu escolheria você de novo.</p><Folio n={7}/></div>}
function Page8({onPhoto}){return <div className="scene-page scene-journey"><Scenery branches/><Header n={8} eyebrow={PAGE_COPY[8].eyebrow} title={PAGE_COPY[8].title}/><div className="clothesline"><div className="wire wire-one"/><div className="wire wire-two"/>{JOURNEY_IDS.map((id,i)=><div className={`hanging-photo hang-${i}`} key={id}><i className="clothespin"/><Photo id={id} onClick={()=>onPhoto(id)} /></div>)}<div className="fairy-lights fairy-top" aria-hidden="true">{Array.from({length:7},(_,i)=><i key={i} style={{'--light-index':i}}/>)}</div><div className="fairy-lights fairy-bottom" aria-hidden="true">{Array.from({length:7},(_,i)=><i key={i} style={{'--light-index':i+7}}/>)}</div></div><p className="center-footnote">Cada foto guarda um pedacinho de tudo que eu mais amo viver com você.</p><Folio n={8}/></div>}
function Page9({onPhoto}){return <div className="scene-page scene-wall"><Header n={9} eyebrow={PAGE_COPY[9].eyebrow} title={PAGE_COPY[9].title}/><div className="pinboard"><span className="board-sticker">Lembranças que ficam ♥</span>{WALL_IDS.map((id,i)=><div key={id} className={`board-picture board-pic-${i}`}><span className="board-pin"/><PhotoNote id={id} onPhoto={onPhoto}/></div>)}<span className="board-heart">♡</span></div><Folio n={9}/></div>}
function Page10(){const [open,setOpen]=useState(-1);const cards=[['Seu sorriso','Ele muda qualquer dia meu. Às vezes basta você olhar para mim e parece que tudo fica mais leve.'],['Seu jeitinho','Até os momentos mais simples, uma conversa, uma conveniência, uma casquinha, ficam especiais ao seu lado.'],['O nosso futuro','Eu não penso duas vezes quando é para cuidar de você. Só penso em escolher o melhor e construir uma vida bonita ao seu lado.']];return <div className="scene-page scene-love-desk"><Header n={10} eyebrow={PAGE_COPY[10].eyebrow} title={PAGE_COPY[10].title} subtitle={PAGE_COPY[10].subtitle}/><div className="reasons"><div className="desk-light"/>{cards.map(([heading,body],i)=><button data-interactive key={heading} aria-expanded={open===i} className={`reason-card reason-${i} ${open===i?'expanded':''}`} onClick={()=>setOpen(open===i?-1:i)}><span className="reason-icon">{['♡','✿','✧'][i]}</span><strong>{heading}</strong>{open===i&&<p>{body}</p>}</button>)}</div><p className="center-footnote">Se eu tentasse escrever todos os motivos, este livro não teria fim.</p><Folio n={10}/></div>}
function Page11({onPhoto}) {
 const [phase,setPhase]=useState('idle')
 const timer=useRef(null)
 useEffect(()=>()=>clearTimeout(timer.current),[])
 function shoot() {
  if(phase==='ready'){setPhase('idle');return}
  if(phase!=='idle')return
  playSceneSound('booth')
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){setPhase('ready');return}
  setPhase('capturing')
  timer.current=setTimeout(()=>{
   setPhase('printing')
   timer.current=setTimeout(()=>setPhase('ready'),2700)
  },1020)
 }
 const open=phase==='printing'||phase==='ready'
 return <div className="scene-page scene-booth">
  <Header n={11} eyebrow={PAGE_COPY[11].eyebrow} title={PAGE_COPY[11].title}/>
  <div className={`booth-stage booth-${phase} ${open?'booth-open':''}`}>
   <div className="booth-marquee"><span>CABINE DE FOTOS</span><small>Dois sorrisos, uma vida juntos</small></div>
   <div className="booth-exposure" aria-hidden="true"><img src="/illustrations/couple-shadow.png" alt=""/></div>
   <div className="booth-interior">
    <div className="booth-print-slot" aria-hidden="true"/>
    {open&&<div className="photo-strips" inert={phase!=='ready'} onAnimationEnd={event=>{
     if(event.animationName!=='boothPrint')return
     clearTimeout(timer.current)
     setPhase('ready')
    }}>{BOOTH_STRIPS.map((strip,idx)=>
     <div className={`photostrip strip-${idx}`} key={idx}>{strip.map(id=><Photo id={id} key={id} caption={false} onClick={()=>onPhoto(id)}/>)}<span>BÊ ♡ MÔ · 2024 · 2026</span></div>
    )}</div>}
   </div>
   <div className="curtain left-curtain"/><div className="curtain right-curtain"/>
   <div className="booth-bottom">
    <button className="booth-button rustic-action" onClick={shoot} disabled={phase==='capturing'||phase==='printing'} data-interactive>
     <Camera size={13}/>{phase==='ready'?'Guardar':phase==='capturing'?'Fotografando…':phase==='printing'?'Imprimindo…':'Tirar fotos'}
    </button>
    {phase==='ready'&&<button className="booth-button rustic-action" onClick={()=>onPhoto(BOOTH_STRIPS)}>Ampliar imagens</button>}
   </div>
  </div>
  <p className="center-footnote">Eu gosto tanto de nós assim.</p><Folio n={11}/>
 </div>
}
function Page12({onPhoto}){const [taken,setTaken]=useState([]);const [flash,setFlash]=useState(false);const timer=useRef(null);useEffect(()=>()=>clearTimeout(timer.current),[]);const shoot=()=>{if(flash)return;if(taken.length>=3){setTaken([]);return}playSceneSound('shutter');setFlash(true);clearTimeout(timer.current);timer.current=setTimeout(()=>{setFlash(false);setTaken(x=>[...x,INSTANT_IDS[x.length]])},220)};return <div className="scene-page scene-camera"><div className="camera-tabletop" aria-hidden="true"/><div className="camera-projector-light" aria-hidden="true"/><Header n={12} eyebrow={PAGE_COPY[12].eyebrow} title={PAGE_COPY[12].title}/><div className="camera-layout"><div className="instant-camera"><div className="camera-top"><span>nostalgia 35</span><span>✦</span></div><div className="camera-lens"><div className="lens-inner"/></div><button data-interactive className="shutter" onClick={shoot} disabled={flash} aria-label={taken.length>=3?'Reiniciar fotos':'Tirar fotografia'} title={taken.length>=3?'Reiniciar fotos':'Tirar fotografia'}>{taken.length>=3?<RefreshCw size={18}/>:<Camera size={20}/>}</button><div className="print-slot"/><span className="camera-count" aria-live="polite">{String(taken.length).padStart(2,'0')} / 03</span></div><div className="instant-output">{taken.length===0?<div className="print-placeholder">Seu sorriso fica comigo ♡</div>:taken.map((id,i)=><div className={`instant-print print-${i}`} key={`${id}-${i}`}><Photo id={id} onClick={()=>onPhoto(id)} caption={false}/><span>nós dois ♡</span></div>)}</div></div><div className={`camera-flash ${flash?'flash-active':''}`}/><p className="center-footnote">Se eu pudesse, guardaria cada sorriso seu.</p><Folio n={12}/></div>}
function Page13({onPhoto}){return <div className="scene-page scene-little-things"><Header n={13} eyebrow={PAGE_COPY[13].eyebrow} title={PAGE_COPY[13].title}/><div className="details-layout"><div className="details-photos">{[19,20,23].map(id=><Photo key={id} id={id} caption={false} onClick={()=>onPhoto(id)}/>)}</div><div className="details-copy"><span className="script-label">Nosso jeitinho...</span><p>{PAGE_COPY[13].paragraphs[0]}</p><p>E claro, nossas casquinhas de baunilha com cobertura de creme de avelã. Essas não podiam faltar.</p><div className="little-tag">minha companhia favorita desde 2024 ♡</div></div></div><Folio n={13}/></div>}
function Page14({onPhoto}){const [lit,setLit]=useState(false);const room=useRef(null);const lamp=useRef(null);const litRef=useRef(false);function illuminate(){if(litRef.current)return;litRef.current=true;playSceneSound('switch');setLit(true)}function move(e){if(litRef.current)return;const r=e.currentTarget.getBoundingClientRect();room.current.style.setProperty('--flash-x',`${(e.clientX-r.left)/r.width*100}%`);room.current.style.setProperty('--flash-y',`${(e.clientY-r.top)/r.height*100}%`);const target=lamp.current.getBoundingClientRect();const x=target.left+target.width/2,y=target.top+target.height*.25;if(Math.hypot(e.clientX-x,e.clientY-y)<Math.max(17.16,r.width*.0858))illuminate()}return <div className="scene-page scene-lamp"><Header n={14} eyebrow={PAGE_COPY[14].eyebrow} title={PAGE_COPY[14].title}/><div ref={room} className={`dark-room ${lit?'room-lit':''}`} onPointerDown={e=>{if(litRef.current||e.target.closest('button'))return;e.currentTarget.setPointerCapture(e.pointerId);move(e)}} onPointerMove={move} data-interactive>
 <div className="room-floor"/><div className="room-sidewall"/><div className="room-bookshelf"><i/><i/><i/><i/></div><div className="room-window">{lit&&<Photo id={1} caption={false} onClick={()=>onPhoto(1)}/>}</div><div className="room-chalkboard">M + G<span>♡</span></div><div className="room-note note-a">Eu escolheria você de novo.</div><div className="room-note note-b">Meu lugar favorito é com você.</div><svg className={`room-heart ${lit?'heart-powered':''}`} viewBox="0 0 300 300" aria-hidden="true"><path d="M150 275C120 225 15 165 15 90C15 15 110 5 150 70C190 5 285 15 285 90C285 165 180 225 150 275Z"/></svg><div className="room-bed"/><div className="room-rug"/><div className="room-extra-frame">{lit&&<Photo id={11} caption={false} onClick={()=>onPhoto(11)}/>}</div><div className="room-wall-art">{lit?<Photo id={21} onClick={()=>onPhoto(21)} caption={false}/>:<span>♡</span>}</div><div className="room-table"/><button ref={lamp} className="lamp-object" aria-label="Acender o abajur" onClick={illuminate} disabled={lit}><span className="lamp-shade"/><span className="lamp-foot"/><span className="lamp-light"/></button><div className="dark-layer"/>
 </div><div className="lamp-controls">{lit?<SmallButton onClick={()=>{litRef.current=false;setLit(false)}}>Apagar e brincar de novo</SmallButton>:<span className="tap-hint">Passe a luz pelo quarto e encontre o abajur.</span>}</div><p className="center-footnote">{lit?'É você que deixa meus dias mais bonitos.':'Mesmo nos dias mais escuros, quero estar com você.'}</p><Folio n={14}/></div>}
function Page15({active}){const [locked,setLocked]=useState(false);const cues=useRef([]);function clearCues(){cues.current.forEach(clearTimeout);cues.current=[]}useEffect(()=>()=>clearCues(),[active]);function lock(){setLocked(true);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;cues.current=[setTimeout(()=>playSceneSound('latch'),reduced?0:480),setTimeout(()=>playSceneSound('splash'),reduced?240:1800)]}return <div className="scene-page scene-river"><Header n={15} eyebrow={PAGE_COPY[15].eyebrow} title={PAGE_COPY[15].title}/><div className={`river-picture ${locked?'lock-closed':''}`}><svg className="paris-tower" viewBox="0 0 100 190" aria-hidden="true"><path d="M49 0h2l4 45 10 63 28 78H68l-8-30H40l-8 30H7l28-78 10-63ZM42 143h16l-8-36ZM41 96h18l-9-35Z" fill="currentColor"/><path d="M29 108h42M35 82h30M17 159h66" stroke="currentColor" strokeWidth="5"/></svg><Starfield count={12}/><div className="river-moon"/><div className="river-skyline"/><div className="river-water"/><div className="bridge-rail"/><div className="bridge-arch"/><span className="tiny-lock lock-a">♡</span><span className="tiny-lock lock-b">♡</span><button className="heart-lock" data-interactive aria-label="Fechar nosso cadeado" disabled={locked} onClick={lock}><svg className="heart-plate" viewBox="0 0 100 95" aria-hidden="true"><defs><linearGradient id="lock-brass" x2="1" y2="1"><stop stopColor="#f2d194"/><stop offset=".6" stopColor="#b98c4b"/><stop offset="1" stopColor="#e6bd79"/></linearGradient></defs><path d="M50 91C39 80 2 55 2 29C2 1 36 -5 50 20C64 -5 98 1 98 29C98 55 61 80 50 91Z" fill="url(#lock-brass)" stroke="#e4c793" strokeWidth="2"/></svg><span className="lock-initials">M + G</span></button><div className="bridge-lock-post" aria-hidden="true"/><svg className="falling-key" viewBox="0 0 64 32" aria-hidden="true"><path fill="currentColor" d="M16 2a14 14 0 1 0 12 21h13v7h8v-7h7v-7H29A14 14 0 0 0 16 2Z"/><circle cx="15" cy="15" r="5" fill="#927147"/></svg><div className="river-splash"><i/><i/><i/></div><p className="river-quote">{locked?'Quero continuar escolhendo você, todos os dias.':'Uma vida inteira ao seu lado.'}</p></div><div className="river-controls">{locked?<SmallButton className="rustic-action" onClick={()=>{clearCues();setLocked(false)}}>Ver outra vez</SmallButton>:<span className="tap-hint">Toque no nosso cadeado</span>}</div><Folio n={15}/></div>}
function Page16({onPhoto}){return <div className="scene-page scene-promise"><Header n={16} eyebrow={PAGE_COPY[16].eyebrow} title={PAGE_COPY[16].title}/><div className="promise-layout"><RingReveal onPhoto={onPhoto}/><div className="promise-copy"><p>{PAGE_COPY[16].paragraphs[0]}</p><p>{PAGE_COPY[16].paragraphs[1]}</p><span className="promise-script">Eu escolheria você. Sempre.</span></div></div><Folio n={16}/></div>}
function Page17({onPhoto}){return <div className="scene-page scene-future"><Header n={17} eyebrow={PAGE_COPY[17].eyebrow} title={PAGE_COPY[17].title}/><div className="future-layout"><div className="future-copy"><p>{PAGE_COPY[17].paragraphs[0]}</p><p>{PAGE_COPY[17].paragraphs[1]}</p><p>{PAGE_COPY[17].paragraphs[2]}</p><strong>Que venham todos os nossos amanhãs.</strong></div><div className="future-photo"><Photo id={23} onClick={()=>onPhoto(23)}/></div></div><Folio n={17}/></div>}
function fmtTime(s){s=Math.floor(Number.isFinite(s)?s:0);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`}
function Page18({onPhoto,player}){return <div className="scene-page scene-music"><Header n={18} eyebrow={PAGE_COPY[18].eyebrow} title={PAGE_COPY[18].title}/><div className="music-layout"><div className="flute-photo"><Photo id={24} onClick={()=>onPhoto(24)}/><div className="music-notes"><span>♪</span><span>♫</span><span>♬</span></div></div><div className="music-copy"><span className="script-label">Meu amor,</span><p>{PAGE_COPY[18].paragraphs[0]}</p><p>{PAGE_COPY[18].paragraphs[1]}</p><div className="music-player"><span className="music-name">Feita para este momento</span><span className="music-instruction"><Volume2 size={15}/><span className="volume-bars" aria-hidden="true"><i/><i/><i/></span> Aumenta um pouquinho o volume</span><button className="music-play" data-interactive onClick={player.toggle}>{player.playing?<Pause size={18} fill="currentColor"/>:<Play size={18} fill="currentColor"/>}{player.playing?'Pausar nossa melodia':'Ouvir nossa próxima melodia'}</button><div className="audio-track" aria-label="Progresso da música"><div style={{width:`${player.duration?player.time/player.duration*100:0}%`}}/></div><span className="audio-times">{fmtTime(player.time)} / {player.duration?fmtTime(player.duration):'--:--'}</span>{player.error&&<small className="audio-error">{player.error}</small>}</div></div></div><span className="final-heart">Meu presente é poder viver a vida com você. ♡</span><Folio n={18}/></div>}

export default function PageScene({ n, active, onPhoto, player }) {
  switch(n) {
    case 1:return <Page1/>
    case 2:return <Page2/>
    case 3:return <Page3 active={active}/>
    case 4:return <Page4 onPhoto={onPhoto}/>
    case 5:return <Page5/>
    case 6:return <Page6/>
    case 7:return <Page7 active={active}/>
    case 8:return <Page8 onPhoto={onPhoto}/>
    case 9:return <Page9 onPhoto={onPhoto}/>
    case 10:return <Page10/>
    case 11:return <Page11 onPhoto={onPhoto}/>
    case 12:return <Page12 onPhoto={onPhoto}/>
    case 13:return <Page13 onPhoto={onPhoto}/>
    case 14:return <Page14 onPhoto={onPhoto}/>
    case 15:return <Page15 active={active}/>
    case 16:return <Page16 onPhoto={onPhoto}/>
    case 17:return <Page17 onPhoto={onPhoto}/>
    case 18:return <Page18 onPhoto={onPhoto} player={player}/>
    default:return null
  }
}
