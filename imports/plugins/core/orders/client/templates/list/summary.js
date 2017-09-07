import { Template } from "meteor/templating";
import { Logger } from "/client/api";
import { Meteor } from "meteor/meteor";
import { NumericInput } from "/imports/plugins/core/ui/client/components";

/**
 * ordersListSummary helpers
 *
 * @returns paymentInvoice
 */
Template.ordersListSummary.onCreated(function () {
  this.state = new ReactiveDict();

  this.autorun(() => {
    const currentData = Template.currentData();
    const order = currentData.order;

    this.state.set("order", order);
  });
});

Template.ordersListSummary.helpers({
  invoice() {
    return this.invoice;
  },

  numericInputProps(value) {
    const { currencyFormat } = Template.instance().data;

    return {
      component: NumericInput,
      value,
      format: currencyFormat,
      isEditing: false
    };
  },
  showCancelButton() {
    return !(this.order.workflow.status === "canceled"
      || this.order.workflow.status === "coreOrderWorkflow/completed");
  }
});

/**
 * ordersListSummary events
 */
Template.ordersListSummary.events({
  /**
   * Submit form
   * @param  {Event} event - Event object
   * @param  {Template} instance - Blaze Template
   * @return {void}
   */
  "click button[name=cancel]"(event, instance) {
    event.stopPropagation();

    const state = instance.state;
    const order = state.get("order");
    Alerts.alert({
      title: "Are you sure you want to cancel this order.",
      showCancelButton: true,
      confirmButtonText: "Cancel Order"
    }, (isConfirm) => {
      if (isConfirm) {
        Meteor.call("orders/cancelOrder", order, (error) => {
          if (!error) {
            const shoppersPhone = order.billing[0].address.phone;
            Logger.info("CUSTOMER ORDER DETAILS", order.items);
            Logger.info("CUSTOMER'S EMAIL", order.email);
            Logger.info("CUSTOMERS PHONE NUMBER " + shoppersPhone);
            const smsContent = {
              to: shoppersPhone
            };
            smsContent.message = "your order have been canceled";
            Meteor.call("send/smsAlert", smsContent, (error) => {
              Meteor.call("orders/response/error", error, "error occurred");
            });
          }
          Logger.warn(error);
        });
      }
    });
  }
});
