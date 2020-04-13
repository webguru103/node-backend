const { Keycode, KeycodeBatch, Home, Builder, Community, User,
  CommunityBuilder, Scan, Device } = require('../app/models')

module.exports.clean = async () => {
  return Builder.truncate({cascade: true})
    .then(() => Community.truncate({cascade: true}))
    .then(() => CommunityBuilder.truncate({cascade: true}))
    .then(() => Device.truncate({cascade: true}))
    .then(() => Home.truncate({cascade: true}))
    .then(() => Keycode.truncate({cascade: true}))
    .then(() => KeycodeBatch.truncate({cascade: true}))
    .then(() => User.truncate({cascade: true}))
    .then(() => Scan.truncate({cascade: true}))
};
