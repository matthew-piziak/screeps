var config = require('config');
var _ = require('lodash');

var sandbox = {
    get_dispatched_source: function(creep) {
        var rooms = config.TARGET_ROOMS;
        var energySources = [];
        rooms.forEach((r) => {
            if (Game.rooms[r]) {
                var sources = Game.rooms[r].find(FIND_SOURCES);
                sources = _.filter(sources, (s) => {
                    return (s.energy != 0);
                });
                sources = _.filter(sources, function(source) {
                    return emptySpaces(r, source.pos) > 0;
                });
                energySources = energySources.concat(sources);
            }
        });
        var closest_in_room = creep.pos.findClosestByRange(energySources);
        if (closest_in_room) {
            return closest_in_room;
        } else {
            return energySources[0];
        }
    }
};

var emptySpaces = function(room, position) {
    var spaces = 0;
    var tiles = Game.rooms[room].lookAtArea(0, 0, 49, 49);
    for (var x = position.x - 1; x < position.x + 1; x++)
        for (var y = position.y - 1; y < position.y + 1; y++)
            if (isPassable(tiles[y][x])) {
                spaces++;
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


module.exports = sandbox;
