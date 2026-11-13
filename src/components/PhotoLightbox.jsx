import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import Photo from './Photo.jsx'

export default function PhotoLightbox({ id, onClose }) {
  const closeRef = useRef(null)
  const hasStrips = Array.isArray(id)
  const memory = !hasStrips && typeof id === 'object' ? id : null

  useEffect(() => {
    const previous = document.activeElement
    closeRef.current?.focus()
    return () => previous?.focus()
  }, [])

  function handleKey(event) {
    if (event.key === 'Escape') onClose()
    if (event.key === 'Tab') {
      event.preventDefault()
      closeRef.current?.focus()
    }
  }

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={memory ? 'Foto e recado ampliados' : 'Foto ampliada'} onKeyDown={handleKey} onClick={onClose}>
      <button ref={closeRef} className="lightbox-close" onClick={onClose} aria-label="Fechar foto"><X/></button>
      <div className={`lightbox-card ${memory ? 'lightbox-with-note' : ''}`} onClick={event=>event.stopPropagation()}>
        {hasStrips ? <div className="enlarged-strips">
          {id.map((strip,i)=><div className="photostrip" key={i}>
            {strip.map(photo=><Photo id={photo} key={photo} caption={false}/>)}
            <span>BÊ ♡ MÔ</span>
          </div>)}
        </div> : <Photo id={memory?.photo ?? id} caption={!memory}/>}
        {memory&&<p className="enlarged-memory-note">{memory.note}</p>}
      </div>
      <span className="lightbox-hint">Toque fora da foto para voltar ao livro</span>
    </div>
  )
}
