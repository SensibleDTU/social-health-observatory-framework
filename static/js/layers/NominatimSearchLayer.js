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
define([ 'leaflet', 'core', 'util/nominatimApi', './AbstractLayer', 'markercluster' ],
	function (L, core, nominatimApi, AbstractLayer) {
		var NominatimSearchLayer = AbstractLayer.extend({

			initialize: function () {
				AbstractLayer.prototype.initialize.call(this, "Nominatim Search Layer");

				this.resultsGroup = new L.MarkerClusterGroup({
					maxClusterRadius: 40
				});
			},

			enable: function () {
				core.map.addLayer(this.resultsGroup);

				// Create control
				this.searchControl = L.control({
					position: 'topleft'
				});

				var self = this;
				this.searchControl.onAdd = function (map) {
					this._div = L.DomUtil.create('form', 'mapquest-search-control');
					this._input = L.DomUtil.create('input', 'form-control', this._div);
					this._input.type = "text";
					this._input.placeholder = "Search...";

					L.DomEvent.addListener(this._div, 'submit', function (event) {
						L.DomEvent.preventDefault(event);
						self.performSearch(self, this._input.value);
					}, this);
					return this._div;
				};
				this.searchControl.addTo(core.map);
			},

			performSearch: function (self, query) {
				log.info("Performing search for query: " + query);
				self.resultsGroup.clearLayers();
				var bounds = core.map.getBounds();
				nominatimApi.search(query, {
					bounds: {
						left: bounds.getWest(),
						top: bounds.getNorth(),
						right: bounds.getEast(),
						bottom: bounds.getSouth()
					},
					bounded: 1,
					limit: 30,
					addressdetails: 1
				}, function (pois) {
					var markers = [];
					for (var i = 0; i < pois.length; i++) {
						markers.push(pois[i].createMarker());
					}
					self.resultsGroup.addLayers(markers);
				});
			},

			disable: function () {
				if (this.searchControl)
					this.searchControl.removeFrom(core.map);
				core.map.removeLayer(this.resultsGroup);
			}
		});

		return NominatimSearchLayer;

	});