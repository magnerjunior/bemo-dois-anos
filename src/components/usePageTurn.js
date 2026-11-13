import {useLayoutEffect} from 'react'
import {gsap} from 'gsap'

// Odd/even navigation moves the camera; only crossing a spread turns paper.
export const READING_ANGLE = { rotateX:5, rotateY:-3, rotateZ:-.35 }

export function usePageTurn({turn,sheetHost,bookRef,setTurn,lockedRef}) {
 useLayoutEffect(()=>{
  if(!turn)return
  const book=bookRef.current,width=book.clientWidth/2
  const finish=()=>{
   // An orientation change can alter the leaf width while it is moving.
   gsap.set(book,{x:book.clientWidth/4*(turn.to%2?1:-1),scale:1,...READING_ANGLE})
   setTurn(null)
   lockedRef.current=false
  }
  const cameraX=turn.to%2?width/2:-width/2
  if(turn.reduced||turn.kind==='jump'){
   finish()
   return
  }
  const startX = turn.from % 2 ? width / 2 : -width / 2
  const moveCamera = gsap.quickSetter(book, 'x', 'px')
  function frameCamera(progress) {
   moveCamera(startX + (cameraX - startX) * progress)
  }

  if(turn.kind==='pan'){
   const position = { progress:0 }
   const pan = gsap.to(position, {
    progress:1,
    duration:.49,
    ease:'sine.inOut',
    onUpdate:()=>frameCamera(position.progress),
    onComplete:finish,
   })
   return()=>pan.kill()
  }
  // Short screens have less space above and below the page for projection.
  const verticalClearance = Math.max(0, book.parentElement.clientHeight - book.clientHeight)
  const leafDepth = gsap.utils.clamp(.04, .24, (verticalClearance - 28) / 440)
  const flex = gsap.utils.clamp(.18, 1, (verticalClearance - 30) / 155)
  const front = sheetHost.current.querySelector('.turning-front')
  const back = sheetHost.current.querySelector('.turning-back')
  const frontShade = front.lastElementChild
  const backShade = back.lastElementChild
  const state={progress:turn.dir===1?0:1}
  function draw(){
   const p = state.progress
   const lift = Math.sin(Math.PI * p)
   const travel = turn.dir === 1 ? p : 1 - p
   frameCamera(travel)
   const curl = lift * flex
   const flutter = Math.sin(Math.PI * travel * 2) * curl
   // Both sides pivot around the same spine, with mirrored skew at the free edge.
   const skew = -3.4 * curl + 1.1 * flutter
   front.style.transform = `scaleZ(${leafDepth}) rotateY(${-180 * p}deg) skewY(${skew}deg)`
   back.style.transform = `scaleZ(${leafDepth}) rotateY(${180 * (1 - p)}deg) skewY(${-skew}deg)`
   frontShade.style.opacity = lift * .72
   backShade.style.opacity = lift * .56
  }
  draw()
  const flip = gsap.to(state,{
   progress:turn.dir===1?1:0,
   duration:.89,
   ease:'sine.inOut',
   onUpdate:draw,
   onComplete:finish,
  })
  return()=>{
   flip.kill()
   front.style.removeProperty('transform')
   back.style.removeProperty('transform')
  }
 },[turn])
 // Keep the focused page centred after orientation changes.
 useLayoutEffect(()=>{
  const onResize=()=>{if(!lockedRef.current){const active=sheetHost.current?.querySelector('[data-page]:not([inert]):not([hidden])');if(active)gsap.set(bookRef.current,{x:bookRef.current.clientWidth/4*(Number(active.dataset.page)%2?1:-1)})}}
  window.addEventListener('resize',onResize);return()=>window.removeEventListener('resize',onResize)
 },[])
}
