'use strict';

const db = require('../data-access');
const { roomSerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, rooms } = await db.rooms.getRooms();
  const _rooms = rooms.map(room => roomSerializer(room));

  return res.status(200).send({ count, rooms: _rooms });
}

module.exports.getAllByType = async (req, res) => {
  const _roomTypeId = req.query.roomTypeId;
  const { count, rooms } = await db.rooms.getRoomsByType(_roomTypeId);
  const _rooms = rooms.map(room => roomSerializer(room));

  return res.status(200).send({ count, rooms: _rooms });
}

module.exports.getAllByHome = async (req, res) => {
  const _homeId = req.query.homeId;
  const { count, rooms } = await db.rooms.getRoomsByHome(_homeId);
  const _rooms = rooms.map(room => ({
    room: roomSerializer(room.room),
    itemCount: room.itemCount
  }));

  return res.status(200).send({ count, rooms: _rooms });
}

module.exports.getById = async (req, res) => {
  const id = req.params.id;
  const { room, item } = await db.rooms.getRoom(id);
  const _room = roomSerializer(room);

  return res.status(200).send({ room: _room, item });
}

module.exports.createByType = async (req, res) => {
  const types = req.body.roomTypes;
  const homeId = req.body.homeId;
  const _rooms = types.map(roomType => ({
    name: roomType.name,
    roomTypeId: roomTypes.id,
    homeId: homeId
  }));
  const { rooms } = await db.rooms.createRooms(_rooms);
  return res.status(200).send({ rooms: rooms.map(room => roomSerializer(room)), count: rooms.length });
}

module.exports.create = async (req, res) => {
  const _room = req.body.room;
  const { room } = await db.rooms.createRoom(_room);
  return res.status(200).send({ room: roomSerializer(room) });
}

module.exports.createAll = async (req, res) => {
  const _rooms = req.body.rooms;
  const homeId = req.body.homeId;
  const { rooms: _oldRooms } = await db.rooms.getRoomsByHome(homeId);
  const _filteredOldRooms = _oldRooms.filter(room => {
    const idx = _rooms.findIndex(r => r.roomTypeId === room.room.roomTypeId)
    if (idx === -1) return true;

    return false;
  });
  const _filteredRooms = _oldRooms.filter(room => {
    const idx = _rooms.findIndex(r => r.roomTypeId === room.room.roomTypeId)
    if (idx === -1) return false;

    return true;
  });
  const _newRooms = _rooms.filter(room => {
    const idx = _oldRooms.findIndex(r => r.room.roomTypeId === room.roomTypeId)
    if (idx === -1) return true;

    return false;
  })
  await db.rooms.deleteRooms({ rooms: _filteredOldRooms.map(room => room.room) });

  const newRooms = await db.rooms.createRooms({rooms: _newRooms});
  const rooms = [..._filteredRooms, ...newRooms];
  return res.status(200).send({
    rooms: rooms.map(room => ({
      room: roomSerializer(room.room),
      itemCount: room.itemCount ? room.itemCount : 0
    })),
    count: rooms.length
  });
}

module.exports.update = async (req, res) => {
  const _room = req.body.room;
  const _roomId = req.params.id;
  const { room } = await db.rooms.updateRoom({ _roomId, room: _room });
  return res.status(200).send({ room: roomSerializer(room) });
}

module.exports.delete = async (req, res) => {
  const id = req.params.id;
  const { message } = await db.rooms.deleteRoom(id);
  return res.status(200).send({ message });
}
