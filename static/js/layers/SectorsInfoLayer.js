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
define(["./SectorsLayer", 'leaflet', 'underscore', 'core'], function (SectorsLayer, L, _, core) {

	var SectorsInfoLayer = SectorsLayer.extend({

		initialize: function () {
			SectorsLayer.prototype.initialize.call(this, "Sectors Layer");

			this._initSectorsData();
		},

		addInfoBoxData: function (feature) {
			core.infoBoxModel.name(feature['properties']['name']);
			core.infoBoxModel.properties.set("ID", feature['id']);
			core.infoBoxModel.properties.set("PostNumber", feature['properties']['details']);
		},

		clearInfoBoxData: function (feature) {
			core.infoBoxModel.name(undefined);
			core.infoBoxModel.properties.remove("ID");
			core.infoBoxModel.properties.remove("PostNumber");
		},

		getFillColor: function (feature) {
			return "#8888dd";
		}
	});

	return SectorsInfoLayer;
});
