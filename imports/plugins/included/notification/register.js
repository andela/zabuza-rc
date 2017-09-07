/* eslint camelcase: 0 */
import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "Notification",
  name: "notification",
  icon: "fa fa-credit-card-alt",
  autoEnable: true,
  settings: {
    mode: false,
    sms: {
      authToken: "",
      accSid: "",
      phoneNumber: ""
    }
  },
  registry: [
    // Dashboard card
    {
      provides: "dashboard",
      label: "Notification Provider",
      description: "Example payment provider",
      icon: "fa fa-credit-card-alt",
      priority: 3,
      container: "core"
    },

    // Settings panel
    {
      label: "Notification Settings", // this key (minus spaces) is used for translations
      route: "/dashboard/notification",
      provides: "settings",
      container: "dashboard",
      template: "notificationSettings"
    }  ]
});
