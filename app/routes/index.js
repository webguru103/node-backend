'use strict';

const express = require('express')
    , router = express.Router();
const passport = require('passport')

const authenticate = passport.authenticate('jwt', {session: false})

module.exports.routingMiddleware = () => {

    const action = (module, method) => require('../route-handlers/' + module)[method];

    // Health check
    router.get('/health_check', action('general','healthCheck'));

    // Auth
    router.post('/login', action('auth','emailLogin'));

    // Mobile Auth
    router.post('/mobi/login', action('auth','mobileLogin'));
    router.post('/mobi/register', action('auth','mobileRegister'));
    router.post('/mobi/phone-verify', action('auth','phoneVerificationRequest'));
    router.post('/mobi/reset-password', action('auth', 'resetPassword'));

    // Statistics
    router.get('/statistics', authenticate, action('statistics', 'getAll'));

    // Homes
    router.get('/homes', authenticate, action('homes', 'getAll'));
    router.post('/homes', authenticate, action('homes', 'create'));
    router.get('/homes/:id', authenticate, action('homes', 'getOne'));
    router.put('/homes/:id', authenticate, action('homes', 'update'));

    // Keycode Scans
    router.post('/keycodes/scans/admin', authenticate, action('scans', 'createAdmin'));
    router.get('/keycodes/scans/admin', authenticate, action('scans', 'getAdminScans'));
    router.get('/keycodes/:keycodeUID/scans/admin', authenticate, action('scans', 'getKeycodeScanAdmin'));

    // Keycodes
    router.get('/keycodes', authenticate, action('keycodes', 'getAll'));
    router.post('/keycodes', authenticate, action('keycodes', 'create'));
    router.get('/keycodes/:uid', authenticate, action('keycodes', 'getOne'));
    router.put('/keycodes/:uid', authenticate, action('keycodes', 'update'));
    router.get('/keycodes/:uid/image/:ext', authenticate, action('keycodes', 'getImage'));

    // Keycode batches
    router.get('/keycode_batches/:id/status', authenticate, action('keycodeBatches', 'getStatus'));

    // Keycode Homes
    router.get('/keycode_homes', authenticate, action('keycodeHomes', 'getAll'));

    // Queued Homes
    router.get('/queued_homes', authenticate, action('queuedHomes', 'getAll'));

    // Builders
    router.get('/builders', authenticate, action('builders', 'getAll'));
    router.post('/builders', authenticate, action('builders', 'create'));
    router.get('/builders/:id', authenticate, action('builders', 'getOne'));
    router.put('/builders/:id', authenticate, action('builders', 'update'));

    // Communities
    router.get('/communities', authenticate, action('communities', 'getAll'));
    router.post('/communities', authenticate, action('communities', 'create'));
    router.get('/communities/:id', authenticate, action('communities', 'getOne'));
    router.put('/communities/:id', authenticate, action('communities', 'update'));

    // Users
    router.get('/users', authenticate, action('users', 'getAll'));
    router.get('/users/:id', authenticate, action('users', 'getOne'));
    router.post('/users', authenticate, action('users', 'create'));
    router.put('/users/:id', authenticate, action('users', 'update'));

    // RoomTypes
    router.get('/roomtypes', authenticate, action('roomTypes', 'getAll'));
    router.post('/roomtypes/by-id', authenticate, action('roomTypes', 'getAllByIds'));

    // OutdoorTypes
    router.get('/outdoortypes', authenticate, action('outdoorTypes', 'getAll'));
    router.post('/outdoortypes/by-id', authenticate, action('outdoorTypes', 'getAllByIds'));

    // SystemTypes
    router.get('/systemtypes', authenticate, action('systemTypes', 'getAll'));
    router.post('/systemtypes/by-id', authenticate, action('systemTypes', 'getAllByIds'));

    // Item Category
    router.get('/itemcategories', authenticate, action('itemCategories', 'getAll'));
    router.get('/itemcategories/by-type', authenticate, action('itemCategories', 'getAllByType'));
    router.post('/itemcategories/by-id', authenticate, action('itemCategories', 'getAllByIds'));

    // Super Category
    router.get('/supercategories', authenticate, action('superCategories', 'getAll'));
    router.post('/supercategories/by-id', authenticate, action('superCategories', 'getAllByIds'));

    // ItemTypes
    router.get('/itemtypes', authenticate, action('itemTypes', 'getAll'));
    router.get('/itemtypes/by-item', authenticate, action('itemTypes', 'getAllByItemCategory'));
    router.get('/itemtypes/by-super', authenticate, action('itemTypes', 'getAllBySuperCategory'));
    router.post('/itemtypes/by-id', authenticate, action('itemTypes', 'getAllByIds'));

    // CarpetTypes
    router.get('/carpettypes', authenticate, action('carpetTypes', 'getAll'));
    router.get('/carpettype/:id', authenticate, action('carpetTypes', 'getById'));
    router.post('/carpettypes/by-id', authenticate, action('carpetTypes', 'getAllByIds'));

    // ConstructionTypes
    router.get('/constructiontypes', authenticate, action('constructionTypes', 'getAll'));
    router.get('/constructiontype/:id', authenticate, action('constructionTypes', 'getById'));
    router.post('/constructiontypes/by-id', authenticate, action('constructionTypes', 'getAllByIds'));

    // VinylFloorTypes
    router.get('/floortypes', authenticate, action('vinylFloorTypes', 'getAll'));
    router.get('/floortype/:id', authenticate, action('vinylFloorTypes', 'getById'));
    router.post('/floortypes/by-id', authenticate, action('vinylFloorTypes', 'getAllByIds'));

    // SheenTypes
    router.get('/sheentypes', authenticate, action('sheenTypes', 'getAll'));
    router.get('/sheentype/:id', authenticate, action('sheenTypes', 'getById'));
    router.post('/sheentypes/by-id', authenticate, action('sheenTypes', 'getAllByIds'));

    // SpeciesTypes
    router.get('/speciestypes', authenticate, action('speciesTypes', 'getAll'));
    router.get('/speciestype/:id', authenticate, action('speciesTypes', 'getById'));
    router.post('/speciestypes/by-id', authenticate, action('speciesTypes', 'getAllByIds'));

    // PaintTypes
    router.get('/painttypes', authenticate, action('paintTypes', 'getAll'));
    router.get('/painttype/:id', authenticate, action('paintTypes', 'getById'));
    router.post('/painttypes/by-id', authenticate, action('paintTypes', 'getAllByIds'));

    // MaterialTypes
    router.get('/materialtypes', authenticate, action('materialTypes', 'getAll'));
    router.get('/materialtype/:id', authenticate, action('materialTypes', 'getById'));
    router.get('/materialtypes/item-type', authenticate, action('materialTypes', 'getAllByItemType'));
    router.post('/materialtypes/by-id', authenticate, action('materialTypes', 'getAllByIds'));

    // ItemConsumables
    router.get('/itemconsumables', authenticate, action('itemConsumables', 'getAll'));
    router.get('/itemconsumables/item-type', authenticate, action('itemConsumables', 'getAllByItemType'));

    // ColorFamilies
    router.get('/colorfamilies', authenticate, action('colorFamilies', 'getAll'));
    router.get('/colorfamily/:id', authenticate, action('colorFamilies', 'getById'));
    router.get('/colorfamilies/item-type', authenticate, action('colorFamilies', 'getAllByItemType'));
    router.get('/colorfamilies/by-type', authenticate, action('colorFamilies', 'getAllByType'));
    router.post('/colorfamilies/by-id', authenticate, action('colorFamilies', 'getAllByIds'));

    // ColorFinishes
    router.get('/colorfinishes', authenticate, action('colorFinishes', 'getAll'));
    router.get('/colorfinish/:id', authenticate, action('colorFinishes', 'getById'));
    router.get('/colorfinishes/item-type', authenticate, action('colorFinishes', 'getAllByItemType'));
    router.get('/colorfinishes/by-type', authenticate, action('colorFinishes', 'getAllByType'));
    router.post('/colorfinishes/by-id', authenticate, action('colorFinishes', 'getAllByIds'));

    // Rooms
    router.get('/rooms', authenticate, action('rooms', 'getAll'));
    router.get('/room/:id', authenticate, action('rooms', 'getById'));
    router.get('/rooms/by-type', authenticate, action('rooms', 'getAllByType'));
    router.get('/rooms/by-home', authenticate, action('rooms', 'getAllByHome'));
    router.post('/rooms', authenticate, action('rooms', 'create'));
    router.post('/rooms/all', authenticate, action('rooms', 'createAll'));
    router.put('/rooms/:id', authenticate, action('rooms', 'update'));
    router.delete('/rooms/:id', authenticate, action('rooms', 'delete'));

    // Items
    router.get('/items', authenticate, action('items', 'getAll'));
    router.get('/item/:id', authenticate, action('items', 'getById'));
    router.get('/items/by-type', authenticate, action('items', 'getAllByType'));
    router.post('/items', authenticate, action('items', 'create'));
    router.put('/items/:id', authenticate, action('items', 'update'));
    router.delete('/items/:id', authenticate, action('items', 'delete'));

    // Outdoors
    router.get('/outdoors', authenticate, action('outdoors', 'getAll'));
    router.get('/outdoor/:id', authenticate, action('outdoors', 'getById'));
    router.get('/outdoors/by-type', authenticate, action('outdoors', 'getAllByType'));
    router.get('/outdoors/by-home', authenticate, action('outdoors', 'getAllByHome'));
    router.post('/outdoors', authenticate, action('outdoors', 'create'));
    router.post('/outdoors/all', authenticate, action('outdoors', 'createAll'));
    router.put('/outdoors/:id', authenticate, action('outdoors', 'update'));
    router.delete('/outdoors/:id', authenticate, action('outdoors', 'delete'));

    // HomeSystems
    router.get('/systems', authenticate, action('homesystems', 'getAll'));
    router.get('/system/:id', authenticate, action('homesystems', 'getById'));
    router.get('/systems/by-type', authenticate, action('homesystems', 'getAllByType'));
    router.get('/systems/by-home', authenticate, action('homesystems', 'getAllByHome'));
    router.post('/systems', authenticate, action('homesystems', 'create'));
    router.post('/systems/all', authenticate, action('homesystems', 'createAll'));
    router.put('/systems/:id', authenticate, action('homesystems', 'update'));
    router.delete('/systems/:id', authenticate, action('homesystems', 'delete'));

    // OutdoorItems
    router.get('/outdooritems', authenticate, action('outdoorItems', 'getAll'));
    router.get('/outdooritem/:id', authenticate, action('outdoorItems', 'getById'));
    router.get('/outdooritems/by-item', authenticate, action('outdoorItems', 'getAllByItem'));
    router.get('/outdooritems/by-outdoor', authenticate, action('outdoorItems', 'getAllByOutdoor'));
    router.post('/outdooritems', authenticate, action('outdoorItems', 'create'));
    router.put('/outdooritems/:id', authenticate, action('outdoorItems', 'update'));
    router.post('/outdooritems/delete/by-item', authenticate, action('outdoorItems', 'deleteByItem'));
    router.delete('/outdooritems/:id', authenticate, action('outdoorItems', 'delete'));

    // RoomItems
    router.get('/roomitems', authenticate, action('roomItems', 'getAll'));
    router.get('/roomitem/:id', authenticate, action('roomItems', 'getById'));
    router.get('/roomitems/by-item', authenticate, action('roomItems', 'getAllByItem'));
    router.get('/roomitems/by-room', authenticate, action('roomItems', 'getAllByRoom'));
    router.post('/roomitems', authenticate, action('roomItems', 'create'));
    router.put('/roomitems/:id', authenticate, action('roomItems', 'update'));
    router.post('/roomitems/delete/by-item', authenticate, action('roomItems', 'deleteByItem'));
    router.delete('/roomitems/:id', authenticate, action('roomItems', 'delete'));

    // HomeSystemItems
    router.get('/systemitems', authenticate, action('systemItems', 'getAll'));
    router.get('/systemitem/:id', authenticate, action('systemItems', 'getById'));
    router.get('/systemitems/by-item', authenticate, action('systemItems', 'getAllByItem'));
    router.get('/systemitems/by-system', authenticate, action('systemItems', 'getAllBySystem'));
    router.post('/systemitems', authenticate, action('systemItems', 'create'));
    router.put('/systemitems/:id', authenticate, action('systemItems', 'update'));
    router.delete('/systemitems/:id', authenticate, action('systemItems', 'delete'));

    // Paints
    router.get('/paints/by-home', authenticate, action('paints', 'getPaints'));

    // Floors
    router.get('/floors/type', authenticate, action('floors', 'getFloorTypes'));
    router.get('/floors/by-home', authenticate, action('floors', 'getFloors'));


    // Mobile API
    router.get('/mobi/dashboard', authenticate, action('mobi', 'getDashboard'));
    router.get('/mobi/home/:id', authenticate, action('mobi', 'getHomeDetail'));
    router.get('/mobi/rooms', authenticate, action('mobi', 'getRooms'));
    router.get('/mobi/rooms/:id', authenticate, action('mobi', 'getRoom'));
    router.get('/mobi/outdoors', authenticate, action('mobi', 'getOutdoors'));
    router.get('/mobi/outdoors/:id', authenticate, action('mobi', 'getOutdoor'));
    router.get('/mobi/systems', authenticate, action('mobi', 'getHomesystems'));
    router.get('/mobi/systems/:id', authenticate, action('mobi', 'getHomesystem'));
    // Item Detail
    router.get('/mobi/item/:id', authenticate, action('mobi', 'getItemDetail'));
    // Paints and Floors
    router.get('/mobi/paints', authenticate, action('mobi', 'getPaints'));
    router.get('/mobi/floors-type', authenticate, action('mobi', 'getFloorTypes'));
    router.get('/mobi/floors', authenticate, action('mobi', 'getFloors'));

    return router;
};

