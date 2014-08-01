define(["./AbstractDataSet", "underscore"], function (AbstractDataSet, _) {
		return AbstractDataSet.extend({
			initialize: function (name, sectorValues, prettyName) {
				AbstractDataSet.prototype.initialize.call(this, name, "sector-values", prettyName);
				this._sectorValues = sectorValues || {};
			},
			/**
			 * Returns the sector value for the sector with the given id.
			 *
			 * @param {int} sectorId - The sector's
			 */
			getSectorValue: function (sectorId) {
				return this._sectorValues[sectorId];
			},

			/**
			 * Returns a dictionary with all the sector values as values and the sector ids as keys.
			 */
			getSectorValues: function () {
				return this._sectorValues;
			},

			getMaxValue: function () {
				if (this._maxValue == undefined) {
					var values = _.values(this._sectorValues);
					if (values.length > 0)
						this._maxValue = _.max(values);
				}
				return this._maxValue;
			}
		});
	}
)
;