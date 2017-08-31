"use strict";
const yaml = require("js-yaml");
const fs   = require("fs");
const faker = require("faker");
const expect = require("chai").expect;
// const getId = require("../../../lib/get-elements.js");

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
  // browser.getSession().then(function (sessionid) {
  //   browser.sessionID = sessionid.id_;
  // });
});

describe("simple login test", function () {
  const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
  // const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));

  const usrData = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/user-data.yml", "utf8"));
  const adminEmail = process.env.REACTION_EMAIL || usrData.admin_email;
  const adminPassword = process.env.REACTION_AUTH || usrData.admin_pw;

  const vendorUsrname = usrData.vendor_usrname;
  const vendorEmail = usrData.vendor_email;
  const vendorPwd = usrData.vendor_pwd;
  const shopName = usrData.vendor_shopname;
  // const vendorUsrname = faker.name.findName();
  // const vendorEmail = faker.internet.email();
  // const vendorPwd = usrData.vendor_pwd;
  // let shopName = faker.company.companyName();
  // shopName = shopName.split(" ")[0] || shopName.split("/")[0] ||
  //   shopName.split(",")[0] || shopName.split("-")[0];
  const shopAddress = faker.address.streetAddress();
  const phoneNo = usrData.vendor_phoneno;

  it("should register a new vendor - and verifies user name in dropdown", function () {
    browser.pause("5000");
    browser.click(eleMap.login_dropdown_btn);
    browser.pause(1500);
    browser.click(eleMap.sign_up);
    browser.pause(1500);
    browser.click("#vendor");
    browser.pause(1500);
    browser.setValue(".login-input-username", vendorUsrname);
    browser.pause(1500);
    browser.setValue(".login-input-email", vendorEmail);
    browser.pause(1500);
    browser.setValue(".login-input-password", vendorPwd);
    browser.pause(1500);
    browser.setValue(".shop-name", shopName);
    browser.pause(1500);
    browser.setValue(".shop-address", shopAddress);
    browser.pause(1500);
    browser.setValue(".shop-phone", phoneNo);
    browser.pause(1500);
    browser.click(eleMap.register_btn);
    expect(browser.getText("#logged-in-display-name")).to.equal(vendorUsrname);
  });
  it("should activate a vendor only by an admin", () => {
    browser.pause("5000");
    browser.click(eleMap.login_dropdown_btn);
    browser.pause("1500");
    browser.setValue(".login-input-email", adminEmail);
    browser.pause("1500");
    browser.setValue(".login-input-password", adminPassword);
    browser.pause("1500");
    browser.click(eleMap.login_btn);
    browser.pause("1500");
    browser.click(eleMap.user_account_dropdown_btn);
    browser.pause("1500");
    browser.click(".drop-id-3");
    browser.pause("1500");
    browser.click(eleMap.activate_vendor);
    browser.pause("1500");
    expect(browser.getText(eleMap.deactivate_vendor)).to.equal("Deactivate Vendor");
  });
  it("should display a vendor tab when activated by an admin", () => {
    browser.pause("3000");
    browser.click(eleMap.user_account_dropdown_btn);
    browser.pause("1500");
    browser.click("#logout");
    browser.pause("1500");
    browser.click(eleMap.login_dropdown_btn);
    browser.pause("1500");
    browser.setValue(".login-input-email", vendorEmail);
    browser.pause("1500");
    browser.setValue(".login-input-password", vendorPwd);
    browser.pause("1500");
    browser.click(eleMap.login_btn);
    browser.pause("1500");
    expect(browser.getText(".my-shop-menu")).to.equal("VENDOR");
  });
  it("should display the vendor title when activated by an admin", () => {
    browser.pause("4000");
    browser.click(".my-shop-menu");
    expect(browser.getText(".page-title").toLowerCase())
    .to
    .equal(vendorUsrname.toLowerCase() + " store's shop");
  });
});
