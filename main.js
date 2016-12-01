var config = require('config');
var memoryUtils = require('utils.memory');
var roadUtils = require('utils.road');
var roleBuilder = require('role.builder');
var roleHarvester = require('role.harvester');
var roleUniversal = require('role.universal');
var roleUtils = require('utils.role');
var dispatcher = require('dispatcher');
var towerFirer = require('towerFirer');

module.exports.loop = function() {
    memoryUtils.clear();

    var mainSpawn = Game.spawns['Hejmo'];
    var mainController = mainSpawn.room.controller;
    if ((mainSpawn.hits < (mainSpawn.maxHits / 2)) && mainController.safeModeAvailable) {
	mainController.activateSafeMode();
    }

    // config.TARGET_ROOMS.forEach((roomName) => {
    //     towerFirer.fire(Memory.roomName);
    // });

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

    var linkFrom = Game.spawns['Hejmo'].room.lookForAt('structure', 33, 46)[0];
    var linkTo = Game.spawns['Hejmo'].room.lookForAt('structure', 44, 29)[0];
    if (linkFrom && linkTo) {
        linkFrom.transferEnergy(linkTo);
    }
};
