"use strict";
const yaml = require("js-yaml");
const fs = require("fs");
const expect = require("chai").expect;
const getId = require("../../../lib/get-elements.js");
const helper = require("./payment_helper");

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("Paystack payment", function () {
  it("Should checkout product with paystack", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));
    const usrData = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/user-data.yml", "utf8"));

    helper.startUp(eleMap, eleIds, getId, usrData, browser);

    browser.click(".brand");
    browser.pause("6000");
    browser.click("#Y3scxJ2CCQ6xxsT9k");
    browser.pause("6000");
    browser.scroll(0, 300);
    browser.pause("5000");
    browser.click(".js-add-to-cart");
    browser.pause("2000");
    browser.click(".cart-alert-checkout");
    browser.pause("3000");
    browser.scroll(0, 500);
    browser.click(eleMap.free_shipping);
    browser.pause("4000");
    browser.click(eleMap.paystack_checkout);
    browser.pause("2000");
    browser.setValue("#payerName", "");
    browser.setValue("#payerName", "Daniel Amah");
    browser.pause("1000");
    browser.click("#completeOrder");
    browser.pause("10000");
    helper.paymentHelper(eleMap, eleIds, getId, browser);
    browser.pause("2000");
    browser.switchTab();
    browser.click("#download-btn");
    browser.pause("5000");
    browser.switchTab();
  });
});
