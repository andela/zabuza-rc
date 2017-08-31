"use strict";
const yaml = require("js-yaml");
const fs   = require("fs");
const expect = require("chai").expect;
const getId = require("../../../lib/get-elements.js");

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("Manage static pages", function () {
  it("verify admin can create static pages", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));
    // const usrData = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/user-data.yml", "utf8"));

    // default to process env if we've got that
    const adminEmail = process.env.REACTION_EMAIL || "rjegzcnp@localhost";
    const adminPassword = process.env.REACTION_AUTH || "DkQGzyps";
    const adminUserName = "Admin";

    browser.pause("5000");
    browser.click(eleMap.login_dropdown_btn);
    browser.pause(5000);
    browser.setValue(getId.retId(eleIds.login_email_fld_id), adminEmail);
    browser.setValue(getId.retId(eleIds.login_pw_fld_id), adminPassword);
    browser.click(eleMap.login_btn);
    browser.pause("5000");
    browser.click(eleMap.account_dropdown);
    browser.waitForExist(eleMap.dashboard_dropdown);
    browser.click(eleMap.dashboard_dropdown);
    browser.pause("3000");
    browser.click(eleMap.manage_static_page);
    browser.pause("5000");
    browser.setValue("#static_page_title", "About-Page");
    browser.setValue("#static-page-slug", "about-Page");
    browser.pause("1000");
    browser.click(eleMap.home_page);
    browser.pause(3000);
    browser.click(eleMap.page_dropdown);
    browser.waitForExist(eleMap.about_page);
    browser.click(eleMap.about_page);
    browser.pause(3000);
    expect(browser.getText("#logged-in-display-name")).to.equal(adminUserName);
  });
});
