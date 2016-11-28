var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var memoryUtils = require('utils.memory');
var roleUtils = require('utils.role');
var towerFirer = require('towerFirer');

module.exports.loop = function() {
    memoryUtils.clear();

    Memory.home = 'E1N68';
    towerFirer.fire(Memory.home);

    roleUtils.maintain('builder', 4);
    roleUtils.maintain('harvester', 3);

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
