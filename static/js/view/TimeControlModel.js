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
 * View Model for the a Time Control Widget.
 */
define(["knockout", "underscore", "core", 'text!/templates/js/timeControl.tmpl.html', ],
	function (ko, _, core, template) {

		function TimeControlModel(timePoints, selectedTimePoint, updatedTimePointCallback) {
			log.debug("Creating new time control model...");
			this.timePoints = timePoints;
			this.updatedTimePointCallback = updatedTimePointCallback;
			if (selectedTimePoint)
				this.selectedTimePoint = ko.observable(selectedTimePoint);
			else
				this.selectedTimePoint = ko.observable(timePoints[0])
		}


		ko.bindingHandlers.timeControl = {
			init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
				// Nothing to do
				log.debug("[KO UI] Initializing time control...");
				var model = ko.unwrap(valueAccessor());
				var selectedIndex = _.indexOf(model.timePoints, model.selectedTimePoint());
				if (selectedIndex == -1) {
					selectedIndex = 0;
				}

				var options = {
					value: selectedIndex,
					min: 0,
					max: model.timePoints.length,
					step: 1,
					formater: function (value) {
						return model.timePoints[value];
					}
				};

				function _updateSelectedTimePoint(selectedTimePoint) {
					sliderDiv.find("#time-control-data-moment").text(selectedTimePoint);
					model.selectedTimePoint(selectedTimePoint);
					model.updatedTimePointCallback(selectedTimePoint);
				}

				// Initialize the slider and set up listeners
				var sliderDiv = $('<div>').html(template);
				$(element).append(sliderDiv);
				var s = sliderDiv.find('#time-control').slider(options);
				// Proper behaviour when selecting value using slider
				s.on('slideStop', function (e) {
					_updateSelectedTimePoint(model.timePoints[e.value]);
				});

				// Proper behaviour for controller buttons
				sliderDiv.find("#time-control-down").click(function () {
					var newValue = s.slider("getValue") - 1;
					s.slider("setValue", newValue);
					_updateSelectedTimePoint(model.timePoints[s.slider("getValue")]);
				});
				sliderDiv.find("#time-control-up").click(function () {
					var newValue = s.slider("getValue") + 1;
					s.slider("setValue", newValue);
					_updateSelectedTimePoint(model.timePoints[s.slider("getValue")]);
				});

				// Set initial values
				sliderDiv.find("#time-control-data-moment").text(model.selectedTimePoint());
			},
			update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
				// Nothing to do
			}
		};


		return TimeControlModel;
	});