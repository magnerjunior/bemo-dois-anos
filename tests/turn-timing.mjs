import {chromium} from '@playwright/test'
const browser=await chromium.launch()
try{
 for(const viewport of [{width:390,height:844},{width:800,height:1280}]){
  const page=await browser.newPage({viewport})
  await page.goto(process.env.ALBUM_URL || 'http://127.0.0.1:5173/#album')
  await page.getByRole('button',{name:'Abrir o álbum Bê e Mô'}).click()
  const next=page.getByRole('button',{name:'Próxima página',exact:true})
  await next.waitFor()
  const times=[]
  for(let i=0;i<4;i++)times.push(await next.evaluate(button=>new Promise((resolve,reject)=>{
   const start=performance.now()
   const observer=new MutationObserver(()=>{
    if(!button.disabled){clearTimeout(timer);observer.disconnect();resolve(Math.round(performance.now()-start))}
   })
   observer.observe(button,{attributes:true,attributeFilter:['disabled']})
   const timer=setTimeout(()=>{observer.disconnect();reject(Error('Page turn timed out'))},3000)
   button.click()
  })))
  console.log(viewport.width,times)
  await page.close()
 }
}finally{await browser.close()}
