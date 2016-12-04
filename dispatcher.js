var config = require('config');
var _ = require('lodash');

var dispatcher = {
    getDispatchedLocalSource: function(creep) {
        let localRoom = creep.room;
        let localSources = _.filter(localRoom.find(FIND_SOURCES), (s) => {
            return isAvailableSource(s, localRoom, creep);
        });
	if (localSources.length == 0) {
	    return localSources[0];
	} else {
	    return creep.pos.findClosestByPath(localSources);
	}
    },

    getDispatchedExit: function(creep) {
	var exitDir = Game.map.findExit(creep.room, 'W13N69');
	var exitLoc = creep.pos.findClosestByRange(exitDir);
	return exitLoc;
    }
};

var isAvailableSource = function(source, room, creep) {
    return (source.energy != 0) && (emptySpaces(room, source.pos, creep.pos) > 0);
};

var emptySpaces = function(room, sourcePos, creepPos) {
    var spaces = 0;
    var tiles = room.lookAtArea(0, 0, 49, 49);
    for (var x = sourcePos.x - 1; x <= sourcePos.x + 1; x++)
        for (var y = sourcePos.y - 1; y <= sourcePos.y + 1; y++) {
            if (creepPos.x == x && creepPos.y == y) {
                spaces++;
                continue;
            }
            if (isPassable(tiles[y][x])) {
                spaces++;
            }
        }
    return spaces;
};

var isPassable = function(list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].type === "terrain" && (
                list[i].terrain === "wall" || list[i].terrain === "lava"
            ))
            return false;

        if (list[i].type === "structure") {
            switch (list[i].structure.structureType) {
                case STRUCTURE_CONTROLLER:
                case STRUCTURE_EXTENSION:
                case STRUCTURE_KEEPER_LAIR:
                case STRUCTURE_LINK:
                case STRUCTURE_PORTAL:
                case STRUCTURE_WALL:
                case STRUCTURE_STORAGE:
                case STRUCTURE_SPAWN:
                    return false;
                case STRUCTURE_RAMPART:
                    return list[i].structure.my;
                case STRUCTURE_ROAD:
                    return true;
                default:
                    throw Error('Unknown structure type ' + list[i].structure.structureType);
            }
        }
        if (list[i].type === "creep") {
            return false;
        }
    }
    return true;
};


module.exports = dispatcher;
