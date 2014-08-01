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
define(["./AbstractLayer", 'leaflet', 'underscore', 'core'], function (AbstractLayer, L, _, core) {

	return AbstractLayer.extend({

		initialize: function (id, name, dataProvider) {
			AbstractLayer.prototype.initialize.call(this, id, name, dataProvider);

			_.bindAll(this, 'getStyle', 'onSectorMouseOut', 'onSectorMouseIn', 'redraw');
		},

		_initSectorsData: function () {
			var self = this;
			// If this layer is already shown, remove it first before resetting the new sectors data
			if (this._sectorPolygonsGroup)
				core.map.removeLayer(this._sectorPolygonsGroup);

			self._sectorPolygonsGroup = L.geoJson(core.sectors.geojson(), {
				style: self.getStyle,
				onEachFeature: function (feature, layer) {
					layer.on({
						mouseover: self.onSectorMouseIn,
						mouseout: self.onSectorMouseOut,
						click: self.zoomToFeature
					});
				}
			});
		},

		getStyle: function (feature) {
			return {
				fillColor: this.getFillColor(feature),
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.5
			};
		},

		onSectorMouseIn: function (e) {
			var layer = e.target;
			this.addInfoBoxData(layer.feature);

			layer.setStyle({
				weight: 3,
				color: '#666',
				dashArray: '',
				fillOpacity: 0.7
			});

			// bring it to the front so that the border doesn’t clash with nearby states
			// (but not for IE or Opera, since they have problems doing bringToFront on
			// mouseover).
			if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
			}
		},

		onSectorMouseOut: function (e) {
			var layer = e.target;
			this.clearInfoBoxData(layer.feature);

			this._sectorPolygonsGroup.resetStyle(layer);
		},

		zoomToFeature: function (e) {
			core.map.fitBounds(e.target.getBounds());
		},

		redraw: function () {
			var self = this;
			if (this._sectorPolygonsGroup)
				_.each(this._sectorPolygonsGroup._layers, function (layer) {
					self._sectorPolygonsGroup.resetStyle(layer);
				});
		},

		addInfoBoxData: undefined,

		clearInfoBoxData: function (feature) {
			core.infoBoxModel.name(undefined);
			core.infoBoxModel.properties.removeAll();
		},

		getFillColor: undefined,

		enable: function () {
			core.map.addLayer(this._sectorPolygonsGroup);
		},

		disable: function () {
			core.map.removeLayer(this._sectorPolygonsGroup);
		}
	});
});
