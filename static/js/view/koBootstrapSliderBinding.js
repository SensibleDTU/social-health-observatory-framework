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
define(["knockout"], function (ko) {
	ko.bindingHandlers.sliderValue = {
		init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
			var params = valueAccessor();

			// Check whether the value observable is either placed directly or in the parameters object.
			if (!(ko.isObservable(params) || params['value']))
				throw "You need to define an observable value for the sliderValue. Either pass the observable directly or as the 'value' field in the parameters.";

			// Identify the value and initialize the slider
			var valueObservable;
			if (ko.isObservable(params)) {
				valueObservable = params;
				$(element).slider({value: ko.unwrap(params)});
			}
			else {
				valueObservable = params['value'];
				// Replace the 'value' field in the options object with the actual value
				params['value'] = ko.unwrap(valueObservable);
				$(element).slider(params);
			}

			// Make sure we update the observable when changing the slider value
			$(element).on('slide', function (ev) {
				valueObservable(ev.value);
			});

		},
		update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
			var modelValue = valueAccessor();
			var valueObservable;
			if (ko.isObservable(modelValue))
				valueObservable = modelValue;

			else
				valueObservable = modelValue['value'];

			$(element).slider('setValue', valueObservable());
		}
	};
});
