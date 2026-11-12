import { expect, test, type Page } from '@playwright/test'

async function enterMenu(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: /A08/ }).first().click()
  await page.getByRole('button', { name: /进入点餐|Enter/ }).click()
  await expect(page).toHaveURL(/#\/menu$/)
}

async function addTenderBeefToCart(page: Page) {
  await page.getByPlaceholder('搜索锅底、菜品或饮品').fill('琥珀嫩牛肉')
  const productCard = page.locator('article').filter({ has: page.getByRole('heading', { name: '琥珀嫩牛肉' }) })
  await expect(productCard).toBeVisible()
  await productCard.getByRole('button').click()
  await expect(page.getByRole('heading', { name: '琥珀嫩牛肉' })).toBeVisible()
  await page.getByRole('button', { name: '加入本桌购物车' }).click()
  await expect(page.getByRole('heading', { name: '本桌购物车' })).toBeVisible()
}

test.describe('火锅点单主流程 - 下单与模拟结账', () => {
  test('REQ-006: 顾客可从加购提交订单到模拟支付成功', async ({ page }) => {
    await enterMenu(page)
    await addTenderBeefToCart(page)

    await expect(page.getByText('琥珀嫩牛肉').first()).toBeVisible()
    await expect(page.getByText('¥42.00').first()).toBeVisible()
    await page.getByRole('button', { name: '确认并提交订单' }).click()

    await expect(page).toHaveURL(/#\/order$/)
    await expect(page.getByRole('heading', { name: '这一锅，正在抵达' })).toBeVisible()
    await expect(page.getByText('已点菜品')).toBeVisible()
    await expect(page.getByText('订单已提交').first()).toBeVisible()
    await page.getByRole('button', { name: '去结账' }).click()

    await expect(page).toHaveURL(/#\/checkout$/)
    await expect(page.getByRole('heading', { name: '核对本桌账单' })).toBeVisible()
    await expect(page.getByText('应付合计')).toBeVisible()
    await expect(page.getByText('¥42.00').first()).toBeVisible()
    await expect(page.getByRole('button', { name: '确认支付 ¥42.00' })).toBeVisible()
    await page.getByRole('button', { name: '确认支付 ¥42.00' }).click()

    await expect(page.getByRole('heading', { name: '付款完成' })).toBeVisible()
    await expect(page.getByText('本次实付')).toBeVisible()
    await expect(page.getByText('¥42.00')).toBeVisible()
  })
})
