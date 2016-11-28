var memoryUtils = require('utils.memory');
var roleBuilder = require('role.builder');
var roleHarvester = require('role.harvester');
var roleUniversal = require('role.universal');
var roleUtils = require('utils.role');
var towerFirer = require('towerFirer');
var config = require('config');

module.exports.loop = function() {
    memoryUtils.clear();

    Memory.home = 'E1N68';
    towerFirer.fire(Memory.home);

    roleUtils.maintain('builder', config.NUM_BUILDERS);
    roleUtils.maintain('harvester', config.NUM_HARVESTERS);

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
	roleUniversal.run(creep);
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
