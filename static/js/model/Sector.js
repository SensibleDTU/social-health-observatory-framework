define([ 'leaflet', 'util/LatLon' ], function (L, LatLon) {
	/**
	 * Defines a square Sector to be used during visualizations.
	 *
	 * @param centerLat - the latitude of the center
	 * @param centerLng - the longitude of the center
	 * @param sideSize - the size of the side
	 */
	function Sector(centerLat, centerLng, sideSize) {
		var self = this;
		_init(centerLat, centerLng, sideSize);

		function _init(centerLat, centerLng, sideSize) {
			var radius = Math.sqrt(2) * sideSize;
			self.center = new LatLon(centerLat, centerLng);
			var nw = self.center.destinationPoint(LatLon.NORTH_WEST, radius);
			var se = self.center.destinationPoint(LatLon.SOUTH_EAST, radius);
			self.bounds = L.latLngBounds([ se.lat(), nw.lon() ], [ nw.lat(), se.lon() ]);
		}

		self.getPolygonBounds = function () {
			return [ self.bounds.getNorthWest(), self.bounds.getNorthEast(), self.bounds.getSouthEast(),
				self.bounds.getSouthWest() ];
		};
	}

	// return the constructor function so it can be used by other modules.
	return Sector;
});