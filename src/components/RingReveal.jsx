import React, { useEffect, useId, useRef, useState } from 'react'
import Photo from './Photo.jsx'

const START = { x:67, y:207 }
const TIP = { x:67, y:177 }
const SEAT = { x:64, y:135 }
const FINGERS = [
  { x:33, y:140, name:'Mindinho' },
  { ...TIP, name:'Anelar' },
  { x:95, y:194, name:'Dedo médio' },
  { x:121, y:169, name:'Indicador' },
  { x:156, y:117, name:'Polegar' },
]

function position({x,y}) {
  return {left:`${x / 1.8}%`,top:`${y / 2.2}%`}
}

export default function RingReveal({ onPhoto }) {
  const board = useRef(null)
  const gesture = useRef(null)
  const timer = useRef(null)
  const paint = useId()
  const [armed, setArmed] = useState(false)
  const [drag, setDrag] = useState(null)
  const [fitting, setFitting] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [message, setMessage] = useState('Deslize a aliança até o dedo certo.')

  useEffect(()=>()=>clearTimeout(timer.current),[])

  function place(finger) {
    if (fitting || revealed) return
    if (finger.name !== 'Anelar') {
      setMessage('Tente outro dedo.')
      return
    }
    setArmed(false)
    setFitting(true)
    setMessage('Encaixando a aliança…')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    timer.current = setTimeout(()=>{
      setRevealed(true)
      setFitting(false)
      setMessage('A nossa promessa.')
    }, reduced ? 0 : 780)
  }

  function pointerPosition(event) {
    const rect = board.current.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(180, 180 * (event.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(220, 220 * (event.clientY - rect.top) / rect.height)),
    }
  }

  function start(event) {
    if (fitting || revealed || !event.isPrimary || event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    gesture.current = { id:event.pointerId, x:event.clientX, y:event.clientY }
    setArmed(true)
  }

  function move(event) {
    const startPoint = gesture.current
    if (startPoint?.id !== event.pointerId) return
    if (Math.hypot(event.clientX - startPoint.x, event.clientY - startPoint.y) > 5) startPoint.moved = true
    if (startPoint.moved) setDrag(pointerPosition(event))
  }

  function end(event) {
    const startPoint = gesture.current
    if (startPoint?.id !== event.pointerId) return
    gesture.current = null
    if (!startPoint.moved) return
    const { x, y } = pointerPosition(event)
    if (Math.abs(x - TIP.x) <= 13 && y >= 127 && y <= 188) {
      setDrag({x,y})
      place(FINGERS[1])
    } else {
      setDrag(null)
      setMessage('Tente outro dedo.')
    }
  }

  const ring = revealed ? SEAT : drag || START
  const ringStyle = {
    '--ring-from-x': `${ring.x}px`,
    '--ring-from-y': `${ring.y}px`,
    '--ring-tip-x': `${TIP.x}px`,
    '--ring-tip-y': `${TIP.y}px`,
    '--ring-seat-x': `${SEAT.x}px`,
    '--ring-seat-y': `${SEAT.y}px`,
    transform:`translate(${ring.x}px,${ring.y}px)`,
  }
  const ringClass = `ring-band ${fitting?'ring-sliding':revealed?'ring-worn':''}`

  return (
    <div className="ring-game">
      <div className={`rings-photo ${revealed ? 'ring-revealed' : ''}`}>
        <div hidden={!revealed}><Photo id={22} loading="eager" onClick={()=>onPhoto(22)}/></div>
        {!revealed&&<div className="ring-photo-back" aria-hidden="true">M ♡ G</div>}
      </div>
      <div className="ring-board" ref={board} data-interactive>
        <svg viewBox="0 0 180 220" aria-hidden="true">
          <defs>
            <linearGradient id={`${paint}-skin`} x2="1" y2=".22">
              <stop stopColor="#c18d72"/><stop offset=".48" stopColor="#e9bfa0"/><stop offset="1" stopColor="#bb8065"/>
            </linearGradient>
            <linearGradient id={`${paint}-silver`} x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#fcfcff"/><stop offset=".4" stopColor="#b9c5cf"/><stop offset="1" stopColor="#68737c"/>
            </linearGradient>
          </defs>
          {!fitting&&!revealed&&<ellipse className="ring-target" cx={TIP.x} cy={TIP.y} rx="12" ry="6"/>}
          <g className={ringClass} style={ringStyle}>
            <path d="M-13 0C-13-8 13-8 13 0" fill="none" stroke="#78838d" strokeWidth="4"/>
          </g>
          <g transform="translate(0 220) scale(1 -1)">
            <path fill={`url(#${paint}-skin)`} stroke="#925d49" strokeWidth="2" d="M58 211 L57 185 Q39 171 35 152 L24 85 Q22 74 30 71 Q38 69 42 80 L52 108 L57 49 Q58 37 67 39 Q76 40 76 50 L75 101 L84 29 Q85 16 95 17 Q104 18 104 30 L101 102 L111 49 Q113 37 122 39 Q131 42 129 54 L124 117 Q133 122 139 110 L149 98 Q156 91 164 97 Q171 102 165 112 L148 140 Q140 166 123 181 L121 211 Z"/>
            <g fill="#f2cabb" stroke="#b77d6c" strokeWidth="1.2">
              <rect x="29" y="75" width="10" height="14" rx="4" transform="rotate(-17 34 82)"/>
              <rect x="61" y="44" width="11" height="16" rx="4"/>
              <rect x="89" y="21" width="11" height="17" rx="4"/>
              <rect x="114" y="44" width="11" height="16" rx="4" transform="rotate(7 119 52)"/>
              <rect x="151" y="97" width="11" height="13" rx="4" transform="rotate(43 156 103)"/>
            </g>
            <path className="ring-knuckles" d="M35 98l7-2 M59 79q6 2 13 0 M86 60q7 2 14 0 M111 80q6 2 13 0 M62 123q-1 24 7 49 M91 117q-4 20-2 42 M111 121q-3 19-9 39"/>
          </g>
          <g className={ringClass} style={ringStyle}>
            <path d="M-13 0C-13 8 13 8 13 0" fill="none" stroke={`url(#${paint}-silver)`} strokeWidth="5" strokeLinecap="round"/>
          </g>
        </svg>
        {FINGERS.map(finger=><button key={finger.name} type="button" className="ring-finger" style={position(finger)} aria-label={finger.name} disabled={fitting||revealed} onClick={()=>armed ? place(finger) : setMessage('Toque na aliança primeiro.')}/>)}
        <button type="button" className="game-ring" style={position(ring)} aria-label="Pegar a aliança" aria-pressed={armed} disabled={fitting||revealed} onClick={()=>setArmed(true)} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={()=>{gesture.current=null;setDrag(null)}}/>
      </div>
      <p className="ring-message" aria-live="polite">{message}</p>
    </div>
  )
}
