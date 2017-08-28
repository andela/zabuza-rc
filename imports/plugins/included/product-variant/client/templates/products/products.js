import { Reaction } from "/client/api";
import { ReactionProduct } from "/lib/api";
import { applyProductRevision } from "/lib/api/products";
import { Products, Tags } from "/lib/collections";
import { Session } from "meteor/session";
import { Template } from "meteor/templating";
import { ITEMS_INCREMENT } from "/client/config/defaults";
import { ReactiveDict } from "meteor/reactive-dict";
import * as Collections from "/lib/collections";

/**
 * loadMoreProducts
 * @summary whenever #productScrollLimitLoader becomes visible, retrieve more results
 * this basically runs this:
 * Session.set('productScrollLimit', Session.get('productScrollLimit') + ITEMS_INCREMENT);
 * @return {undefined}
 */
function loadMoreProducts() {
  let threshold;
  const target = $("#productScrollLimitLoader");
  let scrollContainer = $("#reactionAppContainer");

  if (scrollContainer.length === 0) {
    scrollContainer = $(window);
  }

  if (target.length) {
    threshold = scrollContainer.scrollTop() + scrollContainer.height() - target.height();

    if (target.offset().top < threshold) {
      if (!target.data("visible")) {
        target.data("productScrollLimit", true);
        Session.set("productScrollLimit", Session.get("productScrollLimit") + ITEMS_INCREMENT || 24);
      }
    } else {
      if (target.data("visible")) {
        target.data("visible", false);
      }
    }
  }
}


Template.products.onCreated(function () {
  this.products = ReactiveVar();
  this.state = new ReactiveDict();
  this.state.setDefault({
    initialLoad: true,
    slug: "",
    canLoadMoreProducts: false
  });

  // Update product subscription
  this.autorun(() => {
    const slug = Reaction.Router.getParam("slug");
    const shopName = Reaction.Router.getParam("shopName");
    const tag = Tags.findOne({ slug: slug }) || Tags.findOne(slug);
    const scrollLimit = Session.get("productScrollLimit");
    let tags = {}; // this could be shop default implementation needed

    if (tag) {
      tags = {tags: [tag._id]};
    }

    // if we get an invalid slug, don't return all products
    if (!tag && slug) {
      return;
    }

    if (this.state.equals("slug", slug) === false && this.state.equals("initialLoad", false)) {
      this.state.set("initialLoad", true);
    }

    this.state.set("slug", slug);

    const queryParams = Object.assign({}, tags, Reaction.Router.current().queryParams);
    this.subscribe("Products", scrollLimit, queryParams);

    const user = Meteor.users.findOne({
      _id: Meteor.userId()
    });

    const shop = Session.get("Shop");

    if (shop !== undefined) {
      const isOwner = Roles.userIsInRole(user, "owner", shop._id);
      const isAdmin = Roles.userIsInRole(user, "admin", shop._id);

      if (isOwner && !isAdmin) {
        search = {
          ancestors: [],
          vendorShopId: shop._id };
      } else {
        search = {
          ancestors: []
        };
      }
    } else {
      search = {
        ancestors: []
      };
    }

    // we are caching `currentTag` or if we are not inside tag route, we will
    // use shop name as `base` name for `positions` object
    const currentTag = ReactionProduct.getTag();
    let products;
    if (shopName) {
      products = Products.find({
        ancestors: [], reactionVendor: shopName
        // keep this, as an example
        // type: { $in: ["simple"] }
      }, {
        sort: {
          [`positions.${currentTag}.position`]: 1,
          [`positions.${currentTag}.createdAt`]: 1,
          createdAt: 1
        }
      });
    } else {
      products = Products.find({
        ancestors: []
      // keep this, as an example
      // type: { $in: ["simple"] }
      }, {
        sort: {
          [`positions.${currentTag}.position`]: 1,
          [`positions.${currentTag}.createdAt`]: 1,
          createdAt: 1
        }
      });
    }
    const productCursor = products;

    this.state.set("canLoadMoreProducts", productCursor.count() >= Session.get("productScrollLimit"));
    this.products.set(products);
  });

  this.autorun(() => {
    const isActionViewOpen = Reaction.isActionViewOpen();
    if (isActionViewOpen === false) {
      Session.set("productGrid/selectedProducts", []);
    }
  });
});

Template.products.onRendered(() => {
  // run the above func every time the user scrolls
  $("#reactionAppContainer").on("scroll", loadMoreProducts);
  $(window).on("scroll", loadMoreProducts);
});

Template.products.helpers({
  shopDetails() {
	  if (Reaction.Router.getParam("shopName")) {
    const shopName = Reaction.Router.getParam("shopName");
    const vendor = Collections.Accounts.find({"profile.vendorDetails.0.shopName": shopName}).fetch();
    if (vendor.length > 0 && vendor[0].profile !== undefined && vendor[0].profile.vendorDetails !== undefined) {
      return (vendor[0].profile.vendorDetails[0]);
    }
  }
    return undefined;
  },

  capitalizeShopName() {
    const shopName = Reaction.Router.getParam("shopName").split("");
    const capsShopName = shopName[0].toUpperCase();
    const remainingShopName = shopName.slice(1, shopName.length).join("");
    return (capsShopName + remainingShopName);
  },

  tag: function () {
    const id = Reaction.Router.getParam("_tag");
    return {
      tag: Tags.findOne({ slug: id }) || Tags.findOne(id)
    };
  },

  products() {
    return Template.instance().products.get();
  },

  loadMoreProducts() {
    return Template.instance().state.equals("canLoadMoreProducts", true);
  },

  initialLoad() {
    return Template.instance().state.set("initialLoad", true);
  },

  ready() {
    const instance = Template.instance();
    const isInitialLoad = instance.state.equals("initialLoad", true);
    const isReady = instance.subscriptionsReady();

    if (isInitialLoad === false) {
      return true;
    }

    if (isReady) {
      instance.state.set("initialLoad", false);
      return true;
    }

    return false;
  }
});

/**
 * products events
 */

Template.products.events({
  "click #productListView": function () {
    $(".product-grid").hide();
    return $(".product-list").show();
  },
  "click #productGridView": function () {
    $(".product-list").hide();
    return $(".product-grid").show();
  },
  "click .product-list-item": function () {
    // go to new product
    Reaction.Router.go("product", {
      handle: this._id
    });
  },
  "click [data-event-action=loadMoreProducts]": (event) => {
    event.preventDefault();
    loadMoreProducts();
  }
});
