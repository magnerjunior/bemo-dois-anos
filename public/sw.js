/* BUILD and OFFLINE_FILES are injected by the production build. */
const PREFIX = 'be-mo-offline-'
const CACHE = PREFIX + BUILD
const MARKER = '/__album_offline_ready__'
let saving

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()))
self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const current = await caches.open(CACHE)
    const previous = (await caches.keys()).filter(name=>name.startsWith(PREFIX)&&name!==CACHE)
    // Keep a previously saved copy until its replacement has downloaded.
    if (await current.match(MARKER)) await Promise.all(previous.map(name=>caches.delete(name)))
    await self.clients.claim()
  })())
})

async function saveAlbum() {
  const cache = await caches.open(CACHE)
  if (await cache.match(MARKER)) return
  await cache.addAll(OFFLINE_FILES.map(url=>new Request(url,{cache:'reload'})))
  await cache.put(MARKER,new Response('ready'))
  const names = await caches.keys()
  await Promise.all(names.filter(name=>name.startsWith(PREFIX)&&name!==CACHE).map(name=>caches.delete(name)))
}

self.addEventListener('message', event => {
  const port = event.ports[0]
  if (!port) return
  if (event.data === 'album-offline-status') {
    event.waitUntil(caches.open(CACHE).then(async cache=>port.postMessage({ready:Boolean(await cache.match(MARKER))})).catch(()=>port.postMessage({error:true})))
  } else if (event.data === 'album-save-offline') {
    if (!saving) saving = saveAlbum().finally(()=>{saving=null})
    event.waitUntil(saving.then(()=>port.postMessage({ready:true})).catch(()=>port.postMessage({error:true})))
  }
})

async function savedResponse(request) {
  const cache = await caches.open(CACHE)
  const current = await cache.match(request,{ignoreSearch:true,ignoreVary:true})
  if (current) return current
  const older = (await caches.keys()).filter(name=>name.startsWith(PREFIX)&&name!==CACHE).reverse()
  for (const name of older) {
    const response = await (await caches.open(name)).match(request,{ignoreSearch:true,ignoreVary:true})
    if (response) return response
  }
}

async function audioRange(request,response) {
  const buffer = await response.arrayBuffer()
  const size = buffer.byteLength
  const match = /^bytes=(\d*)-(\d*)$/i.exec(request.headers.get('range'))
  let start = 0
  let end = size-1
  if (match?.[1]) {
    start = Number(match[1])
    if (match[2]) end = Math.min(end,Number(match[2]))
  } else if (match?.[2]) {
    start = Math.max(0,size-Number(match[2]))
  }
  if (!match || (!match[1]&&!match[2]) || start>=size || start>end) {
    return new Response(null,{status:416,headers:{'Content-Range':`bytes */${size}`}})
  }
  return new Response(buffer.slice(start,end+1),{status:206,headers:{
    'Content-Type':response.headers.get('Content-Type') || 'audio/mpeg',
    'Content-Range':`bytes ${start}-${end}/${size}`,
    'Accept-Ranges':'bytes',
    'Content-Length':String(end-start+1),
  }})
}

self.addEventListener('fetch', event => {
  const request = event.request
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async()=>await savedResponse('/') || Response.error()))
    return
  }
  event.respondWith((async()=>{
    const response = await savedResponse(request)
    if (!response) return fetch(request)
    return request.headers.has('range') ? audioRange(request,response) : response
  })())
})
