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
define(['knockout'], function (ko) {
	ko.extenders.minValue = function (target, minValueObservable) {
		//create a write-able computed observable to intercept writes to our observable
		var result = ko.computed({
			read: target,  //always return the original observables value
			write: function (newValue) {
				var current = target();
				newValue = Number(newValue);
				var valueToWrite = newValue;
				if (valueToWrite <= minValueObservable())
					valueToWrite = minValueObservable() + 1;

				// only write if it changed
				if (valueToWrite !== current) {
					target(valueToWrite);
				}
				else {
					// if the final value is the same, but a different value was written, force a notification for the
					// current field
					if (newValue !== current) {
						target.notifySubscribers(valueToWrite);
					}
				}
			}
		}).extend({ notify: 'always' });

		//initialize with current value
		result(target());

		//return the new computed observable
		return result;
	};

	ko.extenders.maxValue = function (target, maxValueObservable) {
		//create a write-able computed observable to intercept writes to our observable
		var result = ko.computed({
			read: target,  //always return the original observables value
			write: function (newValue) {
				var current = target();
				newValue = Number(newValue);
				var valueToWrite = newValue;
				if (valueToWrite >= maxValueObservable())
					valueToWrite = maxValueObservable() - 1;

				// only write if it changed
				if (valueToWrite !== current) {
					target(valueToWrite);
				}
				else {
					// if the final value is the same, but a different value was written, force a notification for the
					// current field
					if (newValue !== current) {
						target.notifySubscribers(valueToWrite);
					}
				}
			}
		}).extend({ notify: 'always' });

		//initialize with current value
		result(target());

		//return the new computed observable
		return result;
	};

	return ko.extenders;
});