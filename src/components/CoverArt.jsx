import React,{useState} from 'react'
import {Camera,Heart,Music,Church,Bird,Flower2,Stars,Clock3} from 'lucide-react'
import Photo from './Photo.jsx'
import {COVER} from '../data/presentation.js'
export default function CoverArt(){
 const [portraitFailed,setPortraitFailed]=useState(false),[artFailed,setArtFailed]=useState(false)
 return <div className="cover-art illustrated-cover">
 {!artFailed&&<img className="custom-cover-art" src={COVER.artwork} alt="" onError={()=>setArtFailed(true)}/>}
 <svg className="cover-vines" viewBox="0 0 500 720" fill="none" aria-hidden="true">
 <defs><g id="sprig"><path d="M0 100Q30 40 0 0M9 78Q-25 60 -8 43Q16 48 9 78M12 50Q40 26 29 12Q7 22 12 50M5 23Q-18 10 -12 -5"/><path d="M1 94Q28 88 33 64Q9 68 1 94"/></g><g id="rose"><path d="M0 -24Q22 -26 23 -5Q32 15 9 25Q-15 34 -25 8Q-33 -14 0 -24ZM0 -15Q18 -18 15 1Q16 19 -3 15Q-20 13 -14 -3Q-12 -18 0 -15ZM-2 -6Q10 -9 8 2Q4 10 -5 5Q-10 -2 -2 -6Z"/></g></defs>
 <rect x="14" y="14" width="472" height="692" rx="12"/><rect x="23" y="23" width="454" height="674" rx="9" opacity=".4"/>
 <path d="M65 650Q18 340 65 80M435 650Q482 340 435 80"/>
 {[95,235,375,515].map(y=><g key={y}><use href="#sprig" transform={`translate(52 ${y}) scale(.65)`}/><use href="#sprig" transform={`translate(448 ${y}) scale(-.65 .65)`}/></g>)}
 {[65,435].map(x=><g key={x}><use href="#rose" transform={`translate(${x} 65)`}/><use href="#rose" transform={`translate(${x} 655)`}/></g>)}
 <ellipse cx="250" cy="325" rx="147" ry="190" strokeDasharray="2 7"/><path d="M150 102Q250 72 350 102M170 608Q250 635 330 608"/>
 {Array.from({length:18},(_,i)=><circle key={i} cx={35+(i*79)%430} cy={40+(i*131)%640} r={i%3===0?3:1.5} fill="currentColor"/>)}
 </svg>
 <div className="cover-doodles" aria-hidden="true"><Camera/><Heart/><Music/><Church/><Bird/><Flower2/><Stars/><Clock3/></div>
 <span className="illustrated-kicker">O ÁLBUM DA NOSSA HISTÓRIA</span>
 <div className="cover-portrait">{portraitFailed?<Photo id={COVER.fallbackPhoto} caption={false} loading="eager"/>:<img src={COVER.portrait} alt="Magner e Gabriella" onError={()=>setPortraitFailed(true)}/>}</div>
 <div className="illustrated-names"><span>Magner</span><em>&</em><span>Gabriella</span></div>
 <span className="illustrated-subtitle">Dois anos de nós</span><span className="illustrated-date">DESDE 15 · 11 · 2024</span>
 </div>
}
