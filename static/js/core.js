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
define(['knockout', 'underscore', 'util/sectorsProvider', 'model/LayerGroup', "koObsDict"],
	function (ko, _, sectorsProvider, LayerGroup) {
		function InfoBoxModel() {
			this.name = ko.observable();
			this.properties = new ko.observableDictionary();
			this.clear = function () {
				this.name("");
				this.properties.removeAll();
			}
		}

		function DataModel() {
			var self = this;
			var VIEW_MODE = {
				LAYERS: "layers",
				LAYER_SETTINGS: "layer_settings",
				PROVIDERS: "providers",
				PROVIDER_SETTINGS: "provider_settings"
			}
			this.layerGroups = ko.observableArray();
			this.dataProvidersMap = {};
			this.viewMode = ko.observable(VIEW_MODE.LAYERS);
		};

		function Core() {
			var self = this;
			self.config = {
				DATA_URL_BASE: "/static/data/",
				center: {
					lat: 55.718,
					lng: 12.488
				}
			};
			self.DATA_TYPE = {
				POIS: "pois",
				SECTOR_VALUE: "sector_value",
				SAMPLE_POINTS_VALUES: "sample_values"
			};

			self.sectors = sectorsProvider;
			self.dataModel = new DataModel();
			self.infoBoxModel = new InfoBoxModel();
			self.layerGroups = ko.observableArray();
			self.dataProvidersMap = {};
			self.dataProviders = ko.observableArray();

			self.init = function (map) {
				self.map = map;
			};

			/**
			 * Registers a group with the provided name, if it doesn't already exist, or returns the existing one.
			 * @returns {LayerGroup} the registered layer group with the required name.
			 */
			self.registerLayerGroup = function (name, groupType) {
				var group = _.find(self.layerGroups(), function (group) {
					return group.name == name;
				});
				if (!group) {
					group = new LayerGroup(name, groupType);
					self.layerGroups.push(group);
				}
				return group;
			};

			self.unregisterLayerGroup = function (layerGroup) {
				var index = self.layerGroups.indexOf(layerGroup);
				if (index > -1) {
					self.layerGroups.splice(index, 1);
				}
			};

			self.registerDataProvider = function (dataType, provider) {
				var providers = self.dataProvidersMap[dataType];
				if (providers === undefined) {
					providers = [];
					self.dataProvidersMap[dataType] = providers;
				}
				providers.push(provider);
				self.dataProviders.push(provider);
				log.info("Register new data provider for type '" + dataType + "': " + provider.name);
			};

			self.getDataProvidersForType = function (dataType) {
				return self.dataProvidersMap[dataType] || [];
			};
		}

		return new Core();
	});
