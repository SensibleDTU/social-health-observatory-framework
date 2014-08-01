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

/**
 * View Model for the Control Panel's Datasets List Section.
 */
define(["knockout", "underscore", "core"], function (ko, _, core) {

	function DataProvidersPanelModel() {
		var self = this;
		this.templateName = "datasetsPanel";
		this.datasets = ko.computed(function () {
			var datasets = ko.observableArray();
			_.each(core.dataProviders(), function (provider) {
				_.each(provider.getLoadedDatasetsNames(), function (datasetId) {
					datasets.push(provider.getDatasetsInfo(datasetId));
				});
			});
			return datasets;
		});
		this.getTypeIcon = function (param) {
			switch (param) {
				case core.DATA_TYPE.POIS:
					return "fa-map-marker";
				case core.DATA_TYPE.SAMPLE_POINTS_VALUES:
					return "fa-bullseye";
				case core.DATA_TYPE.SECTOR_VALUE:
					return "fa-bar-chart-o";
			}
			return "fa-question";
		}
	}

	return DataProvidersPanelModel;
});