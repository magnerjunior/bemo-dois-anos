import React, { useEffect, useState } from 'react'
import { Download, Smartphone } from 'lucide-react'

let installPrompt
window.addEventListener('beforeinstallprompt', event=>{
  event.preventDefault()
  installPrompt=event
  window.dispatchEvent(new Event('album-install-available'))
})

async function offlineRequest(message) {
  const registration = await navigator.serviceWorker.getRegistration()
  const worker = registration?.active || (await navigator.serviceWorker.ready).active
  return new Promise((resolve,reject)=>{
    const { port1, port2 } = new MessageChannel()
    const timeout = setTimeout(()=>{port1.close();reject(new Error('Tempo de espera excedido.'))},120000)
    port1.onmessage = ({data})=>{
      clearTimeout(timeout)
      port1.close()
      if (data.error) reject(new Error('Falha ao salvar.'))
      else resolve(data)
    }
    worker.postMessage(message,[port2])
  })
}

export default function SaveAlbum() {
  const supported = import.meta.env.PROD && window.isSecureContext && 'serviceWorker' in navigator
  const [canInstall,setCanInstall] = useState(Boolean(installPrompt))
  const [state,setState] = useState('idle')
  const [hint,setHint] = useState('')

  useEffect(()=>{
    const update = ()=>setCanInstall(Boolean(installPrompt))
    const installed = ()=>{installPrompt=null;update();setHint('Atalho instalado.')}
    window.addEventListener('album-install-available',update)
    window.addEventListener('appinstalled',installed)
    if (supported) offlineRequest('album-offline-status').then(data=>{if(data.ready)setState('ready')}).catch(()=>{})
    return ()=>{
      window.removeEventListener('album-install-available',update)
      window.removeEventListener('appinstalled',installed)
    }
  },[supported])

  async function save() {
    if (!supported) {
      setHint('Para guardar offline no tablet, abra o álbum pelo endereço HTTPS.')
      return
    }
    setState('saving')
    setHint('')
    try {
      await offlineRequest('album-save-offline')
      setState('ready')
    } catch {
      setState('idle')
      setHint('Não consegui guardar o álbum. Confira a conexão e tente de novo.')
    }
  }

  async function install() {
    if (!installPrompt) {
      setHint('No menu do navegador, escolha “Adicionar à tela inicial”.')
      return
    }
    const prompt=installPrompt
    installPrompt=null
    setCanInstall(false)
    try { await prompt.prompt() } catch { setHint('Use a opção de instalar no menu do navegador.') }
  }

  const standalone=matchMedia('(display-mode: standalone)').matches || navigator.standalone
  return <div className="save-album">
    <button type="button" disabled={state==='saving'||state==='ready'} onClick={save}>
      <Download size={14}/>{state==='ready'?'Álbum salvo offline':state==='saving'?'Guardando álbum…':'Guardar álbum offline'}
    </button>
    {supported&&!standalone&&(canInstall||state==='ready')&&<button type="button" onClick={install}><Smartphone size={14}/>Adicionar à tela inicial</button>}
    {hint&&<p role="status">{hint}</p>}
  </div>
}
