var roadUtils = require('utils.road');

var roleBuilder = {
    run: function(creep) {
	var Action = {
	    BUILDING: 1,
	    UPGRADING: 2,
	    CHARGING: 3
	};
	var num_harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
	if (num_harvesters.length < 3) {
	    creep.memory.role = 'harvester';
	    return;
	}
	Game.rooms[creep.pos.roomName].createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
        if (creep.carry.energy == 0) {
	    creep.memory.action = Action.CHARGING;
            creep.say('charging');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	    creep.memory.action = Action.BUILDING;
            creep.say('building');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity && creep.room.find(FIND_CONSTRUCTION_SITES).length == 0) {
	    creep.memory.action = Action.UPGRADING;
            creep.say('upgrading');
        }
        if (creep.memory.action == Action.BUILDING) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        } else if (creep.memory.action == Action.UPGRADING) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            var spawn = Game.spawns['Hejmo'];
            if (spawn.energy > 0) {
                if (spawn.transferEnergy(creep, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn);
                } else {
		    if (creep.body.length > 3){
			spawn.renewCreep(creep);
		    }
		}
            }
        }
    }
};

module.exports = roleBuilder;
