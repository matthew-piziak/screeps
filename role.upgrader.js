var config = require('config');

var roleUpgrader = {
    run: function(creep) {
        var Action = {
            UPGRADING: 2,
            CHARGING: 3
        };
        if (creep.carry.energy == 0) {
            creep.memory.action = Action.CHARGING;
            creep.say('charging');
        }
        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.action = Action.UPGRADING;
            creep.say('upgrading');
        }
        if (creep.memory.action == Action.UPGRADING) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            var spawn = Game.spawns['Hejmo'];
            if (spawn.energy > 0) {
                if (spawn.transferEnergy(creep, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn);
                } else {
                    if (creep.body.length == config.CREEP_RECIPE.length) {
                        spawn.renewCreep(creep);
                    }
                }
            }
        }
    }
};

module.exports = roleUpgrader;
