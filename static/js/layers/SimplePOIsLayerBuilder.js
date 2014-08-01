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
define([ 'leaflet', 'underscore', 'core', 'layers/AbstractLayersBuilder', 'layers/AbstractLayer', 'model/LayerGroup',
         'markercluster' ],
	function (L, _, core, AbstractLayersBuilder, AbstractLayer, LayerGroup) {
		var SimplePOIsLayer = AbstractLayer.extend({

			initialize: function (dataProvider, datasetName) {
				AbstractLayer.prototype.initialize.call(this, "layer_static_pois_" + datasetName, "Places of Interest Markers Layer",
					dataProvider);

				this.datasetName = datasetName;
				this._pois = [];
				this._markersGroup = new L.MarkerClusterGroup({
					maxClusterRadius: 40
				});

				_.bindAll(this, "_loadData");

				dataProvider.addDataChangedListener(datasetName, this._loadData);
				this._loadData();
			},

			getName: function () {
				if (this.dataset != undefined)
					return this.name + " - " + this.dataset.name;
				else
					return this.name + " - " + this.datasetName;
			},

			_loadData: function () {
				this.dataset = this.dataProvider.getDataset(this.datasetName);
				log.debug(this.LOG_TAG + "Loaded new data from provider: ", this.dataset);
				if (this.dataset === undefined)
					return;
				var pois = this.dataset.getPoints();
				// Prepare the markers
				var markers = [];
				for (var i = 0; i < pois.length; i++)
					markers.push(pois[i].createMarker());
				this._markersGroup.addLayers(markers);
			},

			enable: function () {
				core.map.addLayer(this._markersGroup);
			},

			disable: function () {
				core.map.removeLayer(this._markersGroup);
			}
		});

		return AbstractLayersBuilder.extend({
			initialize: function () {
				AbstractLayersBuilder.prototype.initialize.call(this, "Places of Interest Markers Layer", core.DATA_TYPE.POIS);

				this.group = core.registerLayerGroup("Places of Interest Markers Layers", LayerGroup.TYPE.MULTI_SELECTION);
			},

			/**
			 * Create a new layer instance that corresponds to the provided data provider and dataset name.
			 *
			 * @param {DataProvider} dataProvider - the data provider for which to create the layer
			 * @param {string} datasetName - the name of the dataset for which to create the layer
			 */
			createLayer: function (dataProvider, datasetName) {
				this.group.layers.push(new SimplePOIsLayer(dataProvider, datasetName));
			}
		});
	});