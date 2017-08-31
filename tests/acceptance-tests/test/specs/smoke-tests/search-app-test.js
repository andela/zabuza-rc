"use strict";
const yaml = require("js-yaml");
const fs   = require("fs");
const expect = require("chai").expect;

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

xdescribe("Real Time Search", function () {
  it("should display all products that meet the search criteria", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const inputText = "e";

    browser.pause("5000");
    browser.click(eleMap.search_test);
    browser.pause(5000);
    browser.setValue("#search-input", inputText);
    browser.pause(5000);
    expect(browser.getText("#suggestedTitle")).to.contain("BASIC REACTION PRODUCT");
  });
  it("should display all products that meet the search criteria", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const inputText = "ba";

    browser.pause("5000");
    browser.click(eleMap.search_test);
    browser.pause(5000);
    browser.setValue("#search-input", inputText);
    browser.pause(5000);
    expect(browser.getText("#suggestedTitle")).to.contain("BASIC REACTION PRODUCT");
  });
});
