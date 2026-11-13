import React,{useState} from 'react'
import Photo from './Photo.jsx'
import {PHOTO_NOTES} from '../data/presentation.js'
export default function PhotoNote({id,onPhoto}){const [flipped,setFlipped]=useState(false);return <div className={`wall-memory ${flipped?'memory-flipped':''}`}><div className="memory-turn"><button className="memory-front" aria-label={`Virar fotografia ${id} para ler o recado`} onClick={()=>setFlipped(true)} tabIndex={flipped?-1:0}><Photo id={id} caption={false}/></button><div className="memory-back" aria-hidden={!flipped}><p>{PHOTO_NOTES[id]}</p><div><button tabIndex={flipped?0:-1} onClick={()=>setFlipped(false)}>Voltar</button><button tabIndex={flipped?0:-1} onClick={()=>onPhoto({photo:id,note:PHOTO_NOTES[id]})}>Ampliar tudo</button></div></div></div></div>}
