// A soft bell, created only after an explicit user gesture.
export function ringBell(){
 const Audio=window.AudioContext||window.webkitAudioContext
 if(!Audio)return
 const ctx=new Audio();const now=ctx.currentTime
 for(const [frequency,volume] of [[660,.07],[1320,.025],[1837,.013]]){const tone=ctx.createOscillator(),gain=ctx.createGain();tone.type='sine';tone.frequency.value=frequency;gain.gain.setValueAtTime(volume,now);gain.gain.exponentialRampToValueAtTime(.0001,now+1.7);tone.connect(gain);gain.connect(ctx.destination);tone.start(now);tone.stop(now+1.8)}
 setTimeout(()=>ctx.close().catch(()=>{}),2000)
}
