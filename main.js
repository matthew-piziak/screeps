var config = require('config');
var memoryUtils = require('utils.memory');
var roadUtils = require('utils.road');
var roleBuilder = require('role.builder');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleRecon = require('role.recon');
var roleUniversal = require('role.universal');
var roleUtils = require('utils.role');
var sandbox = require('sandbox');
var towerFirer = require('towerFirer');

module.exports.loop = function() {
    memoryUtils.clear();

    Memory.home = 'E1N68';
    towerFirer.fire(Memory.home);

    roleUtils.maintain('builder', config.NUM_BUILDERS);
    roleUtils.maintain('harvester', config.NUM_HARVESTERS);
    roleUtils.maintain('recon', config.NUM_RECON);
    roleUtils.maintain('upgrader', config.NUM_UPGRADERS);

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        roleUniversal.run(creep);
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'recon') {
            roleRecon.run(creep);
        }
    }

    var linkFrom = Game.spawns['Hejmo'].room.lookForAt('structure', 33, 46)[0];
    var linkTo = Game.spawns['Hejmo'].room.lookForAt('structure', 44, 29)[0];
    linkFrom.transferEnergy(linkTo);
};
