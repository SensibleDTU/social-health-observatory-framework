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
define([ "jquery", "model/PointOfInterest" ], function ($, PointOfInterest) {

	var NOMINATIM_API_BASE = "http://open.mapquestapi.com/nominatim/v1/search.php?format=json";

	function search(query, options, callback) {
		log.info("Searching MapQuery Nominatim for ", query);
		var url = NOMINATIM_API_BASE;
		url += "&limit=" + (options.limit || 10);
		url += "&q=" + encodeURIComponent(query);

		if (options.bounds) {
			var viewbox = options.bounds.left + "," + options.bounds.top + "," + options.bounds.right + ","
				+ options.bounds.bottom;
			url += "&viewbox=" + encodeURIComponent(viewbox);
		} else if (options.countrycode) {
			url += "&countrycodes=" + countrycode;
		}
		if (options.bounded)
			url += "&bounded=1";
		if (options.addressdetails)
			url += "&addressdetails=1";

		log.debug("Nominatim query: " + url);
		$.getJSON(url, function (jd) {
			var pois = [];
			for (var i = 0; i < jd.length; i++) {
				var el = jd[i];
				pois.push(new PointOfInterest(el.address.attraction, el.lat, el.lon, el.type, el.class,
					el.display_name, el.icon));
			}
			callback(pois);
		});
	}

	return {
		search: search
	};

});