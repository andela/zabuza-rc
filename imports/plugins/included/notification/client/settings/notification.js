import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import { Packages } from "/lib/collections";
import { NotificationPackageConfig } from "../../lib/collections/schemas";

import "./notification.html";


Template.notificationSettings.helpers({
  NotificationPackageConfig() {
    return NotificationPackageConfig;
  },
  packageData() {
    return Packages.findOne({
      name: "notification",
      shopId: Reaction.getShopId()
    });
  }
});


AutoForm.hooks({
  "notifcation-update-form": {
    onSuccess: function () {
      Alerts.removeSeen();
      return Alerts.add("Notification settings saved.", "success");
    },
    onError: function (operation, error) {
      Alerts.removeSeen();
      return Alerts.add("Notification settings update failed. " + error, "danger");
    }
  }
});
