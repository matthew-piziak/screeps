var roadUtils = require('utils.road');

var roleUniversal = {
    run: function(creep) {
	roadUtils.make_road_if_useful(creep);
    }
};

module.exports = roleUniversal;
