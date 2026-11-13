import { chromium, expect } from '@playwright/test'

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 800, height: 1280 }, reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => {
    window.paperPlays = []
    const play = HTMLMediaElement.prototype.play
    HTMLMediaElement.prototype.play = function () {
      const result = play.call(this)
      if (this.src && new URL(this.src).pathname === '/audio/folha.wav') {
        result.then(() => window.paperPlays.push({ duration: this.duration, volume: this.volume }), () => {})
      }
      return result
    }
  })
  await page.goto(process.env.ALBUM_URL || 'http://127.0.0.1:5173/')
  await expect(page.locator('.welcome-photo')).toHaveCount(3)
  await expect(page.locator('.welcome-photo > span')).toHaveCount(0)
  const files = await page.evaluate(async () => Promise.all(Array.from({ length: 24 }, async (_, i) => {
    const photo = new Image()
    photo.src = '/fotos/foto-' + String(i + 1).padStart(2, '0') + '.jpg'
    await photo.decode()
    return [photo.naturalWidth, photo.naturalHeight]
  })))
  expect(files.every(([w, h]) => w > 0 && h > 0)).toBeTruthy()
  expect(files.filter(([w, h]) => w > h)).toHaveLength(3)
  await page.getByRole('button', { name: 'Revelar seu presente' }).click()
  const cover = page.getByRole('button', { name: 'Abrir o álbum Bê e Mô' })
  await expect(cover.locator('.cover-portrait img')).toHaveCSS('object-fit', 'contain')
  await cover.click()
  const next = page.getByRole('button', { name: 'Próxima página' })
  const previous = page.getByRole('button', { name: 'Página anterior' })
  const active = page.locator('.page-display[data-page]:not([inert]):not([hidden])')
  const picker = page.getByRole('combobox', { name: 'Ir para a página' })
  await expect(picker.locator('option')).toHaveCount(18)
  await expect(next).toHaveCSS('border-top-width', '0px')
  await expect(next).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  const paperPlays = () => page.evaluate(() => window.paperPlays.length)
  await next.click() // 1 → 2, same spread.
  await expect(active).toHaveAttribute('data-page', '2')
  expect(await paperPlays()).toBe(0)
  await next.click() // 2 → 3, flip.
  await expect.poll(paperPlays).toBe(1)
  await next.click() // 3 → 4, same spread.
  await previous.click() // 4 → 3, same spread.
  expect(await paperPlays()).toBe(1)
  await previous.click() // 3 → 2, flip backwards.
  await expect.poll(paperPlays).toBe(2)
  await picker.selectOption('18') // Jump directly and silently.
  await expect(active).toHaveAttribute('data-page', '18')
  expect(await paperPlays()).toBe(2)
  await page.getByRole('button', { name: 'Ouvir nossa próxima melodia' }).click()
  const music = page.locator('audio')
  await expect(music).toHaveJSProperty('paused', false)
  await picker.selectOption('3')
  await expect(active).toHaveAttribute('data-page', '3')
  await previous.click()
  await expect.poll(paperPlays).toBe(3)
  const effects = await page.evaluate(() => window.paperPlays)
  expect(effects[2].volume).toBeLessThan(effects[0].volume)
  expect(effects[0].duration).toBeLessThan(0.7)
  await expect(music).toHaveJSProperty('paused', false)
  await page.getByRole('button', { name: 'Pausar melodia' }).click()
  await picker.selectOption('1')
  await expect(active).toHaveAttribute('data-page', '1')
  await expect.poll(async () => {
    const readingLeaf = await active.boundingBox()
    return Math.abs(readingLeaf.x + readingLeaf.width / 2 - 400)
  }).toBeLessThan(12)
  await page.screenshot({ path: 'artifacts/phase-1-navigation.png', animations: 'disabled' })
  for (let number = 1; number <= 18; number++) {
    await expect(active).toHaveAttribute('data-page', String(number))
    for (const photo of await active.locator('.polaroid-photo img').all()) {
      await expect(photo).toHaveCSS('object-fit', 'contain')
    }
    if (number === 8) {
      await page.screenshot({ path: 'artifacts/photos-tablet-journey.png' })
    }
    if (number < 18) await next.click()
  }
  expect(errors).toEqual([])
  console.log('24 JPEGs decoded; 18 pages; full images; paper sound played forward and backward.')
} finally {
  await browser.close()
}
