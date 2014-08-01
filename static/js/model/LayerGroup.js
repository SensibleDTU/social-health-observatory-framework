define(["knockout", "core"], function (ko, core) {
	function LayerGroup(name, type) {
		this.layers = ko.observableArray();
		this.name = name;
		this.type = type;

		// View-related properties
		this.expanded = ko.observable(false);
	}

	LayerGroup.TYPE = {
		SINGLE_SELECTION: "single",
		MULTI_SELECTION: "multi"
	}

	// return the constructor function so it can be used by other modules.
	return LayerGroup;
});