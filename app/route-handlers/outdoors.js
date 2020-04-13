'use strict';

const db = require('../data-access');
const { outdoorSerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, outdoors } = await db.outdoors.getAll();
  const _outdoors = outdoors.map(outdoor => outdoorSerializer(outdoor));

  return res.status(200).send({ count, outdoors: _outdoors });
}

module.exports.getAllByType = async (req, res) => {
  const typeId = req.query.typeId;
  const { count, outdoors } = await db.outdoors.getAllByType(typeId);
  const _outdoors = outdoors.map(outdoor => outdoorSerializer(outdoor));

  return res.status(200).send({ count, outdoors: _outdoors });
}

module.exports.getAllByHome = async (req, res) => {
  const _homeId = req.query.homeId;
  const { count, outdoors } = await db.outdoors.getAllByHome(_homeId);
  const _outdoors = outdoors.map(outdoor => ({
    outdoor: outdoorSerializer(outdoor.outdoor),
    itemCount: outdoor.itemCount
  }));

  return res.status(200).send({ count, outdoors: _outdoors });
}

module.exports.getById = async (req, res) => {
  const id = req.params.id;
  const { outdoor, item } = await db.outdoors.getById(id);
  const _outdoor = outdoorSerializer(outdoor);

  return res.status(200).send({ outdoor: _outdoor, item });
}

module.exports.create = async (req, res) => {
  const _outdoor = req.body.outdoor;
  const { outdoor } = await db.outdoors.createOutdoor(_outdoor);
  return res.status(200).send({ outdoor: outdoorSerializer(outdoor) });
}

module.exports.createAll = async (req, res) => {
  const _outdoors = req.body.outdoors;
  const homeId = req.body.homeId;
  const { outdoors: _oldOutdoors } = await db.outdoors.getAllByHome(homeId);
  const _filteredOldOutdoors = _oldOutdoors.filter(outdoor => {
    const idx = _outdoors.findIndex(od => od.outdoorTypeId === outdoor.outdoor.outdoorTypeId)
    if (idx === -1) return true;

    return false;
  });
  const _filteredOutdoors = _oldOutdoors.filter(outdoor => {
    const idx = _outdoors.findIndex(od => od.outdoorTypeId === outdoor.outdoor.outdoorTypeId)
    if (idx === -1) return false;

    return true;
  });
  const _newOutdoors = _outdoors.filter(outdoor => {
    const idx = _oldOutdoors.findIndex(od => od.outdoor.outdoorTypeId === outdoor.outdoorTypeId)
    if (idx === -1) return true;

    return false;
  })
  await db.outdoors.deleteOutdoors({ outdoors: _filteredOldOutdoors.map(outdoor => outdoor.outdoor) });

  const newOutdoors = await db.outdoors.createOutdoors({outdoors: _newOutdoors});
  const outdoors = [..._filteredOutdoors, ...newOutdoors];
  
  return res.status(200).send({
    outdoors: outdoors.map(outdoor => ({
      outdoor: outdoorSerializer(outdoor.outdoor),
      itemCount: outdoor.itemCount ? outdoor.itemCount : 0
    })),
    count: outdoors.length
  });
}

module.exports.update = async (req, res) => {
  const _outdoor = req.body.outdoor;
  const id = req.params.id;
  const { outdoor } = await db.outdoors.updateOutdoor({ id, outdoor: _outdoor });
  return res.status(200).send({ outdoor: outdoorSerializer(outdoor) });
}

module.exports.delete = async (req, res) => {
  const id = req.params.id;
  const { message } = await db.outdoors.deleteOutdoor(id);
  return res.status(200).send({ message });
}
