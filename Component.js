/*
Component details:
	- Main Control: sap.m.SplitApp (wrapped in sap.m.Shell to center app on screen
					and limit width - remove if you want a fullscreen app)
	- Views: XML
	- Navigation: EventBus
*/
/*globals FastClick*/
(function() {
	"use strict";

	jQuery.sap.declare("sap.ui.demo.Component");

	sap.ui.core.UIComponent.extend("sap.ui.demo.Component", {

		createContent: function() {
			// create root view
			var oView = sap.ui.view({
				id: "idViewRoot",
				viewName: "sap.ui.demo.view.Root",
				type: "XML",
				viewData: {
					component: this
				}
			});

			// set data model on root view
			oView.setModel(new sap.ui.model.json.JSONModel("model/mock.json"));

			// set device model
			var deviceModel = new sap.ui.model.json.JSONModel({
				isPhone: jQuery.device.is.phone,
				listMode: (jQuery.device.is.phone) ? "None" : "SingleSelectMaster",
				listItemType: (jQuery.device.is.phone) ? "Active" : "Inactive"
			});
			deviceModel.setDefaultBindingMode("OneWay");
			oView.setModel(deviceModel, "device");

			return oView;
		},

		onAfterRendering: function() {
			FastClick.attach(document.body);
		}
	});

}());
