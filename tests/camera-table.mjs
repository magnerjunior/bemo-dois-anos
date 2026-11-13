import {chromium,expect} from '@playwright/test'
const browser=await chromium.launch()
try{
 for(const [name,width,height] of [['phone',390,844],['tablet',800,1280]]){
  const page=await browser.newPage({viewport:{width,height}})
  await page.goto('http://192.168.18.4:4173/#album')
  await page.getByRole('button',{name:'Abrir o álbum Bê e Mô'}).click()
  const picker=page.getByRole('combobox',{name:'Ir para a página'})
  await picker.selectOption('12')
  const scene=page.locator('[data-page="12"]:not([inert])')
  await expect(scene.locator('.camera-room-lamp,.camera-room-window')).toHaveCount(0)
  await expect(scene.locator('.camera-tabletop')).toBeVisible()
  await expect(scene.locator('.camera-projector-light')).toBeVisible()
  for(let i=1;i<=3;i++){
   await scene.getByRole('button',{name:'Tirar fotografia'}).click()
   await expect(scene.locator('.instant-print')).toHaveCount(i)
  }
  await page.waitForTimeout(2500)
  await page.screenshot({path:`artifacts/camera-table-${name}.png`})
  await scene.getByRole('button',{name:'Reiniciar fotos'}).click()
  await expect(scene.locator('.instant-print')).toHaveCount(0)
  console.log(name,'camera tabletop, three prints and reset passed')
  await page.close()
 }
}finally{await browser.close()}
