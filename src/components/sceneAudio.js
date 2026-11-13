let context
let mix
let musicPlaying = false
let noise

export function unlockSceneAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    if (!context) {
      context = new AudioContext()
      mix = context.createGain()
      mix.gain.value = musicPlaying ? .23 : .65
      mix.connect(context.destination)
    }
    if (context.state === 'suspended') context.resume().catch(() => {})
  } catch { /* The scenes remain usable without audio. */ }
}

export function duckSceneAudio(playing) {
  musicPlaying = playing
  if (mix) mix.gain.setTargetAtTime(playing ? .23 : .65, context.currentTime, .035)
}

function tone(at, frequency, endFrequency, duration, volume, type = 'sine') {
  const oscillator = context.createOscillator()
  const envelope = context.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, at)
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, at + duration)
  envelope.gain.setValueAtTime(volume, at)
  envelope.gain.exponentialRampToValueAtTime(.0001, at + duration)
  oscillator.connect(envelope).connect(mix)
  oscillator.start(at)
  oscillator.stop(at + duration)
}

function rustle(at, duration, frequency, volume, type = 'bandpass') {
  if (!noise) {
    noise = context.createBuffer(1, Math.ceil(context.sampleRate * .45), context.sampleRate)
    const data = noise.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = 2 * Math.random() - 1
  }
  const source = context.createBufferSource()
  const filter = context.createBiquadFilter()
  const envelope = context.createGain()
  source.buffer = noise
  filter.type = type
  filter.frequency.value = frequency
  envelope.gain.setValueAtTime(volume, at)
  envelope.gain.exponentialRampToValueAtTime(.0001, at + duration)
  source.connect(filter).connect(envelope).connect(mix)
  source.start(at)
  source.stop(at + duration)
}

const effects = {
  switch(at) {
    rustle(at, .028, 1700, .17)
    tone(at + .011, 400, 210, .043, .085, 'triangle')
  },
  shutter(at) {
    rustle(at, .043, 2300, .19)
    rustle(at + .055, .065, 1300, .11)
    tone(at + .047, 420, 160, .045, .045, 'triangle')
  },
  booth(at) {
    for (let i = 0; i < 3; i++) {
      const click = at + i * .34
      rustle(click, .033, 2800, .16)
      rustle(click + .035, .075, 950, .105)
      tone(click, 290, 135, .045, .055, 'triangle')
    }
  },
  letter(at) {
    rustle(at, .055, 1150, .13)
    rustle(at + .045, .16, 750, .09)
    rustle(at + .12, .18, 1150, .06)
  },
  stars(at) {
    tone(at, 1175, 1175, .55, .048)
    tone(at + .085, 1568, 1568, .46, .032)
    tone(at + .15, 2349, 2349, .3, .012)
  },
  bell(at) {
    for (const offset of [0, .52]) {
      for (const [pitch, volume] of [[510, .085], [1020, .042], [1411, .022], [2082, .014]]) {
        tone(at + offset, pitch, pitch, 1.35, volume)
      }
    }
  },
  latch(at) {
    rustle(at, .04, 2100, .16)
    tone(at, 670, 410, .09, .071, 'triangle')
    tone(at + .035, 1290, 1100, .085, .031)
  },
  splash(at) {
    rustle(at, .21, 590, .19, 'lowpass')
    tone(at, 430, 125, .14, .08)
    tone(at + .058, 240, 600, .10, .05)
  },
}

export function playSceneSound(name, delay = 0) {
  if (context?.state !== 'running') return
  effects[name](context.currentTime + delay)
}
