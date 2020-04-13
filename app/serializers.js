
const R = require('ramda');

module.exports.communitySerializer = (community, extraFields = {}) => (
  Object.assign(
    {},
    R.pickAll(['id', 'name', 'crossStreets', 'city', 'state', 'zipCode'], community),
    extraFields));

module.exports.builderSerializer = (builder, extraFields = {}) => (
  Object.assign({}, 
    R.pickAll([
      'id', 'companyName', 'companyName', 'mainContactName', 'mainContactPhone', 'mainContactEmail',
      'address1', 'address2', 'zipCode', 'companyPhone', 'city', 'state'
    ], builder),
    extraFields));

module.exports.homeSerializer = (home, extraFields = {}) => (
  Object.assign({},
    R.pickAll([
      'id', 'address1', 'address2', 'city', 'state', 'zipCode', 'communityId', 'builderId', 'homeType', 'keycodeId', 'fullAddress',
      'beds', 'baths', 'garages', 'squareFeet', 'modelName', 'yearBuilt', 'lot', 'lotSize', 'parcelNumber', 'imageUrl',
      'floorPlanUrl', 'lotPlanUrl'
    ], home),
    extraFields));

module.exports.keycodeSerializer = (keycode, extraFields = {}) => (
  Object.assign(
    {},
    R.pickAll([
      'id', 'uid', 'pngLocation', 'svgLocation', 'status', 'installedAt', 'activatedAt', 'readyToShipAt', 'unassignedAt',
      'assignedAt', 'keycodeBatchId'
    ], keycode),
    extraFields));

module.exports.keycodeBatchSerializer = (keycodeBatch) => (R.pickAll(['id', 'batchNumber'], keycodeBatch));

module.exports.scanSerializer = (scan) => (R.pickAll(['id','scanType','scanAction','deviceId','keycodeId','createdAt'], scan));

module.exports.deviceSerializer = (device) => (R.pickAll(['id','appVersion','appType','deviceOS','deviceType','userId'], device));

module.exports.userSerializer = (user, extraFields = {}) => (
  Object.assign({},
    R.pickAll(['id', 'email', 'firstName', 'lastName', 'admin', 'phone', 'homeId'],user),
    extraFields
  )
);

module.exports.roomTypeSerializer = (roomType) => (R.pickAll(['id','name'], roomType));

module.exports.outdoorTypeSerializer = (outdoorType) => (R.pickAll(['id','name'], outdoorType));

module.exports.systemTypeSerializer = (systemType) => (R.pickAll(['id','name'], systemType));

module.exports.itemConsumableSerializer = (itemConsumable) => (R.pickAll(['id','name', 'itemTypeId'], itemConsumable));

module.exports.itemCategorySerializer = (itemCategory) => (R.pickAll(['id','name'], itemCategory));

module.exports.superCategorySerializer = (superCategory) => (R.pickAll(['id','name'], superCategory));

module.exports.itemTypeSerializer = (itemType) => (R.pickAll(['id','name', 'superCategoryId', 'itemCategoryId'], itemType));

module.exports.carpetTypeSerializer = (type) => (R.pickAll(['id','name'], type));

module.exports.colorFamilySerializer = (colorFamily) => (R.pickAll(['id','name', 'itemCategoryId'], colorFamily));

module.exports.colorFinishSerializer = (colorFinish) => (R.pickAll(['id','name', 'itemCategoryId'], colorFinish));

module.exports.constructionTypeSerializer = (type) => (R.pickAll(['id','name'], type));

module.exports.materialTypeSerializer = (materialType) => (R.pickAll(['id','name', 'itemCategoryId'], materialType));

module.exports.paintTypeSerializer = (paintType) => (R.pickAll(['id','name'], paintType));

module.exports.sheenTypeSerializer = (sheenType) => (R.pickAll(['id','name'], sheenType));

module.exports.speciesTypeSerializer = (speciesType) => (R.pickAll(['id','name'], speciesType));

module.exports.vinylFloorTypeSerializer = (type) => (R.pickAll(['id','name'], type));

module.exports.roomSerializer = (room) => (R.pickAll([
  'id','name', 'homeId', 'roomTypeId', 'level', 'width', 'height', 'squareFeet', 'imageUrl'
], room));

module.exports.itemSerializer = (item) => (R.pickAll([
  'id', 'name', 'brand', 'collection', 'model', 'modelNumber', 'colorCode', 'serialNumber', 'imageUrl',
  'length', 'width', 'height', 'size', 'ownersManualUrl', 'energyGuideUrl', 'warrantyUrl',
  'itemTypeId', 'colorFamilyId', 'colorMfg', 'colorSwatchUrl', 'materialTypeId', 'carpetTypeId',
  'vinylFloorTypeId', 'colorFinishId', 'paintTypeId', 'sheenTypeId', 'constructionTypeId', 'speciesTypeId'
], item));

module.exports.outdoorSerializer = (outdoor) => (R.pickAll(['id', 'name', 'homeId', 'outdoorTypeId', 'imageUrl'], outdoor));

module.exports.systemSerializer = (system) => (R.pickAll(['id', 'name', 'homeId', 'systemTypeId', 'imageUrl'], system));

module.exports.outdoorItemSerializer = (item) => (R.pickAll(['id', 'itemId', 'outdoorId'], item));

module.exports.roomItemSerializer = (item) => (R.pickAll(['id', 'itemId', 'roomId'], item));

module.exports.systemItemSerializer = (item) => (R.pickAll(['id', 'itemId', 'homeSystemId'], item));
