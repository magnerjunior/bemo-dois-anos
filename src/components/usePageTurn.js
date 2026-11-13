import {useLayoutEffect} from 'react'
import {gsap} from 'gsap'

// Odd/even navigation moves the camera; only crossing a spread turns paper.
export const READING_ANGLE = { rotateX:5, rotateY:-3, rotateZ:-.35 }

export function usePageTurn({turn,flipRef,sheetHost,bookRef,setTurn,lockedRef}) {
 useLayoutEffect(()=>{
  if(!turn)return
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const book=bookRef.current,width=book.clientWidth/2
  const finish=()=>{
   // An orientation change can alter the leaf width while it is moving.
   gsap.set(book,{x:book.clientWidth/4*(turn.to%2?1:-1),scale:1,...READING_ANGLE})
   setTurn(null)
   lockedRef.current=false
  }
  const cameraX=turn.to%2?width/2:-width/2
  if(reduced||turn.kind==='jump'){
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
  const sheet=flipRef.current
  // Short screens have less space above and below the page for projection.
  const verticalClearance = Math.max(0, book.parentElement.clientHeight - book.clientHeight)
  const leafDepth = gsap.utils.clamp(.04, .24, (verticalClearance - 28) / 440)
  const flex = gsap.utils.clamp(.18, 1, (verticalClearance - 30) / 155)
  const edgeSteps = Array.from({ length:17 }, (_, index) => {
   const t = index / 16
   return { x:t * 100, wave:Math.sin(Math.PI * t) ** 2, tip:t ** 3 }
  })
  const frontNumber=turn.dir===1?turn.from:turn.to
  const backNumber=turn.dir===1?turn.to:turn.from
  const frontSource=sheetHost.current.querySelector(`[data-page="${frontNumber}"]`)
  const backSource=sheetHost.current.querySelector(`[data-page="${backNumber}"]`)
  const leaf = document.createElement('div')
  leaf.className = 'turning-leaf'
  const shades = []
  const faces = []

  for (const [source, side] of [[frontSource, 'front'], [backSource, 'back']]) {
   const face = document.createElement('div')
   face.className = `turning-face turning-face-${side}`
   const copy = source.cloneNode(true)
   copy.hidden = false
   copy.className = 'page-display'
   delete copy.dataset.page
   delete copy.dataset.peek
   const shade = document.createElement('div')
   shade.className = 'turning-shade'
   face.append(copy, shade)
   leaf.append(face)
   shades.push(shade)
   faces.push(face)
  }
  sheet.replaceChildren(leaf)
  const state={progress:turn.dir===1?0:1}
  function draw(){
   const p = state.progress
   const lift = Math.sin(Math.PI * p)
   frameCamera(turn.dir === 1 ? p : 1 - p)
   const travel = turn.dir === 1 ? p : 1 - p
   const curl = lift * flex
   const flutter = Math.sin(Math.PI * travel * 2) * curl
   // The spine stays fixed. The free edge rises and eases into the new page.
   leaf.style.transform = `scaleZ(${leafDepth}) rotateY(${-180 * p}deg) skewY(${-3.4 * curl + 1.1 * flutter}deg)`
   // Shape the free edge and the upper and lower lips of the paper.
   // The front and back use the same silhouette, mirrored at the spine.
   const top = edgeSteps.map(({x,wave,tip}) => [x, curl * (1.65 * wave + .3 * tip) + .22 * flutter * wave])
   const bottom = edgeSteps.map(({x,wave,tip}) => [x, 100 - curl * (.75 * wave + 1.8 * tip)]).reverse()
   const edge = [...top, [100 - curl, 26], [100 - 1.9 * curl, 54], [100 - curl, 81], ...bottom]
   for (const [index, face] of faces.entries()) {
    face.style.clipPath = lift < .005 ? 'none' : `polygon(${edge.map(([x,y]) =>
     `${(index ? 100-x : x).toFixed(2)}% ${y.toFixed(2)}%`
    ).join(',')})`
   }
   leaf.style.setProperty('--fold-glint', `${21 + 58 * travel}%`)
   shades[0].style.opacity = lift * .72
   shades[1].style.opacity = lift * .56
  }
  draw()
  const flip = gsap.to(state,{
   progress:turn.dir===1?1:0,
   duration:.89,
   ease:'sine.inOut',
   onUpdate:draw,
   onComplete:finish,
  })
  return()=>{flip.kill();sheet.replaceChildren()}
 },[turn])
 // Keep the focused page centred after orientation changes.
 useLayoutEffect(()=>{
  const onResize=()=>{if(!lockedRef.current){const active=sheetHost.current?.querySelector('[data-page]:not([inert]):not([hidden])');if(active)gsap.set(bookRef.current,{x:bookRef.current.clientWidth/4*(Number(active.dataset.page)%2?1:-1)})}}
  window.addEventListener('resize',onResize);return()=>window.removeEventListener('resize',onResize)
 },[])
}
