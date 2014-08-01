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
define([ 'leaflet', 'knockout', 'underscore', 'core', 'layers/AbstractLayersBuilder', 'layers/AbstractLayer',
         'model/LayerGroup', 'leaflet-heat', 'slider', 'view/koBootstrapSliderBinding' ],
	function (L, ko, _, core, AbstractLayersBuilder, AbstractLayer, LayerGroup) {

		var HeatmapLayer = AbstractLayer.extend({

			initialize: function (dataProvider, datasetName) {
				AbstractLayer.prototype.initialize.call(this, "layer_heatmap_" + datasetName, "Heatmap Layer",
					dataProvider);

				this.datasetName = datasetName;
				this._heatmapLayer = L.heatLayer([], {maxZoom: 12, radius: 30, blur: 35});

				this._initializeSettingsObservables();

				_.bindAll(this, "_loadData");

				dataProvider.addDataChangedListener(datasetName, this._loadData);
				this._loadData();
			},

			_initializeSettingsObservables: function () {
				// Extend the observables so they never get to an illegal state
				this.blur = ko.observable(35);
				this.radius = ko.observable(30);

				// Subscribe to any change in the blur so that we update the value in the Heatmap Layer
				this.blur.subscribe(function (newValue) {
					this._heatmapLayer.setOptions({blur: Number(newValue)})
					log.debug(this.LOG_TAG + "Heatmap 'blur' changed to: " + newValue);
				}, this);

				// Subscribe to any change in the blur so that we update the value in the Heatmap Layer
				this.radius.subscribe(function (newValue) {
					this._heatmapLayer.setOptions({radius: Number(newValue)})
					log.debug(this.LOG_TAG + "Heatmap 'radius' changed to: " + newValue);
				}, this);
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
				// Prepare the heatmap data
				var data = _.map(this.dataset.getPoints(), function (poi) {
					return L.latLng(poi.lat, poi.lon);
				});
				this._heatmapLayer.setLatLngs(data);
			},

			enable: function () {
				core.map.addLayer(this._heatmapLayer);
			},

			disable: function () {
				core.map.removeLayer(this._heatmapLayer);
			},

			/**
			 * Method that needs to be implemented in order to save any configuration for exporting.
			 */
			exportConfig: function (layerConfig) {
				layerConfig.blur = this.blur();
				layerConfig.radius = this.radius();
			},

			/**
			 * Method that needs to be implemented in order to import any configuration previously exported.
			 */
			importConfig: function (layerConfig) {
				if (layerConfig.blur)
					this.blur(layerConfig.blur);
				if (layerConfig.radius)
					this.radius(layerConfig.radius);
			},

			/**
			 * Defines whether this layer has a settings panel. The settings panel template is defined by the
			 * #getSettingsViewModel() function.
			 */
			hasSettings: true,

			/**
			 * Returns the template name for the settings panel. This is only used only if the hasSettings value is true.
			 */
			getSettingsViewModel: function () {
				var layer = this;
				return {
					templateName: "settingsPanelHeatmapLayer",
					title: "Heatmap Layer Settings",
					radius: layer.radius,
					blur: layer.blur
				};
			}
		});

		return AbstractLayersBuilder.extend({
			initialize: function () {
				AbstractLayersBuilder.prototype.initialize.call(this, "Heatmap Layer", core.DATA_TYPE.POIS);

				this.group = core.registerLayerGroup("Heatmap Layers", LayerGroup.TYPE.MULTI_SELECTION);
			},

			/**
			 * Create a new layer instance that corresponds to the provided data provider and dataset name.
			 *
			 * @param {DataProvider} dataProvider - the data provider for which to create the layer
			 * @param {string} datasetName - the name of the dataset for which to create the layer
			 */
			createLayer: function (dataProvider, datasetName) {
				this.group.layers.push(new HeatmapLayer(dataProvider, datasetName));
			}
		});
	});