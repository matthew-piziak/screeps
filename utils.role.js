var config = require('config');

var roleUtils = {
    maintain: function(role, num_creeps_to_maintain) {
        var creeps_with_role = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        if (creeps_with_role.length < num_creeps_to_maintain) {
            Game.spawns['Hejmo'].createCreep(config.CREEP_RECIPE, undefined, {
                role: role
            });
        }
    }
};

module.exports = roleUtils;
