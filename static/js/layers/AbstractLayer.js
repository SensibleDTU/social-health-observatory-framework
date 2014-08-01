/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 cosminstefanxp@gmail.com
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
define([ "jquery", "underscore", "knockout", "leaflet", "view/TimeControlModel", 'slider' ],
	function ($, _, ko, L, TimeControlModel) {
		return L.Class.extend({
			initialize: function (id, name, dataProvider) {
				this.name = name;
				this.id = id;
				this.enabled = ko.observable(false);
				this.dataProvider = dataProvider;
				this.LOG_TAG = "[L " + id + "] ";
				this.hasTimeControl = false;
				this.timeControlModel = undefined;

				_.bindAll(this, "_selectedTimePointCallback", "enable", "disable", "getTimeControlModel");

				if (dataProvider && dataProvider.providesTimeSeries()) {
					this._workingTimePoint = dataProvider.getWorkingTimePoint();
					this.hasTimeControl = true;
					this.timeControlModel =
					new TimeControlModel(this.dataProvider.getTimePoints(), this.dataProvider.getWorkingTimePoint(),
						this._selectedTimePointCallback);
					log.debug(this.LOG_TAG +
					          "Data provider supports time series. Enabling time series controls for time points",
						this.timeControlModel.timePoints);
				}
			},
			getTimeControlModel: function () {
				// If we have no model or the new time points are the same as the old ones, keep the old time control model
				var newTimePoints = this.dataProvider.getTimePoints();
				if (this.timeControlModel && _.isEqual(newTimePoints, this.timeControlModel.timePoints))
					return this.timeControlModel;
				// Set up a new time points model
				this.timeControlModel = new TimeControlModel(newTimePoints, this.dataProvider.getWorkingTimePoint(),
					this._selectedTimePointCallback);
				return this.timeControlModel;
			},
			toggleEnabled: function () {
				if (this.enabled())
					this.disableLayer();
				else
					this.enableLayer();
			},
			enableLayer: function () {
				if (this.enabled())
					return;
				log.info(this.LOG_TAG + "Enabling layer...");
				this.enabled(true);
				this.enable();
			},
			disableLayer: function () {
				if (!this.enabled())
					return;
				log.info(this.LOG_TAG + "Disabling layer...");
				this.enabled(false);
				this.disable();
			},
			getName: function () {
				return this.name;
			},
			baseExportConfig: function (layerConfig) {
				layerConfig.enabled = this.enabled();
				if (this.dataProvider && this.dataProvider.providesTimeSeries())
					layerConfig.selectedTimePoint = this.timeControlModel.selectedTimePoint();
			},
			/**
			 * Method that needs to be implemented in order to save any configuration for exporting.
			 */
			exportConfig: function (layerConfig) {
			},

			baseImportConfig: function (layerConfig) {
				// Disable the layer at the beginning anyway as we'll need a re-enabling anyway to properly load the config
				this.disableLayer();

				if (layerConfig.selectedTimePoint && this.dataProvider && this.dataProvider.providesTimeSeries()) {
					this.timeControlModel = undefined;
					this._selectedTimePointCallback(layerConfig.selectedTimePoint);
				}

				// Perform any import that layer specific
				this.importConfig(layerConfig);

				// If the layer should be enabled, do it now
				if (layerConfig.enabled)
					this.enableLayer();
			},
			/**
			 * Method that needs to be implemented in order to import any configuration previously exported
			 */
			importConfig: function (layerConfig) {
			},

			_selectedTimePointCallback: function (newTimePoint) {
				if (newTimePoint == this._workingTimePoint) {
					log.debug(this.LOG_TAG + "Already showing data for " + this._workingTimePoint);
					return;
				}
				this._workingTimePoint = newTimePoint;
				log.info(this.LOG_TAG + "Showing data for time point " + newTimePoint);
				this.dataProvider.setWorkingTimePoint(newTimePoint);

				// Re-load the data for the new moment
				this._loadData();
				// If the layer is visible, refresh it
				if (this.enabled()) {
					_.defer(this.disable);
					_.delay(this.enable, 15);
				}
			},

			/**
			 * Defines whether this layer has a settings panel. The settings panel template is defined by the
			 * #getSettingsTemplate() function.
			 */
			hasSettings: false,

			/**
			 * Returns the template name for the settings panel. This is only used only if the hasSettings value is true.
			 */
			getSettingsTemplate: function () {
				return undefined;
			},

			/**
			 * Returns the template name for the settings panel. This is only used only if the hasSettings value is true.
			 */
			getSettingsViewModel: function () {
				return {title: this.name};
			}
		});
	});