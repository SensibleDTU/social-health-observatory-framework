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
define([ 'leaflet', 'underscore', 'core', 'layers/AbstractLayersBuilder', 'layers/AbstractLayer',
         'util/InterpolationLayer', 'model/LayerGroup'],
	function (L, _, core, AbstractLayersBuilder, AbstractLayer, InterpolationLayer, LayerGroup) {

		var SampleValuesLayer = AbstractLayer.extend({

			initialize: function (dataProvider, datasetName) {
				AbstractLayer.prototype.initialize.call(this, "layer_sample_values_" + datasetName,
					"Sample Values Layer", dataProvider);

				this.datasetName = datasetName;
				this._dataLayer = new InterpolationLayer({
					opacity: 0.85,
					quadSize: 16,
					minRange: 0,
					maxRange: 14,
					colors: ['blue', 'orange'],
					weightingExponent: 2
				});
				// Make sure we load a dataset now (even if it's empty) so we can get the pretty name of the data for
				// the 'getName()' function which will be called when the layer gets added to the UI
				this.dataset = dataProvider.getDataset(datasetName);


				_.bindAll(this, "_loadData");

				dataProvider.addDataChangedListener(datasetName, this._loadData);

			},

			getName: function () {
				if (this.dataset != undefined)
					return this.name + " - " + this.dataset.name;
				else
					return this.name + " - " + this.datasetName;
			},

			_loadData: function () {
				this.dataset = this.dataProvider.getDataset(this.datasetName);
				log.debug(this.LOG_TAG + "Loaded new data from provider for '" + this.datasetName + "': ",
					this.dataset);
				if (this.dataset === undefined)
					return;

				// Prepare the weather stations markers
				var samplePoints = this.dataset.getSamplePoints();
				log.debug("Sample points", samplePoints);
				var markers = _.map(samplePoints, function (samplePoint) {
					return samplePoint.createMarker();
				});
				log.debug("Created markers", markers);

				// Make sure we clean anything that is already on the map
				if (this._markersGroup)
					core.map.removeLayer(this._markersGroup);
				this._markersGroup = L.layerGroup(markers);

				// Prepare the weather data
				this._dataLayer.setData(this.dataset.getSamplePoints());
			},
			enable: function () {
				core.map.addLayer(this._markersGroup);
				core.map.addLayer(this._dataLayer);
			},
			disable: function () {
				core.map.removeLayer(this._markersGroup);
				core.map.removeLayer(this._dataLayer);
			}
		});

		return AbstractLayersBuilder.extend({
			initialize: function () {
				AbstractLayersBuilder.prototype.initialize.call(this, "Sample Values Layer",
					core.DATA_TYPE.SAMPLE_POINTS_VALUES);

				this.group = core.registerLayerGroup("Sample Values Layers", LayerGroup.TYPE.MULTI_SELECTION);
			},

			/**
			 * Create a new layer instance that corresponds to the provided data provider and dataset name.
			 *
			 * @param {DataProvider} dataProvider - the data provider for which to create the layer
			 * @param {string} datasetName - the name of the dataset for which to create the layer
			 */
			createLayer: function (dataProvider, datasetName) {
				this.group.layers.push(new SampleValuesLayer(dataProvider, datasetName));
			}
		});
	});