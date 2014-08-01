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
define([ 'leaflet', 'knockout', 'underscore', 'core', 'layers/AbstractLayersBuilder', 'layers/SectorsLayer',
         'util/ColorBrewer', 'model/LayerGroup', 'util/ko-extenders' ],
	function (L, ko, _, core, AbstractLayersBuilder, SectorsLayer, ColorBrewer, LayerGroup) {

		var SectorsValueLayer = SectorsLayer.extend({

			initialize: function (dataProvider, datasetName) {
				SectorsLayer.prototype.initialize.call(this, "layer_sector_value_" + datasetName, "Sectors Value Layer",
					dataProvider);
				this._colorBrewer = new ColorBrewer({
					minValue: 0,
					maxValue: 10
				});
				this._initializeMinMaxValueObservables();

				_.bindAll(this, 'getFillColor', 'addInfoBoxData', '_loadData');


				this.datasetName = datasetName;
				// Make sure we load a dataset now (even if it's empty) so we can get the pretty name of the data for
				// the 'getName()' function which will be called when the layer gets added to the UI
				this._dataset = dataProvider.getDataset(this.datasetName);

				dataProvider.addDataChangedListener(datasetName, this._loadData);
			},

			_initializeMinMaxValueObservables: function () {
				// Extend the observables so they never get to an illegal state
				this.minSectorValue = ko.observable(0).extend({maxValue: this._colorBrewer.getMaxValue});
				this.maxSectorValue = ko.observable(10).extend({minValue: this._colorBrewer.getMinValue});

				// Subscribe to any change in the minValue so that we update the value in ColorBrewer
				this.minSectorValue.subscribe(function (newValue) {
					this._colorBrewer.setOptions({minValue: Number(newValue)})
					log.debug(this.LOG_TAG + "Color Brewer min changed to: " + newValue);
					this.redraw();
				}, this);

				// Subscribe to any change in the maxValue so that we update the value in ColorBrewer
				this.maxSectorValue.subscribe(function (newValue) {
					this._colorBrewer.setOptions({maxValue: Number(newValue)})
					log.debug(this.LOG_TAG + "Color Brewer max changed to: " + newValue);
					this.redraw();
				}, this);
			},

			getName: function () {
				if (this._dataset != undefined)
					return this.name + " - " + this._dataset.name;
				else
					return this.name + " - " + this.datasetName;
			},

			_loadData: function () {
				this._dataset = this.dataProvider.getDataset(this.datasetName);
				log.debug(this.LOG_TAG + "Loaded data from provider: ", this._dataset);
				this.maxSectorValue(this._dataset.getMaxValue());
//				this._colorBrewer.setOptions({
//					maxValue: this.maxSectorValue()
//				});
				this._initSectorsData();
			},

			addInfoBoxData: function (feature) {
				core.infoBoxModel.name(feature['properties']['name']);
				core.infoBoxModel.properties.set("ID", feature['id']);
				core.infoBoxModel.properties.set("Area", feature['properties']['surface_area']+" km2");
				var value = this._dataset.getSectorValue(feature['id']);
				value = value || 0;
				core.infoBoxModel.properties.set(this._dataset.name, value);
			},

			clearInfoBoxData: function (feature) {
				core.infoBoxModel.name(undefined);
				// core.infoBoxModel.properties.remove("ID");
				// core.infoBoxModel.properties.remove("PostNumber");
				// core.infoBoxModel.properties.remove("Count");
				core.infoBoxModel.properties.removeAll();
			},

			getFillColor: function (feature) {

				var value = this._dataset.getSectorValue(feature['id']);
				value = value || 0;
				return this._colorBrewer.getColor(value);
			},
			/**
			 * Method that needs to be implemented in order to save any configuration for exporting.
			 */
			exportConfig: function (layerConfig) {
				layerConfig.minSectorValue = this.minSectorValue();
				layerConfig.maxSectorValue = this.maxSectorValue();
			},
			/**
			 * Method that needs to be implemented in order to import any configuration previously exported.
			 */
			importConfig: function (layerConfig) {
				if (layerConfig.minSectorValue)
					this.minSectorValue(layerConfig.minSectorValue);
				if (layerConfig.maxSectorValue)
					this.maxSectorValue(layerConfig.maxSectorValue);
				this.redraw();
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
					templateName: "settingsPanelSectorValueLayer",
					title: "Sector Values Layer Settings",
					minValue: layer.minSectorValue,
					maxValue: layer.maxSectorValue
				};
			}
		});

		return AbstractLayersBuilder.extend({
			initialize: function () {
				AbstractLayersBuilder.prototype.initialize.call(this, "Simple Sectors Value Layer Builder",
					core.DATA_TYPE.SECTOR_VALUE);

				this.group = core.registerLayerGroup("Sectors Value Layers", LayerGroup.TYPE.MULTI_SELECTION);
			},

			/**
			 * Create a new layer instance that corresponds to the provided data provider and dataset name.
			 *
			 * @param {DataProvider} dataProvider - the data provider for which to create the layer
			 * @param {string} datasetName - the name of the dataset for which to create the layer
			 */
			createLayer: function (dataProvider, datasetName) {
				this.group.layers.push(new SectorsValueLayer(dataProvider, datasetName));
			}
		});
	})
;