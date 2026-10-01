import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

async function ready(page) {
  await page.waitForSelector('#pet-name');
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) {
      image.loading = 'eager';
      await image.decode();
    }
  });
}
for (const width of [1440, 1024, 736, 390, 320]) {
  test(`Reference fidelity and no overflow at ${width}px`, async ({page}) => {
    await page.setViewportSize({width,height:900});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('/reference/index.html');await ready(page);
    fs.mkdirSync('artifacts',{recursive:true});
    const reference=await page.screenshot({path:`artifacts/reference-${width}.png`,fullPage:true});
    const referenceGeometry=await page.locator('header.header,main section,body footer').evaluateAll(nodes=>nodes.map(n=>({x:n.getBoundingClientRect().x,y:n.getBoundingClientRect().y,width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height})));
    await page.goto('/');await ready(page);
    const integrated=await page.screenshot({path:`artifacts/integration-${width}.png`,fullPage:true});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect(await page.locator('header.header,main section,body footer').evaluateAll(nodes=>nodes.map(n=>({x:n.getBoundingClientRect().x,y:n.getBoundingClientRect().y,width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height})))).toEqual(referenceGeometry);
    const a=PNG.sync.read(reference), b=PNG.sync.read(integrated);
    expect(pixelmatch(a.data,b.data,null,a.width,a.height,{threshold:0.1}), 'No perceptible pixel differences from supplied V2').toBe(0);
    expect(errors).toEqual([]);
    expect(await page.evaluate(()=>document.fonts.check('400 16px "DM Sans"')&&document.fonts.check('italic 400 16px "Cormorant Garamond"'))).toBe(true);
  });
}
test('Six universes, keyboard, favorites, profile, requests and Olivia',async({page})=>{
 await page.goto('/');await ready(page);
 for(const key of ['stay','insurance','food','travel','care','memory']){
  await page.locator(`#tab-${key}`).click();
  await expect(page.locator('#service-stage')).toHaveAttribute('aria-labelledby',`tab-${key}`);
  await expect(page.locator('#stage-image')).toHaveAttribute('src',/\/assets\/.+\.jpg/);
  await expect(page.locator('#stage-description')).not.toBeEmpty();
 }
 await page.locator('#tab-stay').focus();await page.keyboard.press('ArrowDown');await expect(page.locator('#tab-insurance')).toBeFocused();
 await page.locator('#stage-save').click();await expect(page.locator('#saved-count')).toHaveText('1');
 await page.locator('.header .profile-open').click();await expect(page.locator('.saved-list')).toContainText('Seguros');
 await page.locator('[data-remove="insurance"]').click();await expect(page.locator('#saved-count')).toBeHidden();await page.locator('.modal-close').click();
 await page.locator('#pet-name').fill('Luna');await page.getByRole('button',{name:'Gato',exact:true}).click();await page.getByRole('button',{name:'Siguiente paso'}).click();
 await page.getByRole('button',{name:'Crear su universo'}).click();await expect(page.locator('#journey-error')).toContainText('Elige');
 await page.locator('.needs-picker input[value="stay"]').check();await page.locator('.needs-picker input[value="food"]').check();await page.getByRole('button',{name:'Crear su universo'}).click();await expect(page.locator('.result-heading')).toContainText('Luna');await expect(page.locator('#saved-count')).toHaveText('2');
 await page.locator('.result-items [data-detail="stay"]').click();await page.locator('#detail-action').click();await page.locator('input[name="city"]').fill('Ciudad de México');await page.locator('input[name="need"]').fill('Guardería por un día');await page.locator('#request-form button').click();await expect(page.locator('#modal-content')).toContainText('Guardería por un día');await expect(page.locator('#modal-content')).toContainText('Ciudad de México');await page.locator('#request-done').click();
 await page.locator('#assistant-open').click();await expect(page.locator('.chat-options button')).toHaveCount(6);await page.getByRole('button',{name:'Quiero protegerlo'}).click();await expect(page.locator('#modal-content')).toContainText('TRANQUILIDAD');await page.keyboard.press('Escape');await expect(page.locator('#modal')).not.toBeVisible();
});
test('Travel checklist and mobile navigation',async({page})=>{
 await page.setViewportSize({width:320,height:800});await page.goto('/');await ready(page);
 await page.locator('#menu-toggle').click();await expect(page.locator('#mobile-menu')).toBeVisible();await page.locator('#mobile-menu a[href="#escapadas"]').click();await expect(page.locator('#mobile-menu')).toBeHidden();
 await page.locator('#trip-open').click();await page.locator('[data-check]').first().check();await expect(page.locator('#check-status')).toHaveText('1 de 4 puntos preparados');
 for(const type of ['avion','estancia','carretera']){await page.locator(`[data-trip="${type}"]`).click();await expect(page.locator('.checklist label')).toHaveCount(4);}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
