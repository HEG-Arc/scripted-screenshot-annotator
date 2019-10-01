const fs = require("fs");
const puppeteer = require("puppeteer");
const tour = require("./tour").tour;

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

  async function capture(path, func, options = {}) {
    await page.evaluate(() => {
      addOverlay();
    });
    await page.evaluate(func);
    screenshotOptions = Object.assign({ path: `screenshots/${path}` }, options);
    await page.screenshot(screenshotOptions);
    await destroyOverlay();
  }

  await page.goto(
    "http://localhost:8069/web/login?login=admin"
  );

  //await page.screenshot({ path: "screenshots/login.png" });
  await page.type('[name="password"]', '');
  await page.click('[type="submit"]');
  await page.waitForSelector(".o_home_menu");
  await page.waitFor(1000);
  await page.addScriptTag({
    content: fs.readFileSync("./annotationHelper.js").toString()
  });

  async function captureTour(i) {
    console.log(i);
    await page.hover('.o_tooltip')
    await page.waitFor(1000);
    const rect = await page.evaluate((selector) => {
      const el = document.querySelector('.o_tooltip');
      if (el) {
        const {x, y, width, height} = el.getBoundingClientRect();
        return {x, y, width, height};
      }
      return {x: 0, y: 0, width: window.innerWidth, height: window.innerHeight}
    }, tour[i].trigger);
    await capture( `${i}.png`, () => {
    }, {
      clip: {
        x: rect.x - 80,
        y: rect.y - 80,
        width: rect.width + 160,
        height: rect.height + 160
      }
    });
    await page.click(tour[i].trigger);
    await page.waitFor(2000);
    try{
      await page.type('[placeholder="Name"]', 'Test');
    } catch(e) {

    }
    try{
      await page.type('[placeholder="Product Name"]', 'Test');
    } catch(e) {

    }
    try{
      await page.type('.o_input.ui-autocomplete-input', 'Test');
      await page.waitFor(500);
      await page.click('.ui-autocomplete li.ui-menu-item a');
    } catch(e) {
    }
  }
  for(let i=0; i<tour.length; i++) {
    await captureTour(i);
  }
/*
  await capture( "home.png", () => {
    addBorderToSelector('[data-menu-xmlid="purchase.menu_purchase_root"]', true);
  });
*/

