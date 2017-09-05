"use strict";
const yaml = require("js-yaml");
const fs = require("fs");
const expect = require("chai").expect;
const getId = require("../../../lib/get-elements.js");

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("Vendor", function () {
  it("Should be able to cancel order", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));
    const usrData = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/user-data.yml", "utf8"));

    // default to process env if we've got that
    const adminEmail = process.env.REACTION_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.REACTION_AUTH || "r3@cti0n";

    // LOGIN IN
    browser.pause("5000");
    browser.click(eleMap.login_dropdown_btn);
    browser.pause(3000);
    browser.setValue(getId.retId(eleIds.login_email_fld_id), adminEmail);
    browser.setValue(getId.retId(eleIds.login_pw_fld_id), adminPassword);
    browser.click(eleMap.login_btn);
    browser.pause("5000");

    // Make Order
    browser.pause("2000");
    browser.click(".brand");
    browser.pause("8000");
    browser.click("#BCTMZ6HTxFSppJESk");
    browser.pause("6000");
    browser.scroll(0, 300);
    browser.pause("7000");
    browser.click(eleMap.red_option);
    browser.pause("1000");
    browser.click(".js-add-to-cart");
    browser.pause("2000");
    browser.click(".cart-alert-checkout");
    browser.pause("6000");
    browser.scroll(0, 500);
    browser.click(eleMap.free_shipping);
    browser.pause("4000");
    browser.click(eleMap.click_wallet);
    browser.pause("2000");
    browser.click(eleMap.pay_with_wallet);
    browser.pause("7000");

    browser.click(eleMap.dashboard_btn);
    browser.pause(3000);
    browser.click(eleMap.manage_orders);
    browser.pause(7000);
    // eslint-disable-next-line
    const totalCanceled = browser.getText("#canceled");
    browser.click(eleMap.cancel_order_btn);
    browser.pause("6000");
    browser.click(eleMap.confirm_cancel_order);
    browser.pause("6000");
    expect(Number(browser.getText("#canceled"))).to.equal(Number(totalCanceled) + 1);
  });
});
