var roleUtils = {
    maintain: function(role, num_creeps_to_maintain) {
        var creeps_with_role = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        if (creeps_with_role.length < num_creeps_to_maintain) {
            var newName = Game.spawns['Hejmo'].createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], undefined, {
                role: role
            });
            console.log('Spawning new ' + role + ': ' + newName);
        }
    }
};

module.exports = roleUtils;