/*
// config installed apps
await page.click('[data-menu-xmlid="base.menu_management"]');
await page.waitFor(1000);
await page.click('.o_search_options button');
await page.click('.o_search_options .o_filters_menu div:nth-of-type(5) a');
await capture( "install_apps_final.png", () => {
  addBorderToSelector('.o_search_options .o_filters_menu div:nth-of-type(5) a', true)
});
*/
/*
  await capture( "menu_sales.png", () => {
    addBorderToSelector('[data-menu-xmlid="sale.sale_menu_root"]', true);
  });

  await page.click('[data-menu-xmlid="sale.sale_menu_root"]');
  await page.waitForSelector('[data-menu-xmlid="sale.menu_sale_config"]');
  // expand menu
  await page.click('[data-menu-xmlid="sale.menu_sale_config"]');
  await capture( 'sales_configuration.png', () => {
    addBorderToSelector('[data-menu-xmlid="sale.menu_sale_config"]');
    addBorderToSelector('[data-menu-xmlid="sale.menu_sale_general_settings"]', true);
  });

  await page.click('[data-menu-xmlid="sale.menu_sale_general_settings"]');

  await page.waitForSelector('[name="group_uom"]');
  await page.click('[name="group_uom"]');
  await capture("activate_uom_configuration.png", () => {
    addArrowToSelector('[name="group_uom"]', "1");
    addHighlightToSelector('[name="group_uom"]');
    addArrowToSelector('[name="execute"]', "2");
  });

  await capture("menu_config_uom.png", () => {
    const dom = '[attrs="{\'invisible\': [(\'group_uom\',\'=\',False)]}"]';
    addHighlightToSelector(dom);
    addArrowToSelector(dom);
  });
*/
/*
  // test config purchase flow
  await page.click('[data-menu-xmlid="purchase.menu_purchase_root"]');
  await page.waitForSelector('[data-menu-xmlid="purchase.menu_procurement_management"]');
  // expand menu
  await page.click('[data-menu-xmlid="purchase.menu_procurement_management"]');
  await capture( "purchase_home.png", () => {
    addBorderToSelector('[data-menu-xmlid="purchase.menu_procurement_management"]');
    addBorderToSelector('[data-menu-xmlid="purchase.menu_procurement_partner_contact_form"]', true);
  });

  await page.click('[data-menu-xmlid="purchase.menu_procurement_partner_contact_form"]');
  await page.waitForSelector(".btn.btn-primary.o-kanban-button-new");
  await capture("purchase_new_article_button.png", () => {
    addBorderToSelector(".btn.btn-primary.o-kanban-button-new", true);
  });

  await page.click(".btn.btn-primary.o-kanban-button-new");
  await page.waitForSelector('[name="name"]');
  // await page.type('[name="name"]', "My Sample Product");
  await page.select('[name="type"]', '"product"');
  // uncheck
  await page.click('[name="sale_ok"]');
  await capture("articles_fabric_general.png", () => {
    addArrowToSelector('[name="name"]', "1");
    addHighlightToSelector('[name="name"]');

    addArrowToSelector('[name="sale_ok"]', "2");
    addHighlightToSelector('[name="sale_ok"]');

    addArrowToSelector('[name="type"]', "3");
    addHighlightToSelector('[name="type"]');

    document.querySelector('[name="list_price"] input').value = ''
    addArrowToSelector('[name="list_price"]', "4");
    addHighlightToSelector('[name="list_price"]');

    addArrowToSelector('[name="taxes_id"]', "x");
    addHighlightToSelector('[name="taxes_id"]');

    document.querySelector('[name="standard_price"] input').value = ''
    addArrowToSelector('[name="standard_price"]', "5");
    addHighlightToSelector('[name="standard_price"]');

    document.querySelector('[name="uom_po_id"] input').value = ''
    addArrowToSelector('[name="uom_po_id"]', "6");
    addHighlightToSelector('[name="uom_po_id"]');

  });

  await capture("articles_invoicing_taxes.png", () => {
    document.querySelectorAll('.nav-item a')[4].click();
    document.querySelector('.o_content').scrollTop = 200;
    addArrowToSelector('.nav-item:nth-child(5)');
    addArrowToSelector('[name="supplier_taxes_id"]', "x");
    addHighlightToSelector('[name="supplier_taxes_id"]');
  });
  */

  /*
  // test config sales flow
  await page.click('[data-menu-xmlid="sale.sale_menu_root"]');
  await page.waitForSelector('[data-menu-xmlid="sale.product_menu_catalog"]');
  // expand menu
  await page.click('[data-menu-xmlid="sale.product_menu_catalog"]');
  await capture( "menu_ventes_articles.png", () => {
    addBorderToSelector('[data-menu-xmlid="sale.product_menu_catalog"]');
    addBorderToSelector('[data-menu-xmlid="sale.menu_product_template_action"]', true);
  });

  await page.click('[data-menu-xmlid="sale.menu_product_template_action"]');
  await page.waitForSelector(".btn.btn-primary.o-kanban-button-new");
  await capture("articles_ventes_create.png", () => {
    addBorderToSelector(".btn.btn-primary.o-kanban-button-new", true);
  });

  await page.click(".btn.btn-primary.o-kanban-button-new");
  await page.waitForSelector('[name="name"]');
  await page.select('[name="type"]', '"product"');
  // uncheck
  await page.click('[name="purchase_ok"]');
  await capture("articles_sale_general.png", () => {
    addArrowToSelector('[name="name"]', "1");
    addHighlightToSelector('[name="name"]');

    addArrowToSelector('[name="purchase_ok"]', "2");
    addHighlightToSelector('[name="purchase_ok"]');

    addArrowToSelector('[name="type"]', "3");
    addHighlightToSelector('[name="type"]');

    document.querySelector('[name="list_price"] input').value = ''
    addArrowToSelector('[name="list_price"]', "4");
    addHighlightToSelector('[name="list_price"]');

    addArrowToSelector('[name="taxes_id"]', "x");
    addHighlightToSelector('[name="taxes_id"]');

    document.querySelector('[name="standard_price"] input').value = ''
    addArrowToSelector('[name="standard_price"]', "5");
    addHighlightToSelector('[name="standard_price"]');

  });

  await capture("articles_sale_inventory.png", () => {
    document.querySelectorAll('.nav-item a')[5].click();
    document.querySelector('.o_content').scrollTop = 200;
    document.querySelector('[name="route_ids"] div:nth-child(2) label').click()
    document.querySelector('[name="route_ids"] div:nth-child(3) label').click()
    addBorderToSelector('.nav-item:nth-child(6)', true);
    addArrowToSelector('[name="route_ids"] div:nth-child(2)');
    addHighlightToSelector('[name="route_ids"]');
  });
  */

  /*
  // test config sales flow
  await page.click('[data-menu-xmlid="sale.sale_menu_root"]');
  await page.waitForSelector('[data-menu-xmlid="sale.sale_order_menu"]');
  // expand menu
  await page.click('[data-menu-xmlid="sale.sale_order_menu"]');
  await capture("menu_ventes_devis.png", () => {
    addBorderToSelector('[data-menu-xmlid="sale.sale_order_menu"]');
    addBorderToSelector('[data-menu-xmlid="sale.menu_sale_quotations"]', true);
    addArrowToSelector('.o_searchview_facet', 'x');
    addHighlightToSelector('.o_searchview_facet');
  });
  */

  /*
  // create invoice
  await page.click('[data-menu-xmlid="purchase.menu_purchase_root"]');
  await page.waitForSelector('.o_data_cell');
  await page.click('.o_data_cell');
  await page.waitForSelector('[name="action_view_invoice"]');
  await capture("po_view_invoices.png", () => {
    addBlur('[name="partner_id"]');
    addBlur('[name="amount_untaxed"]');
    addBlur('.ui-sortable');
    addBlur('[name="amount_tax"]');
    addBlur('[name="amount_total"]');
    addBorderToSelector('[name="action_view_invoice"]', true);
  });
  */

  /*
  // accounting
  await capture( "menu_comptabilite.png", () => {
    addBorderToSelector('[data-menu-xmlid="account_accountant.menu_accounting"]', true);
  });
  await page.click('[data-menu-xmlid="account_accountant.menu_accounting"]');
  await page.waitForSelector('[data-menu-xmlid="account.menu_finance_reports"]');
  await page.click('[data-menu-xmlid="account.menu_finance_reports"]');
  await capture( "menu_balance_sheet.png", () => {
    addBorderToSelector('[data-menu-xmlid="account.menu_finance_reports"]');
    addBorderToSelector('[data-menu-xmlid="l10n_ch_reports.account_financial_html_report_menu_7"]', true);
  });
  */

  /*
  // inventory
  await capture( "menu_inventory.png", () => {
    addBorderToSelector('[data-menu-xmlid="stock.menu_stock_root"]', true);
  });
  await page.click('[data-menu-xmlid="stock.menu_stock_root"]');
  await page.waitForSelector('[data-menu-xmlid="stock.menu_stock_inventory_control"]');
  await page.click('[data-menu-xmlid="stock.menu_stock_inventory_control"]');
  await capture( "menu_stocks_articles.png", () => {
    addBorderToSelector('[data-menu-xmlid="stock.menu_stock_inventory_control"]');
    addBorderToSelector('[data-menu-xmlid="stock.menu_product_variant_config_stock"]', true);
  }, {
    clip: {
      x: 0,
      y: 0,
      width: 1024,
      height: 350
    }
  });
  */

  /*
  // add client
  await capture( "menu_ventes.png", () => {
    addBorderToSelector('[data-menu-xmlid="sale.sale_menu_root"]', true);
  });
  await page.click('[data-menu-xmlid="sale.sale_menu_root"]');
  await page.waitForSelector('[data-menu-xmlid="sale.sale_order_menu"]');
  await page.click('[data-menu-xmlid="sale.sale_order_menu"]');
  await capture( "menu_ventes_clients.png", () => {
    addBorderToSelector('[data-menu-xmlid="sale.sale_order_menu"]');
    addBorderToSelector('[data-menu-xmlid="sale.res_partner_menu"]', true);
  }, {
    clip: {
      x: 0,
      y: 0,
      width: 1024,
      height: 350
    }
  });
  */

  await browser.close();
})();
