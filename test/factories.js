const { factory } = require('factory-girl');
const faker = require('faker');
const {Keycode, Community, Builder, Home, KeycodeBatch,
  CommunityBuilder, User, Device, Scan } = require('../app/models')
const { encryptedPassword } = require('../app/utils')

factory.define('KeycodeBatch', KeycodeBatch, {
  batchNumber: () => `${faker.random.number(100000000)}-${faker.random.number(100)}`,
})

factory.define('Keycode', Keycode, {
  status: 'unassigned',
  uid: () => faker.random.number(18446744073709551615),
  assignedAt: null,
  readyToShipAt: null,
  installedAt: null,
  activatedAt: null,
})

factory.define('User', User, {
  email: () => faker.internet.exampleEmail(),
  firstName: () => faker.name.findName(),
  lastName: () => faker.name.lastName(),
  encryptedPassword: () => encryptedPassword(faker.internet.password()),
  admin: true,
})

factory.define('Community', Community, {
  name: () => faker.company.catchPhraseNoun(),
  crossStreets: () =>`${faker.address.streetName()} & ${faker.address.streetName()}`,
  city: () => faker.address.city(),
  state: () => faker.address.stateAbbr(),
  zipCode: () => faker.address.zipCode(),
})

factory.define('Builder', Builder, {
  companyName: () => faker.company.companyName(),
  companyPhone: () => faker.phone.phoneNumber(),
  mainContactName: () => faker.name.findName(),
  mainContactPhone: () => faker.phone.phoneNumber(),
  mainContactEmail: () => faker.internet.email(),
  address1: () => faker.address.streetAddress(),
  address2: () => faker.address.secondaryAddress(),
  city: () => faker.address.city(),
  state: () => faker.address.stateAbbr(),
  zipCode: () => faker.address.zipCode(),
})

factory.define('Home', Home, {
  address1: () => faker.address.streetAddress(),
  address2: () => faker.address.secondaryAddress(),
  city: () => faker.address.city(),
  state: () => faker.address.stateAbbr(),
  zipCode: () => faker.address.zipCode(),
  builderId: factory.assoc('Builder', 'id'),
  communityId: factory.assoc('Community', 'id'),
  homeType: 'single_family',
  baths: () => faker.random.number({min:5, max:10}),
  beds: () => faker.random.number({min:5, max:10}),
  floorPlanUrl: "https://example.com/floorplanurl",
  imageUrl: "https://example.com/imageurl",
  logPlanUrl: "https://example.com/lotplanurl",
  garages: () => faker.random.number({min:5, max:10}),
  lot: 'big',
  lotSize: () => faker.random.number({min:5, max:10}),
  modelName: 'thebest',
  parcelNumber: 'abc123',
  squareFeet: () => faker.random.number({min:2000, max:10000}).toString(),
  yearBuilt: () => faker.random.number({min:1970, max:2020}).toString(),

})

factory.define('HomeWithKeycode', Home, {
  address1: () => faker.address.streetAddress(),
  address2: () => faker.address.secondaryAddress(),
  city: () => faker.address.city(),
  state: () => faker.address.stateAbbr(),
  zipCode: () => faker.address.zipCode(),
  builderId: factory.assoc('Builder', 'id'),
  communityId: factory.assoc('Community', 'id'),
  keycodeId: factory.assoc('Keycode', 'id'),
  homeType: 'single_family'
})

factory.define('Device', Device, {
  appVersion: "1.2.3",
  appType: "admin",
  deviceOS: "Android 8.1",
  deviceType: "Samsung Galaxy S9",
})

factory.define('Scan', Scan, {
  scanAction: 'identify',
  scanType: 'admin',
})

module.exports = factory
