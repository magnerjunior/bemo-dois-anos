import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ArrowLeft, BookOpen, ChevronDown, ChevronLeft, ChevronRight, Maximize2, Minimize2, Pause, Play } from 'lucide-react'
import CoverArt from './components/CoverArt.jsx'
import SaveAlbum from './components/SaveAlbum.jsx'
import PhotoLightbox from './components/PhotoLightbox.jsx'
import { duckSceneAudio, unlockSceneAudio } from './components/sceneAudio.js'
import { READING_ANGLE, usePageTurn } from './components/usePageTurn.js'
import PageScene from './scenes/Pages.jsx'
import { PAGE_TITLES } from './data/album.js'

const TOTAL_PAGES = PAGE_TITLES.length
const AlbumScene = memo(PageScene)

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function BackgroundDust(){return <div className="ambient-dust" aria-hidden="true">{Array.from({length:19},(_,i)=><span key={i} style={{left:`${(i*41+11)%99}%`,top:`${(i*29+6)%96}%`,animationDelay:`${(i*.7)%8}s`,animationDuration:`${5+(i%7)}s`}}/>)}</div>}


export default function App({ onBackToWelcome }){
  const [opened,setOpened] = useState(false)
  const [opening,setOpening] = useState(false)
  const [closing,setClosing] = useState(false)
  const [page,setPage] = useState(1)
  const [showSwipeHint,setShowSwipeHint] = useState(true)
  const [musicStarted,setMusicStarted] = useState(false)
  const [turn,setTurn] = useState(null)
  const [zoomPhoto,setZoomPhoto] = useState(null)
  const [playing,setPlaying] = useState(false)
  const [time,setTime] = useState(0)
  const [duration,setDuration] = useState(0)
  const [audioError,setAudioError] = useState('')
  const [isFullscreen,setFullscreen] = useState(false)
  const bookRef = useRef(null)
  const coverRef = useRef(null)
  const coverGesture = useRef(null)
  const flipRef = useRef(null)
  const sheetHost = useRef(null)
  const visited = useRef(new Set([1,2]))
  const audioRef = useRef(null)
  const paperSound = useRef(null)
  const swipeRef = useRef(null)
  const suppressSwipeClick = useRef(false)
  const lockedRef = useRef(false)
  const pendingStep = useRef(0)

  const openBook = useCallback(() => {
    if(opened||opening||closing) return
    unlockSceneAudio()
    setOpening(true)
    const tl=gsap.timeline({onComplete:()=>{
      gsap.set(bookRef.current,{scale:1})
      gsap.set(coverRef.current,{autoAlpha:0})
      setOpened(true)
      setOpening(false)
    }})
    tl.to(bookRef.current,{...READING_ANGLE,x:bookRef.current.clientWidth/4,duration:reducedMotion()?0:.47,ease:'power2.inOut'},0)
      .to(coverRef.current,{rotateY:-164,duration:reducedMotion()?0:.75,ease:'power3.inOut'},reducedMotion()?0:.08)
      .to(bookRef.current,{scale:1,duration:reducedMotion()?0:.47,ease:'power2.out'},0)
  },[opened,opening,closing])

  const closeBook = useCallback(() => {
    if(!opened||lockedRef.current||playing||closing) return
    pendingStep.current = 0
    setClosing(true)
    setOpened(false)
    setPage(1)
    gsap.set(coverRef.current,{autoAlpha:1,rotateY:-164})
    gsap.timeline({onComplete:()=>setClosing(false)})
      .to(coverRef.current,{rotateY:0,duration:reducedMotion()?0:.72,ease:'power3.inOut'})
      .to(bookRef.current,{rotateY:-10,rotateX:6,rotateZ:-1.5,x:0,scale:.95,duration:reducedMotion()?0:.72,ease:'power2.inOut'},0)
  },[opened,playing,closing])

  const turnTo = useCallback((next) => {
    if(!opened || lockedRef.current || next<1 || next>TOTAL_PAGES || next===page || zoomPhoto) return
    unlockSceneAudio()
    lockedRef.current=true
    setShowSwipeHint(false)
    const direction = next>page?1:-1
    const first=next%2?next:next-1
    visited.current.add(first);visited.current.add(first+1)
    const adjacent = Math.abs(next - page) === 1
    const sameSpread = Math.floor((page - 1) / 2) === Math.floor((next - 1) / 2)
    const kind = adjacent ? (sameSpread ? 'pan' : 'flip') : 'jump'
    setTurn({from:page,to:next,dir:direction,kind})
    setPage(next)
    if (kind === 'flip' && paperSound.current) {
      const sound = paperSound.current
      sound.volume = audioRef.current?.paused === false ? .3 : .7
      sound.currentTime = 0
      sound.play().catch(() => {})
    }
  },[opened,page,zoomPhoto])

  usePageTurn({turn,flipRef,sheetHost,bookRef,setTurn,lockedRef})

  const stepPage = useCallback(direction => {
    if (!opened || zoomPhoto) return
    if (lockedRef.current) {
      pendingStep.current = direction
      return
    }
    turnTo(page + direction)
  }, [opened, page, turnTo, zoomPhoto])

  useEffect(() => {
    if (turn || !pendingStep.current) return
    const direction = pendingStep.current
    pendingStep.current = 0
    stepPage(direction)
  }, [turn, stepPage])


  useEffect(() => {
    coverRef.current?.focus({preventScroll:true})
  }, [])

  useEffect(() => {
    const sound = new Audio('/audio/folha.wav?v=2')
    sound.preload = 'auto'
    paperSound.current = sound
    return () => {
      paperSound.current = null
      sound.pause()
      sound.removeAttribute('src')
      sound.load()
    }
  }, [])

  useEffect(() => {
    if (!opened || page !== 1 || !showSwipeHint) return
    const timer = setTimeout(() => setShowSwipeHint(false), 4200)
    return () => clearTimeout(timer)
  }, [opened, page, showSwipeHint])

  useEffect(()=>{
    const onKey=e=>{
      if(e.target instanceof HTMLSelectElement)return
      if(e.key==='Escape'){setZoomPhoto(null);return}
      if(e.target instanceof Element && e.target.closest('button,input,[role=dialog]')&& !['ArrowRight','ArrowLeft'].includes(e.key))return
      if(!opened || zoomPhoto) return
      if(e.key==='ArrowRight'&&!e.repeat)stepPage(1)
      if(e.key==='ArrowLeft'&&!e.repeat)stepPage(-1)
      if(e.key==='Home')turnTo(1)
      if(e.key==='End')turnTo(TOTAL_PAGES)
    }
    window.addEventListener('keydown',onKey)
    return()=>window.removeEventListener('keydown',onKey)
  },[opened,zoomPhoto,turnTo,stepPage])

  const toggleMusic=useCallback(async()=>{
    const audio=audioRef.current
    if(!audio)return
    if(!audio.paused){audio.pause();setPlaying(false);return}
    setAudioError('')
    try {await audio.play();setPlaying(true);setMusicStarted(true)}
    catch {setPlaying(false);setAudioError('A melodia não está disponível agora. Tente novamente em instantes.')}
  },[])

  const toggleFullscreen=async()=>{
    try {if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}
    catch {/* Alguns navegadores não permitem; o álbum permanece funcional. */}
  }
  useEffect(()=>{const onChange=()=>setFullscreen(Boolean(document.fullscreenElement));document.addEventListener('fullscreenchange',onChange);return()=>document.removeEventListener('fullscreenchange',onChange)},[])

  function startCoverGesture(event) {
    if (event.isPrimary && event.button === 0) {
      coverGesture.current = {id:event.pointerId,x:event.clientX,y:event.clientY}
    }
  }

  function endCoverGesture(event) {
    const start = coverGesture.current
    coverGesture.current = null
    if (start?.id !== event.pointerId) return
    const dx = Math.abs(event.clientX-start.x)
    const dy = Math.abs(event.clientY-start.y)
    if (dx >= 23 && dx > dy * 1.2) {
      suppressSwipeClick.current = true
      openBook()
    }
  }

  function onSwipeStart(event) {
    if (!event.isPrimary || event.button !== 0) return
    swipeRef.current = null
    suppressSwipeClick.current = false
    if (!opened) return
    if (event.target.closest('button, [data-interactive], input, select, a')) return
    if (event.pointerType === 'mouse' && !event.target.closest('.polaroid-clickable')) event.preventDefault()
    swipeRef.current = { id:event.pointerId, x:event.clientX, y:event.clientY, time:event.timeStamp }
  }

  function onSwipeMove(event) {
    const swipe = swipeRef.current
    if (swipe?.id !== event.pointerId || swipe.captured) return
    const dx = Math.abs(event.clientX - swipe.x)
    const dy = Math.abs(event.clientY - swipe.y)
    if (dy > 14 && dy > dx) {
      swipeRef.current = null
    } else if (dx >= 9 && dx > dy * 1.2) {
      event.currentTarget.setPointerCapture(event.pointerId)
      swipe.captured = true
    }
  }

  function cancelSwipe(event) {
    if (swipeRef.current?.id === event.pointerId) swipeRef.current = null
  }

  function onSwipeEnd(event) {
    const swipe = swipeRef.current
    if (swipe?.id !== event.pointerId) return
    swipeRef.current = null
    const dx = event.clientX - swipe.x
    const dy = event.clientY - swipe.y
    const distance = Math.abs(dx)
    const threshold = Math.min(42, Math.max(24, event.currentTarget.clientWidth * .065))
    const quickFlick = distance >= 16 && distance / Math.max(1, event.timeStamp - swipe.time) > .34
    const horizontal = distance > Math.abs(dy) * 1.2
    suppressSwipeClick.current = swipe.captured || (horizontal && distance >= 9)
    if (horizontal && (distance >= threshold || quickFlick)) stepPage(dx < 0 ? 1 : -1)
  }

  function preventTapAfterSwipe(event) {
    if (!suppressSwipeClick.current || event.detail === 0) return
    suppressSwipeClick.current = false
    event.preventDefault()
    event.stopPropagation()
  }

  const pair=page%2?page:page-1
  const fromPair=turn?(turn.from%2?turn.from:turn.from-1):pair
  const visiblePages=turn?.kind==="flip"?[Math.min(pair,fromPair),Math.max(pair,fromPair)+1]:[pair,pair+1]
  const player=useMemo(()=>({playing,time,duration,error:audioError,toggle:toggleMusic}),[playing,time,duration,audioError,toggleMusic])
  return <div className="app-shell">
    <BackgroundDust/>
    <div className="room-halo" aria-hidden="true"/>
    <div className="background-rose rose-left" aria-hidden="true">✿</div>
    <div className="background-rose rose-right" aria-hidden="true">✿</div>
    <header className="app-header" inert={zoomPhoto!==null}>
      {!opened&&!opening&&!closing&&<button type="button" className="back-to-welcome" onClick={onBackToWelcome} aria-label="Voltar à declaração" title="Voltar à declaração"><ArrowLeft size={16}/></button>}<div className="brand-label"><span className="brand-star">✧</span><span>BÊ & MÔ</span><i>Dois anos de nós</i></div><div className="header-right">{opened&&musicStarted&&<button className="floating-music" onClick={toggleMusic} aria-label={playing?"Pausar melodia":"Retomar melodia"} title={playing?"Pausar melodia":"Retomar melodia"}>{playing?<Pause size={17}/>:<Play size={17}/>}</button>}<span>15 NOV 2024 — 15 NOV 2026</span><button onClick={toggleFullscreen} aria-label={isFullscreen?'Sair de tela cheia':'Tela cheia'} title="Tela cheia">{isFullscreen?<Minimize2 size={16}/>:<Maximize2 size={16}/>}</button></div></header>
    <main inert={zoomPhoto!==null} onPointerDown={onSwipeStart} onPointerMove={onSwipeMove} onPointerUp={onSwipeEnd} onPointerCancel={cancelSwipe} onLostPointerCapture={event=>{if(event.target===event.currentTarget)cancelSwipe(event)}} onClickCapture={preventTapAfterSwipe} className={`book-area ${!opened?'book-is-closed':''} ${turn?.kind==='flip'?'camera-wide':''}`}>
      <div className="book-spotlight"/>
      <div className="book-cast-shadow"/>
      <div className={`book-shell ${opened||opening?"spread-open":""}`} ref={bookRef}>
        <div className="book-spine"/><div className="cover-page-edge" aria-hidden="true"/><div className="book-thickness book-thickness-back"/><div className="book-thickness book-thickness-middle"/>
        <div className="next-page-sliver" aria-hidden="true"><span>✧</span><span>♡</span><span>✧</span></div>
        <div className="paper-window" ref={sheetHost}>
          <div className="paper-fibers" aria-hidden="true"/>
          <div className="book-gutter" aria-hidden="true"/>
          {(opened||opening)&&[...visited.current].map(n=><div className={`page-display ${n%2?"leaf-left":"leaf-right"}`} data-page={n} data-peek={!turn&&n!==page} key={n} hidden={!visiblePages.includes(n)} inert={n!==page||Boolean(turn)}><AlbumScene n={n} active={opened&&n===page&&!turn} onPhoto={setZoomPhoto} player={n===TOTAL_PAGES?player:null}/></div>)}
          {turn?.kind==="flip"&&<div className="flip-sheet" ref={flipRef} aria-hidden="true" inert/>}
        </div>
        <button ref={coverRef} onPointerDown={startCoverGesture} onPointerUp={endCoverGesture} onPointerCancel={()=>{coverGesture.current=null}} className={`book-cover ${opened?'cover-hidden':''}`} onClick={openBook} disabled={opening||opened||closing} aria-label="Abrir o álbum Bê e Mô"><CoverArt/></button>
        {opened && <div className="book-left-binding" aria-hidden="true"/>}
      </div>
    </main>
    <footer className="app-footer" inert={zoomPhoto!==null}>
      {!opened ? <div className="footer-closed">{!opening&&!closing&&<SaveAlbum/>}</div>:
      <div className="navigation">
        <button className="nav-btn" onClick={()=>turnTo(page-1)} disabled={page===1||Boolean(turn)} aria-label="Página anterior"><ChevronLeft size={21}/></button>
        <div className="progress-middle">
          <div className="page-picker">
            <span className="page-position" aria-hidden="true">Página {String(page).padStart(2,'0')} de {TOTAL_PAGES}</span>
            <ChevronDown size={12} aria-hidden="true"/>
            <select aria-label="Ir para a página" value={page} disabled={Boolean(turn)} onChange={e=>turnTo(Number(e.target.value))}>
              {PAGE_TITLES.map((title,index)=><option key={title} value={index+1}>{index+1}. {title}</option>)}
            </select>
          </div>
          <div className="progress-track"><span style={{width:`${page/TOTAL_PAGES*100}%`}}/></div>
          <span className="nav-page-name" aria-live={turn?'off':'polite'}>{page===1&&showSwipeHint?'Deslize para folhear':PAGE_TITLES[page-1]}</span>
        </div>
        <button className="nav-btn nav-next" onClick={()=>turnTo(page+1)} disabled={page===TOTAL_PAGES||Boolean(turn)} aria-label="Próxima página"><ChevronRight size={21}/></button>
        <button className="nav-close" onClick={closeBook} disabled={Boolean(turn)||playing} aria-label={playing?'Pause a música antes de fechar o livro':'Fechar o livro'} title={playing?'Pause a música antes de fechar':'Fechar o álbum'}><BookOpen size={17}/></button>
      </div>}
    </footer>
    <audio ref={audioRef} src="/audio/musica-teclado.mp3" preload="none" loop={false}
      onLoadedMetadata={e=>setDuration(e.currentTarget.duration||0)}
      onTimeUpdate={e=>setTime(e.currentTarget.currentTime)}
      onPlay={()=>{duckSceneAudio(true);setPlaying(true)}} onPause={()=>{duckSceneAudio(false);setPlaying(false)}}
      onEnded={()=>{duckSceneAudio(false);setPlaying(false);setTime(0)}}
      onError={()=>setAudioError('A melodia não está disponível agora. Tente novamente em instantes.')}/>
    {zoomPhoto!==null&&<PhotoLightbox id={zoomPhoto} onClose={()=>setZoomPhoto(null)}/>}
  </div>
}
