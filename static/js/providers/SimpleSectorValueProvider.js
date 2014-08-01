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
define(["core", "./AbstractDataProvider", "model/SectorValuesDataSet"],
	function (core, AbstractDataProvider, SectorValuesDataSet) {
		return AbstractDataProvider.extend({
			initialize: function (dataName, prettyDataName, filename) {
				AbstractDataProvider.prototype.initialize.call(this,
						"Simple Sector Value Provider" + " (" + dataName + ")",
					core.DATA_TYPE.SECTOR_VALUE);

				this._datasetName = dataName;
				this._prettyDatasetName = prettyDataName;
				this._dataset = new SectorValuesDataSet(this._datasetName, {}, this._prettyDatasetName);
				this._filename = filename || (this._datasetName + "_sector_value.json");

				this._loadData();
				core.registerDataProvider(core.DATA_TYPE.SECTOR_VALUE, this);
			},

			_loadData: function () {
				// Load the data and get it ready
				var dataUrl = core.config.DATA_URL_BASE + this._filename;
				log.info(this.LOG_TAG + "Loading sector value data from: " + dataUrl);
				var self = this;

				$.getJSON(dataUrl, function (data) {
					log.debug(self.LOG_TAG + "Loaded sector value data: ", data);
					self._dataset = new SectorValuesDataSet(self._datasetName, data, self._prettyDatasetName);
					self.notifyDataChanged(self._datasetName);
				});
			},

			/**
			 * Returns the names of the datasets loaded by this data provider.
			 *
			 */
			getLoadedDatasetsNames: function () {
				return [this._datasetName];
			},

			getDatasetsInfo: function (datasetId) {
				if (datasetId != this._datasetName) {
					log.error(this.LOG_TAG + "Trying to load info for unsupported dataset with name: ", datasetId);
					return {};
				}
				return {id: this._datasetName, name: this._prettyDatasetName, type: this.type};
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
