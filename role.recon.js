var roleRecon = {
    run: function(creep) {
	var flag = Game.flags['Source Bogey Alfa'];
	creep.moveTo(flag.pos);
    }
};

module.exports = roleRecon;
