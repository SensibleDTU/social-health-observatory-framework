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
define([ "leaflet", 'util/Rainbow' ], function (L, Rainbow) {
	L.TileLayer.InterpolationLayer = L.TileLayer.Canvas
		.extend({
			options: {
				debug: false,
				colors: [ 'green', 'red' ],
				minRange: 0,
				maxRange: 100,
				opacity: 0.6,
				quadSize: 16,
				weightingExponent: 2
			},

			initialize: function (options, data) {
				var self = this;
				L.Util.setOptions(this, options);

				this._rainbow = new Rainbow(this.options.colors);
				this._rainbow.setNumberRange(this.options.minRange, this.options.maxRange);

				this._generateInterpolationPoints();

				this.drawTile = function (tile, tilePoint, zoom) {
					var ctx = {
						canvas: tile,
						tilePoint: tilePoint,
						zoom: zoom
					};

					if (self.options.debug) {
						self._drawDebugInfo(ctx);
					}
					if (!self._dataset) {
						log.warn("No data available for drawing on Interpolation Layer.");
						return;
					}

					this._draw(ctx);
				};
			},

			/**
			 * Draw debug info (corners, center, tilePoint and samplePoints) on the layer.
			 *
			 * @param ctx
			 */
			_drawDebugInfo: function (ctx) {
				var tileSize = this.options.tileSize;
				var g = ctx.canvas.getContext('2d');
				g.globalCompositeOperation = 'destination-over';
				g.strokeStyle = '#000000';
				g.fillStyle = '#FF0000';
				g.strokeRect(0, 0, tileSize, tileSize);
				g.font = "12px Arial";
				g.fillRect(0, 0, 5, 5);
				g.fillRect(0, tileSize - 5, 5, 5);
				g.fillRect(tileSize - 5, 0, 5, 5);
				g.fillRect(tileSize - 5, tileSize - 5, 5, 5);
				g.fillRect(tileSize / 2 - 5, tileSize / 2 - 5, 10, 10);
				g.strokeText(ctx.tilePoint.x + ' ' + ctx.tilePoint.y + ' ' + ctx.zoom,
						tileSize / 2 - 30, tileSize / 2 - 10);

				// Compute tile start and project the sample points and check which sample
				// points fall in the current tile
				var s = ctx.tilePoint.multiplyBy(tileSize);
				this._projectSamplePoints(ctx.zoom);
				this._projectedSamplePoints.forEach(function (p) {
					var xdif = p.x - s.x;
					var ydif = p.y - s.y;
					if (xdif < tileSize && xdif >= 0 && ydif < tileSize && ydif > 0) {
						g.save();
						g.beginPath();
						g.arc(xdif, ydif, 8, 0, 2 * Math.PI, false);
						g.fillStyle = 'green';
						g.fill();
						g.lineWidth = 5;
						g.stroke();
						g.restore();
					}
				});

			},

			/**
			 * Generate the interpolation points, based on the current quad size.
			 */
			_generateInterpolationPoints: function () {
				var quadSize = this.options.quadSize;
				var points = [];
				var count = this.options.tileSize / quadSize;
				log.debug("Generating %s interpolation points.", count);

				for (var x = 0; x < count; x++)
					for (var y = 0; y < count; y++)
						points.push({
							x: x * quadSize,
							y: y * quadSize
						});
				this._interpolationPoints = points;
			},

			/**
			 * Set a new size for the small quads drawn on the tile.
			 *
			 * @param quadSize
			 *            the new quad size.
			 */
			setQuadSize: function (quadSize) {
				this.options.quadSize = quadSize;
				this._generateInterpolationPoints();
			},

			/**
			 * Project all the sample points coordinates into map pixels.
			 *
			 * @param zoom
			 *            the map zoom level
			 */
			_projectSamplePoints: function (zoom) {
				// If the data has already been projected for this zoom level, skip
				if (this._projectedZoom == zoom) {
					return;
				}

				this._projectedSamplePoints = [];
				// If there's no data, skip
				if (!this._dataset) {
					return;
				}

				var data = this._dataset;
				for (var i = 0; i < data.length; i++) {
					// Note: The data already has the 'lat' and 'lng' fields so it will safely
					// be transformed to LatLng
					var p = this._map.project(data[i]);
					p.val = data[i].value;
					this._projectedSamplePoints.push(p);
				}

				this._projectedZoom = zoom;
				log.debug("Projected sample points for zoom level ", zoom,
					this._projectedSamplePoints);
			},

			/**
			 * Set new sample data to be used when drawing the layer.
			 *
			 * @param dataset
			 *            the data, as an array of objects with {lat, lon, value} fields
			 */
			setData: function (dataset) {
				log.debug("Setting interpolation data to: ", dataset);
				this._dataset = dataset;
				// Make sure we reproject the data when needed
				this._projectedZoom = -1;

				if (this._map) {
					this.redraw();
					log.info("Redrawing interpolation layer...");
				}
			},

			/**
			 * Draw a set of points on a tile, based on the interpolated value
			 */
			_drawPoints: function (ctx, points, tileStart) {
				var c = ctx.canvas, g = c.getContext('2d');
				var self = this;
				var quadSize = this.options.quadSize;

				g.globalCompositeOperation = 'source-over';
				g.globalAlpha = this.options.opacity;

				points.forEach(function (p) {
					// Compute the interpolated value
					var val = self.interpolate(p.x + tileStart.x, p.y + tileStart.y,
						self._projectedSamplePoints);
					g.fillStyle = "#" + self._rainbow.colourAt(val);
					g.beginPath();
					g.fillRect(p.x, p.y, quadSize, quadSize);
				});
			},

			/**
			 * Draw a tile.
			 */
			_draw: function (ctx) {
				if (!this._dataset || !this._map) {
					return;
				}

				// Make sure the sample points' pixel coordinates are relative to the current
				// zoom level
				this._projectSamplePoints(ctx.zoom);

				// Compute the starting coordinates of the current tile, in map pixels
				// coordinates
				var s = ctx.tilePoint.multiplyBy(this.options.tileSize);

				this._drawPoints(ctx, this._interpolationPoints, s);
			},

			interpolate: function (x, y, samplePoints) {
				// Shepard's Method:
				// http://www.ems-i.com/gmshelp/Interpolation/Interpolation_Schemes/Inverse_Distance_Weighted/Shepards_Method.htm
				var weights = [];
				var dx, dy, d, w;
				var wSum = 0;
				var exponent = this.options.weightingExponent;

				for (var k = 0; k < samplePoints.length; k++) {
					// Compute the distance to the sample point
					dx = samplePoints[k].x - x;
					dy = samplePoints[k].y - y;
					d = Math.sqrt(dx * dx + dy * dy);
					// If the point is really close to one of the data points, return
					// the data point value to avoid singularities
					if (d < 0.001)
						return samplePoins[k].val;
					// Compute the weight and update the weight sum
					w = 1 / (Math.pow(d, exponent));
					wSum += w;
					weights.push(w);
				}
				// Compute the interpolated value
				var val = 0;
				for (var k = 0; k < samplePoints.length; k++) {
					val += samplePoints[k].val * (weights[k] / wSum);
				}
				return val;
			}
		});

	L.TileLayer.interpolationLayer = function (options) {
		return new L.TileLayer.InterpolationLayer(options);
	};

	return L.TileLayer.InterpolationLayer;
});