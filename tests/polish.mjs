import { chromium, expect } from '@playwright/test'

const browser = await chromium.launch()
try {
  for (const [name, width, height] of [['phone', 390, 844], ['tablet', 800, 1280], ['landscape', 1280, 800]]) {
    const page = await browser.newPage({ viewport: { width, height }, hasTouch: true })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const next = page.getByRole('button', { name: 'Próxima página' })
    const previous = page.getByRole('button', { name: 'Página anterior' })
    const active = page.locator('.page-display[data-page]:not([inert]):not([hidden])')
    await page.goto(process.env.ALBUM_URL || 'http://127.0.0.1:5173/#album')
    const cover = page.getByRole('button', { name: 'Abrir o álbum Bê e Mô' })
    await expect(cover).toBeVisible()
    await page.evaluate(() => document.fonts.ready)
    await page.waitForFunction(() => {
      const portrait = document.querySelector('.cover-portrait img')
      const arrival = document.querySelector('.album-arrival')
      return portrait?.complete && portrait.naturalWidth > 0 && getComputedStyle(arrival).opacity === '1'
    })
    await page.screenshot({ path: `artifacts/polish-${name}-cover.png` })
    await cover.tap()
    await expect(active).toHaveAttribute('data-page', '1')
    async function checkFixedScale(trigger, expectTurningLeaf) {
      await expect.poll(()=>page.locator('.book-shell').evaluate(shell=>{
        const matrix=new DOMMatrixReadOnly(getComputedStyle(shell).transform)
        return Math.hypot(matrix.m11,matrix.m12,matrix.m13)
      })).toBeCloseTo(1, 4)
      await page.evaluate(() => {
        const shell = document.querySelector('.book-shell')
        const frame = document.querySelector('.book-area')
        const samples = []
        window.turnSamples = samples
        const start = performance.now()
        function sample(now) {
          const leaf = shell.querySelector('.turning-leaf')
          const transform = new DOMMatrixReadOnly(getComputedStyle(shell).transform)
          const bounds = leaf?.getBoundingClientRect()
          const area = frame.getBoundingClientRect()
          samples.push({
            scaleX:Math.hypot(transform.m11,transform.m12,transform.m13),
            scaleY:Math.hypot(transform.m21,transform.m22,transform.m23),
            leaf:Boolean(leaf),
            clipped:bounds ? Math.max(0,area.top-bounds.top,bounds.bottom-area.bottom) : 0,
          })
          if (now-start < 1150) requestAnimationFrame(sample)
        }
        requestAnimationFrame(sample)
      })
      await trigger.tap()
      if (expectTurningLeaf) {
        await expect(page.locator('.turning-leaf .page-display')).toHaveCount(2)
        await expect(page.locator('.paper-ribbon')).toHaveCount(0)
        await page.waitForTimeout(250)
        await page.screenshot({ path: `artifacts/polish-${name}-turn.png` })
      }
      await expect(trigger).toBeEnabled()
      const samples = await page.evaluate(() => window.turnSamples)
      expect(samples.length).toBeGreaterThan(2)
      expect(samples.filter(({scaleX,scaleY}) => Math.abs(scaleX-1)<.002 && Math.abs(scaleY-1)<.002), JSON.stringify(samples.slice(0,4))).toHaveLength(samples.length)
      if (expectTurningLeaf) {
        expect(samples.some(sample=>sample.leaf)).toBeTruthy()
        expect(Math.max(...samples.map(sample=>sample.clipped))).toBeLessThanOrEqual(2)
      }
    }
    await checkFixedScale(next, false)
    await expect(active).toHaveAttribute('data-page', '2')
    await checkFixedScale(next, true)
    await expect(active).toHaveAttribute('data-page', '3')
    const leaf = await active.boundingBox()
    expect(leaf.x).toBeGreaterThanOrEqual(0)
    expect(leaf.x + leaf.width).toBeLessThanOrEqual(width)
    expect(leaf.y + leaf.height).toBeLessThan(height)
    await page.screenshot({ path: `artifacts/polish-${name}-reading.png` })
    await page.evaluate(() => localStorage.setItem('be-mo:last-page', '18'))
    await page.reload()
    await expect(page.getByRole('button', { name: /Continuar da página/ })).toHaveCount(0)
    await cover.tap()
    await expect(active).toHaveAttribute('data-page', '1')
    await next.tap()
    await expect(active).toHaveAttribute('data-page', '2')
    await page.keyboard.press('End')
    await expect(active).toHaveAttribute('data-page', '18')
    await page.getByRole('button', { name: 'Ouvir nossa próxima melodia' }).tap()
    await expect(page.locator('audio')).toHaveJSProperty('paused', false)
    await previous.tap()
    await expect(active).toHaveAttribute('data-page', '17')
    await page.getByRole('button', { name: 'Pausar melodia', exact: true }).tap()
    await expect(page.locator('audio')).toHaveJSProperty('paused', true)
    await page.getByRole('button', { name: 'Retomar melodia', exact: true }).tap()
    await expect(page.locator('audio')).toHaveJSProperty('paused', false)
    expect(errors).toEqual([])
    console.log(name, { fixedScale: true, continuousLeaf: true, startsAtFirstPage: true, musicControls: true })
    await page.close()
  }
} finally {
  await browser.close()
}
