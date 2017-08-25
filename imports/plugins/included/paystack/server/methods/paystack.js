/* eslint camelcase: 0 */
// meteor modules
import { Meteor } from "meteor/meteor";
import * as Collections from "/lib/collections";
// reaction modules
import { Reaction } from "/server/api";


Meteor.methods({
  /**
    * submit payment
    * @description gets paystack api keys
    * @return {Object} returns the paystack keys
    */
  "paystack/getKeys"() {
    const paystack = Collections.Packages.findOne({
      name: "paystack",
      shopId: Reaction.getShopId()
    });
    return {
      public: paystack.settings.publicKey || "pk_test_721548b2de1b20595f3e6d28af60c9c50ad95b6a",
      secret: paystack.settings.secretKey || "sk_test_d6f154ab2d63da23196d2dedd130c10d856280f2"
    };
  }
});
