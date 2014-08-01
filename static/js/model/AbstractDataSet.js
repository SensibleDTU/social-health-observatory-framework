define(["leaflet"], function (L) {
	return L.Class.extend({
		/**
		 * The constructor for a basic dataset.
		 *
		 * @param datasetId - the id of the dataset
		 * @param type - the type of the dataset
		 * @param name - the public/visible name of the dataset, if needs to be different from name
		 */
		initialize: function (datasetId, type, name) {
			this.datasetId = datasetId;
			this.type = type;
			this.name = name || datasetId;
		}
	});
});