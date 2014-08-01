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
define(["core", "./AbstractDataProvider", "model/POIsDataSet", "model/PointOfInterest"],
	function (core, AbstractDataProvider, POIsDataSet, PointOfInterest) {

		return  AbstractDataProvider.extend({
			statics: {
				ICON_URL_BASE: "http://open.mapquestapi.com/nominatim/v1/images/mapicons/",
				ICON_URL_POSTFIX: ".p.32.png"
			},

			initialize: function (dataName, iconName, prettyDataName) {
				AbstractDataProvider.prototype.initialize.call(this, "Static POIs Provider" + " (" + dataName + ")",
					core.DATA_TYPE.POIS);
				this._iconUrl = this.constructor.ICON_URL_BASE + iconName + this.constructor.ICON_URL_POSTFIX;

				this._datasetName = dataName;
				this._prettyDatasetName = prettyDataName;
				this._dataset = new POIsDataSet(this._datasetName, [], this._prettyDatasetName);
				this._loadData();
				core.registerDataProvider(core.DATA_TYPE.POIS, this);
			},

			_buildPOIs: function (data) {
				var pois = [];
				for (var i = 0; i < data.length; i++) {
					var el = data[i];
					var poi = new PointOfInterest(el.place_id, el.name, el.lat, el.lon, el.type,
						{'Class': el.class, 'Address': el.address}, this._iconUrl);
					pois.push(poi);
				}
				return pois;
			},

			_loadData: function () {
				// Load the data and get it ready
				var dataUrl = "/static/data/" + this._datasetName + ".json";
				log.info(this.LOG_TAG + "Loading data from " + dataUrl + "...");
				var self = this;

				$.getJSON(dataUrl, function (data) {
					// Parse and build the POIs list
					var pois = self._buildPOIs(data);
					log.debug(self.LOG_TAG + "Loaded POIs:", pois);

					// Create the dataset
					self._dataset = new POIsDataSet(self._datasetName, pois, self._prettyDatasetName);

					// Make sure all the listeners are aware of the data change
					self.notifyDataChanged(self._datasetName);
				});
			},

			getDatasetsInfo: function (datasetId) {
				if (datasetId != this._datasetName) {
					log.error(this.LOG_TAG + "Trying to load info for unsupported dataset with name: ", datasetId);
					return {};
				}
				return {id: this._datasetName, name: this._prettyDatasetName, type: this.type};
			},


			/**
			 * Returns the names of the datasets loaded by this data provider.
			 */
			getLoadedDatasetsNames: function () {
				return [this._datasetName];
			},

			/**
			 * Returns the dataset loaded by this data provider, for the given dataset name. If there is no data for the
			 * given dataset name or if the data hasn't been loaded yet, returns undefined.
			 *
			 * @param {string} datasetName - the name of the dataset for which to get the data
			 */
			getDataset: function (datasetName) {
				if (datasetName == this._datasetName)
					return this._dataset;
				log.error(this.LOG_TAG + "Trying to load unsupported dataset with name: ", datasetName);
				return undefined;
			}
		});
	});