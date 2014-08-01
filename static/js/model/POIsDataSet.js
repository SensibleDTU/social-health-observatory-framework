define(["./AbstractDataSet"], function (AbstractDataSet) {
	return AbstractDataSet.extend({
		initialize: function (name, pois, prettyName) {
			AbstractDataSet.prototype.initialize.call(this, name, "pois", prettyName);
			this._pois = pois || [];
		},
		/**
		 * Returns the geo points contained in this dataset.
		 */
		getPoints: function () {
			return this._pois;
		},
		/**
		 * Sets the points of interest contained in this dataset.
		 */
		setPoints: function (pois) {
			this._pois = pois;
		}
	});
});