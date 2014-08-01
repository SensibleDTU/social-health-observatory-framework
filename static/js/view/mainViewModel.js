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
 * The main view model for the application.
 */
define(["knockout", "core", "view/LayersPanelModel", "view/SettingsPanelModel", 'view/DatasetsPanelModel'],
	function (ko, core, LayersPanelModel, SettingsPanelModel, DatasetsPanelModel) {

		function MainViewModel() {
			var self = this;
			this.LOG_TAG = "[UI] ";
			this.LAYERS_PANEL_MODEL = new LayersPanelModel();
			this.SETTINGS_PANEL_MODE = new SettingsPanelModel();
			this.DATASETS_PANEL_MODEL = new DatasetsPanelModel();

			// Initial panels
			self.currentSection = ko.observable("layers");
			self.currentPanel = ko.observable(self.LAYERS_PANEL_MODEL);

			this.showSettingsForLayer = function (layer) {
				log.debug(self.LOG_TAG + "Showing settings panel for layer: " + layer.name);
				self.SETTINGS_PANEL_MODE.setLayer(layer);
				self.currentPanel(self.SETTINGS_PANEL_MODE);
			};
			this.goBackFromSettings = function () {
				log.debug(self.LOG_TAG + "Going back from settings panel to layers panel.");
				self.currentPanel(self.LAYERS_PANEL_MODEL);
			};
			this.showLayersPanel = function () {
				log.debug(self.LOG_TAG + "Showing layers panel...");
				if (self.currentPanel() != self.LAYERS_PANEL_MODEL) {
					self.currentPanel(self.LAYERS_PANEL_MODEL);
					self.currentSection("layers");
				}
			};
			this.showDataProvidersPanel = function () {
				log.debug(self.LOG_TAG + "Showing datasets panel...");
				if (self.currentPanel() != self.DATASETS_PANEL_MODEL) {
					self.currentPanel(self.DATASETS_PANEL_MODEL);
					self.currentSection("datasets");
				}
			};
		}

		return new MainViewModel();
	});
