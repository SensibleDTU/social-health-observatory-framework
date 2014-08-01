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
define(["underscore", "leaflet"], function (_, L) {
	return L.Class.extend({
		initialize: function (name, type) {
			assert(name !== undefined, "Data provider name needs to be defined.");
			assert(type !== undefined, "Data provider type needs to be defined.");
			this.name = name;
			this.type = type;
			this.LOG_TAG = "[DP " + this.name + "] ";
			this._listeners = {};
		},
		addDataChangedListener: function (datasetName, listenerCallback) {
			if (!(_.contains(this.getLoadedDatasetsNames(), datasetName))) {
				log.error(this.LOG_TAG + "Cannot register listener on unsupported dataset " + datasetName);
				return;
			}
			var listeners = this._listeners[datasetName];
			// If there are no listeners for the provided dataset yet, initialize a new list
			if (listeners === undefined) {
				listeners = [];
				listeners.push(listenerCallback);
				this._listeners[datasetName] = listeners;
			}
			else {
				// Add the listener to the listeners for the provided dataset, if not there already
				if (!(_.contains(listeners, listenerCallback)))
					listeners.push(listenerCallback);
			}
			log.debug(this.LOG_TAG + "Added new listener ", this._listeners);
		},
		removeDataChangedListener: function (datasetName, listenerCallback) {
			var listeners = this._listeners[datasetName];
			if (listeners !== undefined)
				this._listeners[datasetName] = _.without(listeners, listenerCallback);
		},
		notifyDataChanged: function (dataset) {
			assert(_.contains(this.getLoadedDatasetsNames(), dataset),
					"Notifying data changed for unsupported dataset: " + dataset);
			log.debug(this.LOG_TAG + "Notifying data changed for dataset: " + dataset);
			var listeners = this._listeners[dataset];
			if (listeners !== undefined)
				for (var i = 0; i < listeners.length; i++) {
					listeners[i](dataset);
				}
		},
		providesTimeSeries: function () {
			// NOTE: Should be overridden in implementing classes if provides time series data
			return false;
		},

		/**
		 * Returns the names of the datasets loaded by this data provider.
		 *
		 * Should be overridden in implementing classes.
		 */
		getLoadedDatasetsNames: undefined,


		/**
		 * Returns the dataset loaded by this data provider, for the given dataset name. If there is no data for the
		 * given dataset name or if the data hasn't been loaded yet, returns undefined.
		 *
		 * Should be overridden in implementing classes.
		 * @param {string} datasetName - the name of the dataset for which to get the data
		 */
		getDataset: undefined
	});
});
