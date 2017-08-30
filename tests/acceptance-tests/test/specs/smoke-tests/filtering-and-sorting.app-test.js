"use strict";
const yaml = require("js-yaml");
const fs   = require("fs");
const expect = require("chai").expect;

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("Real Time Search", function () {
  it("should display all products that meet the search criteria", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const inputText = "ba";

    browser.pause("5000");
    browser.click(eleMap.search_test);
    browser.pause(5000);
    browser.setValue("#search-input", inputText);
    browser.pause(3000);
    browser.click(eleMap.filter_click);
    browser.pause(3000);
    browser.scroll(0, 200);
    browser.click(".filter-search");
    browser.pause(4000);
    browser.click("#below_1000");
    browser.pause(4000);
    browser.click("#below_55");
    browser.pause(4000);
    expect(browser.getText("#suggestedTitle")).to.contain("BASIC REACTION PRODUCT");
  });
});
