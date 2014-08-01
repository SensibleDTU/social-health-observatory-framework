define([ 'leaflet', 'core' ], function (L, core) {
	function markerMouseIn(e) {
		var poi = e.target.poi;
		core.infoBoxModel.name(poi.name);
		for (property in poi.details) {
			core.infoBoxModel.properties.set(property, poi.details[property]);
		}
	}

	function markerMouseOut(e) {
		core.infoBoxModel.clear();
	}

	function PointOfInterest(id, name, lat, lon, type, details, icon) {
		this.id = id;
		this.name = name;
		this.lat = lat;
		this.lon = lon;
		this.type = type;
		this.details = details || {};
		this.icon = icon;

		this.createMarker = function () {
			var m = L.marker([ this.lat, this.lon ], {riseOnHover: true});
			if (this.icon) {
				var icon = L.icon({
					iconUrl: this.icon,
					iconSize: [ 32, 32 ]
				});
				m.setIcon(icon);
			}
			m.poi = this;
			m.on('mouseover', markerMouseIn);
			m.on('mouseout', markerMouseOut);
			return m;
		};
	}

	// return the constructor function so it can be used by other modules.
	return PointOfInterest;
});