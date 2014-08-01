/**
 * The handler of the main map object.
 */
define(
	[ 'leaflet', '../core' ],
	function (L, core) {
		var TILE_CM_1 = "http://{s}.tile.cloudmade.com/ddc2cace218948f5a83c4cc8d575a81e/1714/256/{z}/{x}/{y}.png";
		var TILE_MQ_ROAD = 'http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png';
		var TILE_MQ_SAT = 'http://otile1.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png';
		var TILE_MS_HYB = 'http://openmapsurfer.uni-hd.de/tiles/hybrid/x={x}&y={y}&z={z}';
		var TILE_MS_ROAD = 'http://openmapsurfer.uni-hd.de/tiles/roadsg/x={x}&y={y}&z={z}';
		var TILE_OSM_BW = 'http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png';
		var TILE_MS_ADMIN = 'http://openmapsurfer.uni-hd.de/tiles/adminb/x={x}&y={y}&z={z}';
		var TILE_OSM = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		var TILE_MB_BW = 'http://api.tiles.mapbox.com/v3/cosminstefanxp.hh39a5bd/{z}/{x}/{y}.png';
		var ATTRIBUTION = 'Map data &copy; <a href='
			+ '"http://openstreetmap.org">OpenStreetMap</a> contributors,'
			+ ' <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,'
			+ ' Imagery &copy; <a href="https://www.mapbox.com/about/maps/">MapBox</a>';
		var MAP_DIV_ID = "map";

		function initMap() {
			var map = L.map(MAP_DIV_ID, {
				zoomControl: false
			}).setView(core.config.center, 12);
			L.tileLayer(TILE_MB_BW, {
				attribution: ATTRIBUTION,
				maxZoom: 18
			}).addTo(map);

			return map;
		}

		return {
			initMap: initMap
		};
	});