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
define(["underscore", "leaflet", "core"], function (_, L, core) {
		return L.Class.extend({

			initialize: function (name, type) {
				this.name = name;
				this.type = type;
				this.LOG_TAG = "[LB " + this.name + "] ";
			},

			_processDataProvider: function (dataProvider) {
				var loadedDatasets = dataProvider.getLoadedDatasetsNames();
				log.info(this.LOG_TAG,
						"Processing data provider '" + dataProvider.name + "' with datasets: " + loadedDatasets);
				_.each(loadedDatasets, function (datasetName) {
					this.createLayer(dataProvider, datasetName);
				}, this);
			},

			buildLayers: function () {
				var dataProviders = core.getDataProvidersForType(this.type);
				log.info(this.LOG_TAG, "Identified matching type data providers: ", dataProviders);
				_.each(dataProviders, this._processDataProvider, this);
			},

			/**
			 * Create a new layer instance that corresponds to the provided data provider and dataset name.
			 *
			 * @param {DataProvider} dataProvider - the data provider for which to create the layer
			 * @param {string} datasetName - the name of the dataset for which to create the layer
			 */
			createLayer: undefined
		});
	}
)
;
