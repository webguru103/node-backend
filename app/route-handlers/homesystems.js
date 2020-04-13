'use strict';

const db = require('../data-access');
const { systemSerializer } = require('../serializers');

module.exports.getAll = async (req, res) => {
  const { count, systems } = await db.homeSystems.getAll();
  const _systems = systems.map(system => systemSerializer(system));

  return res.status(200).send({ count, systems: _systems });
}

module.exports.getAllByType = async (req, res) => {
  const typeId = req.query.typeId;
  const { count, systems } = await db.homeSystems.getAllByType(typeId);
  const _systems = systems.map(system => systemSerializer(system));

  return res.status(200).send({ count, systems: _systems });
}

module.exports.getAllByHome = async (req, res) => {
  const _homeId = req.query.homeId;
  const { count, systems } = await db.homeSystems.getAllByHome(_homeId);
  const _systems = systems.map(system => ({
    system: systemSerializer(system.system),
    itemCount: system.itemCount
  }));

  return res.status(200).send({ count, systems: _systems });
}

module.exports.getById = async (req, res) => {
  const id = req.params.id;
  const { system, item } = await db.homeSystems.getById(id);
  const _system = systemSerializer(system);

  return res.status(200).send({ system: _system, item });
}

module.exports.create = async (req, res) => {
  const _system = req.body.system;
  const { system } = await db.homeSystems.createSystem(_system);
  return res.status(200).send({ system: systemSerializer(system) });
}

module.exports.createAll = async (req, res) => {
  const _systems = req.body.systems;
  const homeId = req.body.homeId;
  const { systems: _oldSystems } = await db.homeSystems.getAllByHome(homeId);
  const _filteredOldSystems = _oldSystems.filter(system => {
    const idx = _systems.findIndex(hs => hs.systemTypeId === system.system.systemTypeId)
    if (idx === -1) return true;

    return false;
  });
  const _filteredSystems = _oldSystems.filter(system => {
    const idx = _systems.findIndex(hs => hs.systemTypeId === system.system.systemTypeId)
    if (idx === -1) return false;

    return true;
  });
  const _newSystems = _systems.filter(system => {
    const idx = _oldSystems.findIndex(hs => hs.system.systemTypeId === system.systemTypeId)
    if (idx === -1) return true;

    return false;
  });
  await db.homeSystems.deleteSystems({ systems: _filteredOldSystems.map(system => system.system) });

  const newSystems = await db.homeSystems.createSystems({systems: _newSystems});
  const systems = [..._filteredSystems, ...newSystems];
  
  return res.status(200).send({
    systems: systems.map(system => ({
      system: systemSerializer(system.system),
      itemCount: system.itemCount ? system.itemCount : 0
    })),
    count: systems.length
  })
}

module.exports.update = async (req, res) => {
  const _system = req.body.system;
  const id = req.params.id;
  const { system } = await db.homeSystems.updateSystem({ id, system: _system });
  return res.status(200).send({ system: systemSerializer(system) });
}

module.exports.delete = async (req, res) => {
  const id = req.params.id;
  const { message } = await db.homeSystems.deleteSystem(id);
  return res.status(200).send({ message });
}
