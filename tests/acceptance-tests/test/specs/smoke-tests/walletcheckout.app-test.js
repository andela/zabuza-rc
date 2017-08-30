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
  // browser.getSession().then(function (sessionid) {
  //   browser.sessionID = sessionid.id_;
  // });
});

xdescribe("Wallet Payment", function () {
  it("Should checkout product with wallet", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));
    const usrData = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/user-data.yml", "utf8"));

    const walletHistory = usrData.wallet_history;
    const depositAmount = "5000";
    const transferAmount = "5000";
    const secondEmail = "dnlamah1@gmail.com";

    helper.startUp(eleMap, eleIds, getId, usrData, browser);

    browser.click(".brand");
    browser.pause("6000");
    browser.click("#5gnC8virkPj49ABrJ");
    browser.pause("6000");
    browser.scroll(0, 300);
    browser.pause("4000");
    browser.click(eleMap.red_option);
    browser.pause("1000");
    browser.click(".js-add-to-cart");
    browser.pause("2000");
    browser.click(".cart-alert-checkout");
    browser.pause("3000");
    browser.scroll(0, 500);
    browser.click(eleMap.free_shipping);
    browser.pause("4000");

    browser.click("#walletBtn");
    browser.pause("1000");
    browser.click("#pay-with-wallet");
    browser.pause("5000");
    browser.switchTab();
    expect(browser.getText(".flex-item-fill")).to.equal("Cancel Order");
  });
});
