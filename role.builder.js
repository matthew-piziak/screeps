var roadUtils = require('utils.road');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
	roadUtils.make_road_if_useful(creep);
	var num_harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
	if (num_harvesters.length < 3) {
	    creep.memory.role = 'harvester';
	    return;
	}
	Game.rooms[creep.pos.roomName].createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
        if (creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.memory.upgrading = false;
            creep.say('charging');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.memory.upgrading = false;
            creep.say('building');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity && creep.room.find(FIND_CONSTRUCTION_SITES).length == 0) {
            creep.memory.building = false;
            creep.memory.upgrading = true;
            creep.say('upgrading');
        }
        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        } else if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else { // charging
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
