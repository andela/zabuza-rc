/* eslint no-undef: 0*/
import moment from "moment";
import { Template } from "meteor/templating";
import { Orders, Shops, Audio, Video, Software, Book, Products }
  from "/lib/collections";
import { i18next } from "/client/api";


/**
 * dashboardOrdersList helpers
 *
 */
Template.dashboardOrdersList.helpers({
  orderStatus() {
    if (this.workflow.status === "coreOrderWorkflow/completed") {
      return i18next.t("order.completed");
    } else if (this.workflow.status === "canceled") {
      return "Canceled";
    }

    return i18next.t("order.processing");
  },
  showDigitalFileDownload() {
    const productId = this.items[0].productId;
    const sub = Meteor.subscribe("Product", productId);

    const getDigitalProductType = (db, product) => {
      Meteor.subscribe(product.digitalInfo.category, productId).ready();
      const result = db.findOne({
        "metadata.productId": productId
      });
      return result;
    };
    if (sub.ready()) {
      const product = Products.findOne(productId);

      if (product.digitalInfo.category === "audio") {
        return getDigitalProductType(Audio, product);
      } else if (product.digitalInfo.category === "video") {
        return getDigitalProductType(Video, product);
      } else if (product.digitalInfo.category === "book") {
        return getDigitalProductType(Book, product);
      } else if (product.digitalInfo.category === "software") {
        return getDigitalProductType(Software, product);
      }
      return product.isDigital;
    }
    return null;
  },
  orders(data) {
    if (data.hash.data) {
      return data.hash.data;
    }
    return Orders.find({}, {
      sort: {
        createdAt: -1
      },
      limit: 25
    });
  },
  orderAge() {
    return moment(this.createdAt).fromNow();
  },
  shipmentTracking() {
    return this.shipping[0].shipmentMethod.tracking;
  },
  shopName() {
    const shop = Shops.findOne(this.shopId);
    return shop !== null ? shop.name : void 0;
  },
  hasComment() {
    return this.comments.length > 0;
  }
});
