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
define([ 'jquery', 'leaflet', 'knockout', 'underscore', 'core', 'layers/AbstractLayersBuilder', 'layers/SectorsLayer',
         'util/ColorBrewer', 'model/LayerGroup', 'parsers/multi-data-layer-value-parser', 'koObsDict',
         'jquery-numeric', 'util/ko-extenders' ],
	function ($, L, ko, _, core, AbstractLayersBuilder, SectorsLayer, ColorBrewer, LayerGroup, parser) {

		var CustomExpressionSectorsValueLayerBuilder = SectorsLayer.extend({

			initialize: function (dataProvider, datasetName) {
				SectorsLayer.prototype.initialize.call(this, "layer_custom_expression",
					"Custom Expression Sectors Value Layer");

				this._colorBrewer = new ColorBrewer({
					minValue: 0,
					maxValue: 10,
					scheme: "PuRd"
				});

				this._initializeMinMaxValueObservables();

				_.bindAll(this, 'getFillColor', 'addDataset', 'addInfoBoxData', '_loadData', 'getSectorValue',
					'getSettingsViewModel');

				// Setup the parser related fields
				this.expression = "0";
				parser.yy.getSectorValue = this.getSectorValue;
				this._parsedExpression = parser.parse(this.expression);

				// Set up the structures for datasets
				this._datasetsNames = ko.observableArray();
				this._dataProviders = {}; // Mapping between dataset names and data providers
				this._datasets = {}; // Mapping between loaded dataset names and datasets

				// Initialize sectors data
				this._initSectorsData();
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

			addDataset: function (dataProvider, datasetName) {
				this._datasetsNames.push(datasetName);
				this._dataProviders[datasetName] = dataProvider;
				dataProvider.addDataChangedListener(datasetName, this._loadData);
			},

			_loadData: function (datasetName) {
				var dataProvider = this._dataProviders[datasetName];
				assert(dataProvider != null, "Received data for unregistered provider.");
				var dataset = dataProvider.getDataset(datasetName);
				log.debug(this.LOG_TAG + "Loaded data from provider '" + dataProvider.name + "': " + datasetName);
				this._datasets[datasetName] = dataset;
			},

			addInfoBoxData: function (feature) {
				core.infoBoxModel.name(feature['properties']['name']);
				core.infoBoxModel.properties.set("ID", feature['id']);
				core.infoBoxModel.properties.set("Area", feature['properties']['surface_area'] + " km2");
				parser.yy.sectorId = feature['id'];
				var value = this._parsedExpression();
				core.infoBoxModel.properties.set("Computed value", value);
			},

			clearInfoBoxData: function (feature) {
				core.infoBoxModel.name(undefined);
				core.infoBoxModel.properties.removeAll();
			},

			getSectorValue: function (sectorId, datasetName) {
				log.info("Getting data for sector " + sectorId + " and dataset: " + datasetName);
				var dataset = this._datasets[datasetName];
				if (!dataset) {
					throw new Error("There is no dataset for name: " + datasetName);
				}
				// NOTE: If there's no sector data available, assume 0
				var data = dataset.getSectorValue(sectorId);
				return data || 0;
			},

			getFillColor: function (feature) {
				// Store the current sector if in 'parser.yy' as that can be accessed from inside the parse actions
				parser.yy.sectorId = feature['id'];
				if (!parser.yy.sectorId)
					return this._colorBrewer.getColor(0);
				var value = this._parsedExpression();

				//	log.info(this.LOG_TAG + value);
				return this._colorBrewer.getColor(value);
			},
			/**
			 * Method that needs to be implemented in order to save any configuration for exporting.
			 */
			exportConfig: function (layerConfig) {
				layerConfig.minSectorValue = this.minSectorValue();
				layerConfig.maxSectorValue = this.maxSectorValue();
				layerConfig.expression = this.expression;
			},
			/**
			 * Method that needs to be implemented in order to import any configuration previously exported.
			 */
			importConfig: function (layerConfig) {
				if (layerConfig.minSectorValue)
					this.minSectorValue(layerConfig.minSectorValue);
				if (layerConfig.maxSectorValue)
					this.maxSectorValue(layerConfig.maxSectorValue);
				if (layerConfig.expression) {
					this.expression = layerConfig.expression;
					try {
						this._parsedExpression = parser.parse(this.expression);
					}
					catch (e) {
						log.warn(this.LOG_TAG + "An exception occurred while parsing expression", this.expression(),
							e.message);
						this.expression = "0";
						this._parsedExpression = parser.parse(this.expression);
					}
				}
				this.redraw();
			},

			/**
			 * Defines whether this layer has a settings panel. The settings panel template is defined by the
			 * #getSettingsTemplate() function.
			 */
			hasSettings: true,

			/**
			 * Returns the template name for the settings panel. This is only used only if the hasSettings value is true.
			 */
			getSettingsViewModel: function () {
				var layer = this;
				return {
					templateName: "settingsPanelMultiDataLayer",
					title: "Multi Data Layer Settings",
					expression: ko.observable(layer.expression), // copy the existing expression
					error: ko.observable(),
					getLoadedDatasetsNames: ko.computed(function () {
						var datasetsNames = layer._datasetsNames();
						var result = "";
						for (var i = 0; i < datasetsNames.length - 1; i++)
							result += datasetsNames[i] + ", ";
						result += datasetsNames[datasetsNames.length - 1];
						return result;
					}),
					minValue: layer.minSectorValue,
					maxValue: layer.maxSectorValue,
					parseExpression: function () {
						log.debug("Parsing expression: " + this.expression());
						parser.yy.parseError = function parseError(str, hash) {
							throw new Error(str);
						};
						try {
							layer._parsedExpression = parser.parse(this.expression());
							layer.expression = this.expression();
							this.error(undefined);
						}
						catch (e) {
							log.warn("An exception occurred while parsing", this.expression(), e.message);
							this.error(e.message);
							return;
						}
						layer.redraw();
						$(".alert-success").fadeIn().delay(1000).fadeOut();
					}
				};
			}
		});

		return AbstractLayersBuilder.extend({
			initialize: function () {
				AbstractLayersBuilder.prototype.initialize.call(this, "Custom Expression Sectors Value Layer Builder",
					core.DATA_TYPE.SECTOR_VALUE);

				this.group = core.registerLayerGroup("Multi-data Layers", LayerGroup.TYPE.SINGLE_SELECTION);
			},

			/**
			 * Create a new layer instance that corresponds to the provided data provider and dataset name.
			 *
			 * @param {DataProvider} dataProvider - the data provider for which to create the layer
			 * @param {string} datasetName - the name of the dataset for which to create the layer
			 */
			createLayer: function (dataProvider, datasetName) {
				// if there's no existing instance, we initialize it now
				if (!this.layer) {
					this.layer = new CustomExpressionSectorsValueLayerBuilder();
					this.group.layers.push(this.layer);
				}
				this.layer.addDataset(dataProvider, datasetName);
			}
		});
	})
;