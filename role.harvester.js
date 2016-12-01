var roadUtils = require('utils.road');
var config = require('config');
var sandbox = require('sandbox');

var roleHarvester = {
    run: function(creep) {
        if (creep.carry.energy == 0) {
            creep.memory.harvesting = true;
        }
        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
        }
        if (creep.memory.harvesting) {
            if (!creep.memory.assigned_source) {
                if (!sandbox.get_dispatched_source(creep)) {
                    creep.say("waiting");
                } else {
                    creep.memory.assigned_source = sandbox.get_dispatched_source(creep).id;
                    creep.say("new source: " + creep.memory.assigned_source);
                }
            } else {
                if (creep.harvest(Game.getObjectById(creep.memory.assigned_source)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.assigned_source));
                }
            }
        } else {
            creep.memory.assigned_source = null;
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER ||
                        structure.structureType == STRUCTURE_LINK) && structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length > 0) {
		var best_target = creep.pos.findClosestByPath(targets);
                if (creep.transfer(best_target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(best_target);
                } else {
                    if (best_target == Game.spawns['Hejmo']) {
                        if (creep.ticksToLive < 200) {
                            if (creep.body.length == config.CREEP_RECIPE.length) {
                                Game.spawns['Hejmo'].renewCreep(creep);
                            }
                        }
                    }
                }
            } else {
                var target = Game.spawns['Hejmo'];
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                } else {
                    if (creep.ticksToLive < 200) {
                        if (creep.body.length == config.CREEP_RECIPE.length) {
                            Game.spawns['Hejmo'].renewCreep(creep);
                        }
                    }

                }
            }
        }
    }
};

module.exports = roleHarvester;
