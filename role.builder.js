var config = require('config');
var roadUtils = require('utils.road');
var _ = require("lodash");

var roleBuilder = {
    run: function(creep) {
        var Action = {
            BUILDING: 1,
            UPGRADING: 2,
            CHARGING: 3
        };
        if (creep.carry.energy == 0) {
            creep.memory.action = Action.CHARGING;
            creep.say('charge');
        }
        if (creep.memory.action == Action.CHARGING && creep.carry.energy > 0) {
            var targets = [];
            config.TARGET_ROOMS.forEach((r) => {
                if (Game.rooms[r]) {
                    targets = targets.concat(Game.rooms[r].find(FIND_CONSTRUCTION_SITES));
                }
            });
            if (targets.length == 0 || creep.room.controller.ticksToDowngrade < DOWNGRADE_TRIGGER) {
                creep.memory.action = Action.UPGRADING;
                creep.say('upgrade');
            } else {
                creep.memory.action = Action.BUILDING;
                creep.say('build');
            }
        }
        if (creep.memory.action == Action.BUILDING) {
            targets = [];
            config.TARGET_ROOMS.forEach((r) => {
                if (Game.rooms[r]) {
                    targets = targets.concat(Game.rooms[r].find(FIND_CONSTRUCTION_SITES));
                }
            });
            if (targets.length > 0) {
                var target = creep.pos.findClosestByRange(targets);
                if (!target) { // off map or not accessible
                    target = targets[0];
                }
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
		creep.memory.action = Action.UPGRADING;
	    }
        } else if (creep.memory.action == Action.UPGRADING) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else { // CHARGING
            var spawn = Game.spawns['Hejmo'];
            if (spawn.transferEnergy(creep, _.min([spawn.energy, creep.carryCapacity])) < 0) {
                creep.moveTo(spawn);
            } else {
                if (creep.body.length == config.CREEP_RECIPE.length) {
                    spawn.renewCreep(creep);
                }
            }
        }
    }
};

module.exports = roleBuilder;
