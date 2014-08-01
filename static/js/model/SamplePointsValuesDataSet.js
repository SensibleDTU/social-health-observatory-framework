define(["./AbstractDataSet"], function (AbstractDataSet) {
	return AbstractDataSet.extend({
		initialize: function (name, samplePoints, prettyName) {
			AbstractDataSet.prototype.initialize.call(this, name, "sample-points", prettyName);
			this._samplePoints = samplePoints || [];
		},

		/**
		 * Returns a list with all the sample points. The sample points are {@link PointOfInterest} with an extra
		 * {@field value} field containing the measured sample value at the point.
		 */
		getSamplePoints: function () {
			return this._samplePoints;
		}
	});
});