(function() {
	"use strict";

	sap.ui.controller("sap.ui.demo.view.LineItem", {

		onInit: function() {
			this.bus = sap.ui.getCore().getEventBus();
		},

		handleNavBack: function() {
			this.bus.publish("nav", "back");
		}

	});

}());