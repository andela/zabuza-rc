import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { PackageConfig } from "/lib/collections/schemas/registry";

export const NotificationPackageConfig = new SimpleSchema([
  PackageConfig, {
    "settings.sms.accSid": {
      type: String,
      label: "Acc Sid",
      defaultValue: ""
    },
    "settings.sms.authToken": {
      type: String,
      label: "Auth Token",
      defaultValue: ""
    },
    "settings.sms.phoneNumber": {
      type: String,
      label: "Twilio Phone Number",
      defaultValue: ""
    }
  }
]);

