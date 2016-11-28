var roadUtils = require('utils.road');
var config = require('config');

var roleHarvester = {
    run: function(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                } else {
                    if (targets[0] == Game.spawns['Hejmo']) {
                        if (creep.ticksToLive < 200) {
                            if (creep.body.length == config.CREEP_RECIPE.length) {
                                Game.spawns['Hejmo'].renewCreep(creep);
                            }
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleHarvester;
