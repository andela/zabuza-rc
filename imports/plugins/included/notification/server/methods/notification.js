/* eslint camelcase: 0 */
// meteor modules
// reaction modules

Meteor.methods({
  /**
   * Submit a card for Authorization
   * @param  {Object} transactionType authorize or capture
   * @param  {Object} cardData card Details
   * @param  {Object} paymentData The details of the Payment Needed
   * @return {Object} results normalized
   */
  notify: function (transactionType, cardData) {
    check(transactionType, String);
    check(cardData);
  }
});
