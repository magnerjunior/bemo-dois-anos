import React, { useEffect, useState } from 'react'
import { PHOTO_BY_ID } from '../data/album.js'

const suffix = id => String(id).padStart(2,'0')
const EXTENSIONS = ['jpg','jpeg','png','webp']

export default function Photo({ id, className = '', onClick, caption = true, loading = 'lazy' }) {
  const [tryIndex, setTryIndex] = useState(0)
  const photo = PHOTO_BY_ID[id]
  useEffect(() => { setTryIndex(0) }, [id])
  const src = tryIndex < EXTENSIONS.length
    ? `/fotos/foto-${suffix(id)}.${EXTENSIONS[tryIndex]}`
    : `/placeholders/foto-${suffix(id)}.jpg`
  return (
    <figure className={`polaroid ${className} ${onClick ? 'polaroid-clickable' : ''}`} onClick={onClick}
      role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? e => { if (e.key === 'Enter' || e.key === ' ') {e.preventDefault();onClick(e)} } : undefined}
      aria-label={onClick ? `Ampliar fotografia: ${photo?.label}` : undefined}>
      <div className="polaroid-photo">
        <img src={src} alt={photo?.name || `Foto ${id}`} loading={loading} decoding="async" draggable={false}
          onError={() => { setTryIndex(i => Math.min(i + 1, EXTENSIONS.length)) }} />
      </div>
      {caption && <figcaption>{photo?.label}</figcaption>}
    </figure>
  )
}
