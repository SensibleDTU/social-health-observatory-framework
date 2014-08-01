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
define(["jquery", "underscore", "core", "fileSaver", "text!/templates/js/importConfigModal.tmpl.html"],
	function ($, _, core, FileSaver, importModalTemplate) {
		var LOG_TAG = "[ImportExport] ";

		// If the JSON methods are not available, we're on an old browser, so we don't support import/export
		if (!window.JSON || !window.File && !window.FileReader || !window.Blob) {
			log.error("ECMAScript5 native JSON or FILE API functionality not available...");
			$("#action-export-config, #action-import-config").click(function () {
				alert("Feature is not available on your browser. Please use a more recent version.");
			});
			return this;
		}

		// Add EXPORT handler
		$("#action-export-config").click(function () {
			log.info(LOG_TAG + "Initializing config file export...");
			var configObject = {};
			_.each(core.layerGroups(), function (layerGroup) {
				_.each(layerGroup.layers(), function (layer) {
					var layerConfig = configObject[layer.id] = {}
					layer.baseExportConfig(layerConfig);
					layer.exportConfig(layerConfig);
				});
			});
			var configurationString = JSON.stringify(configObject, null, '\t');
			log.debug(LOG_TAG + "Export configuration: ", configurationString);

			var configBlob = new Blob([configurationString], {type: 'application/json'}); // the blob
			saveAs(configBlob, "shobservatory-config.json");
		});

		function importConfiguration(configObject) {
			log.debug(LOG_TAG + "Import configuration object: ", configObject);

			_.each(core.layerGroups(), function (layerGroup) {
				_.each(layerGroup.layers(), function (layer) {
					var layerConfig = configObject[layer.id];
					if (layerConfig) {
						layer.baseImportConfig(layerConfig);
						layer.importConfig(layerConfig);
					}
				});
			});
		}

		// Add IMPORT modal to the html handler
		$("#action-import-config").click(function () {
			log.info(LOG_TAG + "Initializing config file import...");

			// Insert the modal in the DOM tree
			var modalDiv = $(importModalTemplate);
			$("#content").append(modalDiv);
			var importModal = $("#import-modal");

			// Add the proper behaviour for file selection
			importModal.find("#import-file").change(function (evt) {
				var selectedFile = evt.target.files[0];
				log.info(LOG_TAG + "Selected configuration file to import: ", selectedFile);
				// Only process json files.
				if (selectedFile.type !== "application/json" && selectedFile.type !== "text/javascript") {
					log.error(" Illegal file type. The configuration type should be json: " + selectedFile.type);
					return;
				}

				var reader = new FileReader();
				// Select the handler invoked after the configuration file has been read
				reader.onload = function (evt) {
					log.debug(LOG_TAG + "Read configuration file: ", evt.target.result);
					var configObject;
					try {
						configObject = JSON.parse(evt.target.result);
					}
					catch (err) {
						log.error("Error while parsing configuration file:", err);
						importModal.find("#import-error").fadeIn();
						return;
					}
					// After the config has been successfully read and parsed, import the settings
					importConfiguration(configObject);
					// ... and hide the modal
					importModal.modal('hide');

				};
				// Actually read the configuration file
				reader.readAsText(selectedFile);
			});

			// Make sure we remove the modal when it's closed
			importModal.on('hidden.bs.modal', function () {
				$(this).data('bs.modal', null);
				$(this).remove();
			});

			// And finally show the modal
			importModal.modal();
		});
		return this;
	});