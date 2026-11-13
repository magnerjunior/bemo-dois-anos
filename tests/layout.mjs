import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
const errors=[]; const report=[];
for(const [name,width,height] of [['tablet',800,1280],['landscape',1280,800],['phone',390,844],['small',360,640],['phone-landscape',844,390]]){
 const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5173/#album');await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`artifacts/${name}-cover.png`});
 await page.getByRole('button',{name:'Abrir o álbum Bê e Mô'}).click();await page.waitForTimeout(1400);
 for(let n=1;n<=18;n++){
  await page.waitForSelector(`.page-display[data-page="${n}"]:not([hidden])`);await page.waitForTimeout(100);
  const overflow=await page.locator(`.page-display[data-page="${n}"]`).evaluate(el=>{const root=el.getBoundingClientRect();return [...el.querySelectorAll('p,h2,button,figure,.center-footnote,.signature')].filter(x=>{const s=getComputedStyle(x);return s.display!=='none'&&s.visibility!=='hidden'&&x.getBoundingClientRect().width>0}).filter(x=>{const r=x.getBoundingClientRect();return r.bottom>root.bottom-8||r.right>root.right+1||r.left<root.left-1}).map(x=>({tag:x.tagName,cls:x.className,text:x.textContent.slice(0,60)}))});
  report.push({name,n,overflow});
  if(name!=='small'&&name!=='phone-landscape')await page.screenshot({path:`artifacts/${name}-${String(n).padStart(2,'0')}.png`,animations:'disabled'});
  if(n<18){await page.getByRole('button',{name:'Próxima página',exact:true}).click();await page.waitForTimeout(100)}
 }
 await page.close();
}
await fs.writeFile('artifacts/layout-report.json',JSON.stringify({errors,report},null,2));console.log(JSON.stringify({errors,overflows:report.filter(x=>x.overflow.length)},null,2));await browser.close();
