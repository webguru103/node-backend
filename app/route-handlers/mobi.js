const jwt = require('jwt-simple');
const sId = 'AC543678b029d6155187817b3ddbdd3220';
const authKey = '42f00c40a5b1fc86e3b02ede6a176d47';
const twilioClient = require('twilio')(sId, authKey);
const db = require('../data-access');
const {
  homeSerializer,
  builderSerializer,
  communitySerializer,
  roomSerializer,
  roomItemSerializer,
  outdoorSerializer,
  outdoorItemSerializer,
  systemSerializer,
  systemItemSerializer,
  itemSerializer
} = require('../serializers');

module.exports.getDashboard = async (req, res) => {
  try {
    // ToDo: get Home using userId and keycode
    const homeId = req.query.homeId ? parseInt(req.query.homeId) : 2;
    const _home = await db.homes.getHome({id: homeId});

    if (!_home) return res.status(404).send({home: null})

    const home = homeSerializer(_home)

    // ToDo: get the todos, ideas, smartShope using userId
    res.status(200).send({
      home,
      todos: [],
      ideas: [],
      smartShop: {}
    })
  } catch (errors) {
    res.status(400).json({errors})    
  }
}

module.exports.getHomeDetail = async (req, res) => {
  const id = parseInt(req.params.id)
  const _home = await db.homes.getHome({id})

  if (!_home) return res.status(404).send({home: null})

  const home = homeSerializer(_home)

  return res.status(200).send({home, builder: builderSerializer(_home.Builder), community: communitySerializer(_home.Community)})
}

module.exports.getRooms = async (req, res) => {
  const _homeId = req.query.homeId;
  const { count, rooms } = await db.rooms.getRoomsByHome(_homeId);
  const _rooms = rooms.map(room => ({
    room: roomSerializer(room.room),
    itemCount: room.itemCount
  }));

  return res.status(200).send({ count, rooms: _rooms });
}

module.exports.getRoom = async (req, res) => {
  const roomId = parseInt(req.params.id);
  const { room, item } = await db.rooms.getRoom(roomId);
  const _room = roomSerializer(room);
  const { count, roomItems } = await db.roomItems.getAllByRoom(roomId);
  const _roomitems = roomItems.map(item => roomItemSerializer(item));

  return res.status(200).send({ roomItems: _roomitems, room: _room, item });
}

module.exports.getOutdoors = async (req, res) => {
  const _homeId = req.query.homeId;
  const { count, outdoors } = await db.outdoors.getAllByHome(_homeId);
  const _outdoors = outdoors.map(outdoor => ({
    outdoor: outdoorSerializer(outdoor.outdoor),
    item_count: outdoor.item_count
  }));

  return res.status(200).send({ count, outdoors: _outdoors });
}

module.exports.getOutdoor = async (req, res) => {
  const outdoorId = parseInt(req.params.id);
  const { outdoor, item } = await db.outdoors.getById(outdoorId);
  const _outdoor = outdoorSerializer(outdoor);
  const { count, outdoorItems } = await db.outdoorItems.getAllByOutdoor(outdoorId);
  const _outdooritems = outdoorItems.map(item => outdoorItemSerializer(item));

  return res.status(200).send({ outdoorItems: _outdooritems, outdoor: _outdoor, item });
}

module.exports.getHomesystems = async (req, res) => {
  const _homeId = req.query.homeId;
  const { count, systems } = await db.homeSystems.getAllByHome(_homeId);
  const _systems = systems.map(system => ({
    system: systemSerializer(system.system),
    item_count: system.item_count
  }));

  return res.status(200).send({ count, systems: _systems });
}

module.exports.getHomesystem = async (req, res) => {
  const systemId = parseInt(req.params.id);
  const { system, item } = await db.homeSystems.getById(systemId);
  const _system = systemSerializer(system);
  const { count, systemItems } = await db.systemItems.getAllBySystem(systemId);
  const _systemItems = systemItems.map(item => systemItemSerializer(item));

  return res.status(200).send({ systemItems: _systemItems, system: _system, item });
}

module.exports.getItemDetail = async (req, res) => {
  const id = req.params.id;
  const { item } = await db.items.getItem(id);
  const _item = itemSerializer(item);

  return res.status(200).send({ item: _item });
}

module.exports.getPaints = async (req, res) => {
  const homeId = req.query.home;
  const { paintItems } = await db.paints.getItemsByHome(homeId);

  return res.status(200).send({ paintItems });
}

module.exports.getFloors = async (req, res) => {
  const homeId = req.query.home;
  const { floorItems } = await db.floors.getItemsByHome(homeId);

  return res.status(200).send({ floorItems });
}

module.exports.getFloorTypes = async (req, res) => {
  const { mainCategories, subCategories } = await db.floors.getFloorTypes();
  
  return res.status(200).send({ mainCategories, subCategories });
}
