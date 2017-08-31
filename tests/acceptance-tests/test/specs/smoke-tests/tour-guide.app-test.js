"use strict";
const yaml = require("js-yaml");
const fs   = require("fs");
const expect = require("chai").expect;

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("Tour Guide Tests", function () {
  it("should display the tour guide when a newly registered user logs in", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const usrData = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/user-data.yml", "utf8"));

    const guestUsrname = usrData.guest_usrname;
    const guestEmail = `zabuza@${Math.ceil(Math.random() * 100)}.com`;
    const guestPwd = usrData.guest_pwd;

    browser.pause("5000");
    browser.click(eleMap.login_dropdown_btn);
    browser.click(eleMap.sign_up);
    browser.setValue(".login-input-email", guestEmail);
    browser.setValue(".login-input-password", guestPwd);
    browser.click(eleMap.register_btn);
    browser.pause(5000);
    browser.click(".introjs-nextbutton");
    browser.pause(3000);
    browser.click(".introjs-nextbutton");
    browser.pause(3000);
    browser.click(".introjs-nextbutton");
    browser.pause(3000);
    browser.click(".introjs-nextbutton");
    browser.pause(3000);
    browser.click(".introjs-nextbutton");
    browser.pause(3000);
    browser.click(".introjs-nextbutton");
    browser.pause(3000);
    browser.click(".introjs-donebutton");
    browser.pause(3000);
    expect(browser.getText("#logged-in-display-name")).to.equal(guestUsrname);
  });
});
