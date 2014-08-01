requirejs.config({
	baseUrl: 'static/js',
	// urlArgs : "bust=" + (new Date()).getTime(),
	paths: {
		'jquery': ["/bower_components/jquery/dist/jquery.min",
		           "https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min"],
		'knockout': ["/bower_components/knockoutjs/dist/knockout",
		             "//cdnjs.cloudflare.com/ajax/libs/knockout/3.1.0/knockout-min"],
		'bootstrap': ["/bower_components/bootstrap/dist/js/bootstrap.min",
		              "//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min"],
		'underscore': ["/bower_components/underscore/underscore",
		               "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js"],
		'leaflet': ["/bower_components/leaflet/dist/leaflet", "//cdn.leafletjs.com/leaflet-0.7.3/leaflet"],
		'ko-amd': "/bower_components/knockout-amd-helpers/build/knockout-amd-helpers.min",
		'slider': "/bower_components/seiyria-bootstrap-slider/dist/bootstrap-slider.min",
		'text': "/bower_components/requirejs-text/text",
		'json': "/bower_components/requirejs-json/json",
		'fileSaver': "/bower_components/file-saver/FileSaver",
		'markercluster': "/bower_components/leaflet.markercluster/dist/leaflet.markercluster",
		'loglevel': "/bower_components/loglevel/dist/loglevel.min",
		'jquery-numeric': '/bower_components/jquery-numeric/dist/jquery-numeric',
		'tagsinput': "lib/bootstrap-tagsinput.min",
		'koObsDict': "lib/ko.observableDictionary",
		'core': 'core',
		'leaflet-heat': 'lib/leaflet-heat'
	},
	shim: {
		"jquery-numeric": {
			deps: ["jquery"],
			exports: "$.fn.numeric"
		},
		"bootstrap": {
			deps: ["jquery"],
			exports: "$.fn.modal"
		},
		"slider": {
			deps: ["jquery", "bootstrap"],
			exports: "$.fn.slider"
		},
		"markercluster": {
			deps: ["leaflet"],
			exports: "L.MarkerClusterGroup"
		},
		"leaflet-heat": {
			deps: ["leaflet"],
			exports: "L.HeatLayer"
		},
		"tagsinput": {
			deps: ["jquery", "bootstrap"],
			exports: "$.fn.tagsinput"
		}
	}
});
