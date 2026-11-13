import { chromium, expect } from '@playwright/test'

const browser = await chromium.launch()
try {
 const context = await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',hasTouch:true})
 const page = await context.newPage()
 const errors=[]
 page.on('pageerror',error=>errors.push(error.message))
 const url='http://localhost:4173/'
 await page.goto(url)
 await expect(page.getByRole('heading',{name:'Gabriella, você é real?'})).toBeVisible()
 await page.getByRole('button',{name:'Revelar seu presente'}).tap()
 const cover=page.getByRole('button',{name:'Abrir o álbum Bê e Mô'})
 await expect(cover).toBeVisible()
 await page.getByRole('button',{name:'Guardar álbum offline',exact:true}).tap()
 await expect(page.getByRole('button',{name:'Álbum salvo offline',exact:true})).toBeVisible({timeout:30000})
 const manifest = await page.evaluate(async()=>await (await fetch('/manifest.webmanifest')).json())
 await context.setOffline(true)
 await page.goto(new URL(manifest.start_url,url).href)
 await expect(cover).toBeVisible()
 await expect(page.locator('.welcome')).toHaveCount(0)
 const r=await cover.boundingBox()
 const touch=await context.newCDPSession(page)
 const x=r.x+r.width*.65,y=r.y+r.height*.5
 await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]})
 await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-55,y}]})
 await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})
 const picker=page.getByRole('combobox',{name:'Ir para a página'})
 await expect(picker).toHaveValue('1')
 const leaf=page.locator('[data-page]:not([inert]):not([hidden])')
 await expect(leaf.getByRole('heading',{name:'Para meu amor'})).toBeVisible()
 await expect(leaf.locator('.eyebrow')).toHaveCount(0)
 for (const [n,title] of [[6,'Eu te amo'],[7,'O tempo passou'],[13,'As pequenas coisas'],[18,'Nossa próxima melodia']]){
  await picker.selectOption(String(n))
  await expect(leaf.getByRole('heading',{name:title,exact:true})).toBeVisible()
  if(n===13){
   await expect(leaf.locator('.details-photos img')).toHaveCount(3)
   await expect.poll(()=>leaf.locator('.details-photos img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBeTruthy()
   await leaf.locator('.details-photos img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())))
   await page.screenshot({path:'artifacts/copy-details-phone.png'})
  }
 }
 const range=await page.evaluate(async()=>{
  const response=await fetch('/audio/musica-teclado.mp3',{headers:{Range:'bytes=0-31'}})
  return [response.status,(await response.arrayBuffer()).byteLength]
 })
 expect(range).toEqual([206,32])
 await page.getByRole('button',{name:'Ouvir nossa próxima melodia'}).tap()
 await expect.poll(()=>page.locator('audio').evaluate(a=>a.currentTime)).toBeGreaterThan(.15)
 expect(errors).toEqual([])
 console.log('Offline shortcut, cover swipe, revised pages, photos and melody passed.')
} finally {await browser.close()}
