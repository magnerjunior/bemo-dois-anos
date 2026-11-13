import React,{lazy,Suspense,useEffect,useRef,useState} from 'react'
import Photo from './Photo.jsx'
import CoverArt from './CoverArt.jsx'
import {WELCOME} from '../data/welcome.js'

const loadAlbum = () => import('../App.jsx')
const Album = lazy(loadAlbum)
const prepareAlbum = () => { loadAlbum().catch(() => {}) }


function GiftBox(){return <span className="gift-object" aria-hidden="true"><span className="gift-glow"/><span className="gift-body"/><span className="gift-lid"><i/><b/><em/></span><span className="gift-tag">Para Mô<br/><small>com amor, Bê</small></span></span>}
function Welcome({onReveal}){
 const [opening,setOpening]=useState(false),stage=useRef(null),started=useRef(false)
 const gift = useRef(null)
 useEffect(() => {
  if (!('IntersectionObserver' in window)) return
  const observer = new IntersectionObserver(entries => {
   if (!entries.some(entry => entry.isIntersecting)) return
   prepareAlbum()
   observer.disconnect()
  }, {rootMargin:'480px'})
  observer.observe(gift.current)
  return () => observer.disconnect()
 }, [])
 useEffect(()=>{
  if(!opening)return
  let cancelled=false
  let context
  import('gsap').then(({gsap})=>{
   if(cancelled)return
   const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches
   context=gsap.context(()=>{
     const t=gsap.timeline({onComplete:onReveal})
     if(reduced){
      t.to('.gift-cinema',{opacity:1,duration:.25})
       .set('.gift-object',{opacity:0})
       .to('.gift-album',{opacity:1,y:0,scale:1,duration:.5})
       .to({}, {duration:.8})
      return
     }
     t.fromTo('.gift-cinema',{opacity:0},{opacity:1,duration:.35})
     .to('.gift-object',{scale:1.12,duration:.65,ease:'power2.inOut'})
     .to('.gift-object',{rotation:3,repeat:5,yoyo:true,duration:.09})
     .to('.gift-object',{rotation:0,scale:1.22,duration:.35})
     .to('.gift-lid',{y:-190,x:65,rotation:26,opacity:0,duration:.8,ease:'power2.out'})
     .to('.gift-glow',{opacity:1,scale:2,duration:.5},'<')
     .fromTo('.gift-confetti i',{y:-160,opacity:0},{y:()=>innerHeight*.7,opacity:1,rotation:i=>i%2?420:-340,duration:2.5,stagger:.018,ease:'power1.in'},'<')
     .to('.gift-object',{opacity:0,y:80,scale:.8,duration:.7},2.2)
     .to('.gift-album',{opacity:1,y:0,scale:1,rotation:-3,duration:1.2,ease:'power2.out'},2.3)

   },stage)
  }).catch(()=>{if(!cancelled)onReveal()})
  return()=>{
   cancelled=true
   context?.revert()
  }
 },[opening,onReveal])
 function open(){if(started.current)return;started.current=true;prepareAlbum();setOpening(true)}
 return <div className="welcome" ref={stage}>
 <main className="welcome-content" inert={opening}>
 <header className="welcome-top"><span>M <i>♡</i> G</span><span>15 NOVEMBRO 2026</span></header>
 <section className="welcome-hero"><p className="welcome-eyebrow">PARA MINHA MÔ</p><h1>{WELCOME.title}<em>{WELCOME.subtitle}</em></h1><p className="welcome-intro">{WELCOME.intro}</p><div className="welcome-photos">{WELCOME.photos.map((id,i)=><div className={`welcome-photo photo-${i}`} key={id}><Photo id={id} caption={false} loading="eager"/></div>)}</div><span className="welcome-scroll" aria-hidden="true">↓</span></section>
 <section className="welcome-letter"><span className="welcome-flower" aria-hidden="true">✧</span><p className="welcome-eyebrow">DOIS ANOS DE NÓS</p><h2>Que sorte a minha, <em>Mô.</em></h2>{WELCOME.paragraphs.map(p=><p key={p}>{p}</p>)}<p className="welcome-signature">Com amor, seu Bê</p></section>
 <section className="welcome-gift" ref={gift}><p className="welcome-eyebrow">FIZ UMA COISA PARA VOCÊ</p><h2>E não acaba por aí.<br/><em>Você ganhou um presente.</em></h2><button className="gift-trigger" onClick={open} aria-label="Revelar seu presente"><GiftBox/></button><p className="gift-instruction">Toque na caixa para revelar o seu presente.</p><small>Para Gabriella, com amor, de Magner.</small></section>
 </main>
 {opening&&<div className="gift-cinema" role="dialog" aria-modal="true" aria-label="Revelando seu presente" tabIndex={-1} ref={el=>el?.focus()}><div className="cinema-light"/><GiftBox/><div className="gift-album"><CoverArt/></div><div className="gift-confetti" aria-hidden="true">{Array.from({length:34},(_,i)=><i key={i} style={{left:`${8+(i*37)%85}%`,background:['#d0aa63','#e7d0a6','#a85c70','#f4e4ca'][i%4]}}/>)}</div><p role="status">Uma história que eu quero guardar com você.</p></div>}
 </div>
}
export default function Experience(){
 const [album,setAlbum]=useState(()=>location.hash==='#album' || new URLSearchParams(location.search).has('album'))
 const reveal=React.useCallback(()=>{history.replaceState(null,'','#album');setAlbum(true)},[])
 const backToWelcome=React.useCallback(()=>{
  history.replaceState(null,'',location.pathname)
  setAlbum(false)
 },[])
 return album?<Suspense fallback={<div className="album-loading" role="status">Preparando o álbum…</div>}><div className="album-arrival"><Album onBackToWelcome={backToWelcome}/></div></Suspense>:<Welcome onReveal={reveal}/>
}
