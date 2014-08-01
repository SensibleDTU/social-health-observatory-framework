/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 cosminstefanxp [@] gmail [.] com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
require(['jquery', 'knockout', 'loglevel', 'leaflet', 'core', 'util/lmap', 'LayersManager', 'view/mainViewModel',
         'bootstrap', 'ko-amd'],
	function ($, ko, log, L, core, lmap, LayersManager, mainViewModel) {
		// Make the logger accessible globally
		window.log = log;
		log.enableAll();
		log.info("Setting everything up...");

		// Create a simple assertion function
		window.assert = function (condition, message) {
			if (!condition) {
				throw new Error(message);
			}
		};

		// Set up the Knockout AMD Helpers paths
		ko.amdTemplateEngine.defaultPath = "/templates/js";
		ko.amdTemplateEngine.defaultSuffix = ".tmpl.html";

		$(function () {
			var map = lmap.initMap();
			core.init(map);

			ko.applyBindings(mainViewModel);

			require(['text!/templates/js/templateSectorInfoBox.html'], function (templateSectorInfoBox) {
				var info = L.control();

				info.onAdd = function () {
					this._div = L.DomUtil.create('div');
					this._div.innerHTML = templateSectorInfoBox;
					ko.applyBindings(core.infoBoxModel, this._div);
					return this._div;
				};
				info.addTo(map);
			});

			// Load up the import/export manager
			require(['util/importExportManager']);

			LayersManager.loadProviders();
			LayersManager.loadLayers();
		});

	});
