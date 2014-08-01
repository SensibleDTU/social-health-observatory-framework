define([ './LatLon' ], function (LatLon) {

	function travel(origin, xSteps, ySteps, stepSize) {
		if (xSteps !== 0)
			origin = origin.destinationPoint(LatLon.EAST, xSteps * stepSize);
		if (ySteps !== 0)
			origin = origin.destinationPoint(LatLon.NORTH, ySteps * stepSize);
		return origin;
	}

	return {
		travel: travel,
		generate: function (startLatitude, startLongitude, stepSize, maxRadius) {
			var curRadius = 1;
			var xDir = 1;
			var yDir = 0;
			var x = -1, y = 1;
			var vals = [];
			var MAX_RADIUS = maxRadius || 2;
			var STEP_SIZE = stepSize || 0.5;
			var origin = new LatLon(startLatitude, startLongitude);
			var point = travel(origin, x, y, STEP_SIZE);

			while (curRadius <= MAX_RADIUS) {
				x += xDir;
				y += yDir;
				point = travel(point, xDir, yDir, STEP_SIZE);
				vals.push(point);

				if (xDir == 1 && x >= curRadius) {
					xDir = 0;
					yDir = -1;
				} else if (yDir == -1 && y <= -curRadius) {
					xDir = -1;
					yDir = 0;
				} else if (xDir == -1 && x <= -curRadius) {
					xDir = 0;
					yDir = 1;
				} else if (yDir == 1 && y >= curRadius) {
					curRadius++;
					x = -curRadius;
					y = curRadius;
					point = travel(origin, x, y, STEP_SIZE);
					xDir = 1;
					yDir = 0;
				}
			}
			return vals;
		}
	};
});
