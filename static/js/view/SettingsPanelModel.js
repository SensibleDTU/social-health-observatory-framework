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
 * View Model for the Control Panel's Settings Section.
 */
define(["knockout", "core"], function (ko, core) {

	function SettingsPanelModel() {
		var self = this;
		this.templateName = "settingsPanel";
		this.currentLayer = undefined;
		this.currentViewModel = ko.observable();
		this.currentTimeControlModel = ko.observable();
		this.setLayer = function (layer) {
			this.currentLayer = layer;
			this.currentViewModel(layer.getSettingsViewModel());
			if (layer.hasTimeControl)
				this.currentTimeControlModel(layer.getTimeControlModel());
		}
	}

	return SettingsPanelModel;
});