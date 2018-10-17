const fs = require("fs");
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1024,
      height: 768
    }
  });


  const page = await browser.newPage();

  function destroyOverlay() {
    return page.evaluate(() => {
      destroyOverlay();
    });
  }

  await page.goto(
    "https://edu-p18-t04.odoo.com/web/login?login=admin.edu-p18-t04@odoosim.ch"
  );

  await page.screenshot({ path: "screenshots/login.png" });
  await page.type('[name="password"]', process.env.password);
  await page.click('[type="submit"]');
  await page.waitForSelector(".o_home_menu");
  await page.waitFor(1000);
  await page.addScriptTag({
    content: fs.readFileSync("./annotationHelper.js").toString()
  });

  await page.evaluate(() => {
    addOverlay();
    addBorderToSelector('[data-menu-xmlid="purchase.menu_purchase_root"]', true);
  });
  await page.screenshot({ path: "screenshots/home.png" });
  await destroyOverlay();

  await page.click('[data-menu-xmlid="purchase.menu_purchase_root"]');
  await page.waitForSelector('[data-menu-xmlid="purchase.menu_procurement_management"]');
  // expand menu
  await page.click('[data-menu-xmlid="purchase.menu_procurement_management"]');
  await page.evaluate(() => {
    addOverlay();
    addBorderToSelector('[data-menu-xmlid="purchase.menu_procurement_management"]');
    addBorderToSelector('[data-menu-xmlid="purchase.menu_procurement_partner_contact_form"]', true);
  });
  await page.screenshot({ path: "screenshots/purchase_home.png" });
  await destroyOverlay();

  await page.click('[data-menu-xmlid="purchase.menu_procurement_partner_contact_form"]');
  await page.waitForSelector(".btn.btn-primary.o-kanban-button-new");
  await page.evaluate(() => {
    addOverlay();
    addBorderToSelector(".btn.btn-primary.o-kanban-button-new", true);
  });
  await page.screenshot({ path: "screenshots/purchase_new_article_button.png" });
  await destroyOverlay();

  await page.click(".btn.btn-primary.o-kanban-button-new");
  await page.waitForSelector('[name="name"]');
  await page.type('[name="name"]', "My Sample Product");
  await page.select('[name="type"]', '"product"');
  // uncheck
  await page.click('[name="sale_ok"]');
  await page.evaluate(() => {
    addOverlay();
    addArrowToSelector('[name="name"]', "1");
    addHighlightToSelector('[name="name"]');

    addArrowToSelector('[name="sale_ok"]', "2");
    addHighlightToSelector('[name="sale_ok"]');

    addArrowToSelector('[name="type"]', "3");
    addHighlightToSelector('[name="type"]');

    addArrowToSelector('[name="taxes_id"]', "x");
    addHighlightToSelector('[name="taxes_id"]');
  });
  await page.screenshot({ path: "screenshots/purchase_new_article_form.png" });


  await browser.close();
})();
