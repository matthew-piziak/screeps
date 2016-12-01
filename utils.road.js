var roadUtils = {
    next_road_to_decay: function() {
        var roads = Game.rooms['E1N68'].find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_ROAD;
            }
        });
        let lowest_health = 5000;
        let worst_road = null;
        console.log(roads);
        roads.forEach((road) => {
            if (road.hits < lowest_health) {
                lowest_health = road.hits;
                worst_road = road;
            }
        });
        return worst_road;
    },

    make_road_if_useful: function(creep) {
        var structures = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos);
        if (structures.length == 0) {
            var constructionSites = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos);
            if (constructionSites.length == 0) {
                var ticksOnLand;
                var roadCost;
                var terrain = creep.room.lookForAt(LOOK_TERRAIN, creep.pos);
                if (terrain == "swamp") {
                    ticksOnLand = 4;
                    roadCost = 1500;
                }
                if (terrain == "plain") {
                    ticksOnLand = 2;
                    roadCost = 300;
                }
                var carryCapacity = creep.carryCapacity;
                var roadLifetime = 50000;
                var touched_twice_road_breakeven = (roadLifetime / (roadCost / carryCapacity)) * (ticksOnLand / 2);

                var tileFlags = creep.room.lookForAt(LOOK_FLAGS, creep.pos);
                var flag;
                if (tileFlags.length > 0) {
                    flag = tileFlags[0];
                    var delta = Game.time - flag.memory.lastTimeTouched;
                    if (delta > ticksOnLand && delta < touched_twice_road_breakeven) {
                        flag.remove();
                        Game.rooms[creep.pos.roomName].createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
                    }
                    flag.memory.lastTimeTouched = Game.time;
                } else {
                    var newFlagName = creep.room.createFlag(creep.pos);
                    flag = Game.flags[newFlagName];
                    flag.memory.lastTimeTouched = Game.time;
                }
            }
        }
    }
};

module.exports = roadUtils;
