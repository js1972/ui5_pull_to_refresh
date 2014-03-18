(function() {
	"use strict";

	jQuery.sap.require("sap.ui.demo.util.Formatter");
	jQuery.sap.require("sap.ui.demo.util.Grouper");

	sap.ui.controller("sap.ui.demo.view.Master", {

		onInit: function() {
			this.bus = sap.ui.getCore().getEventBus();
		},

		onExit: function() {
			if (this._lineItemViewDialog) {
				this._lineItemViewDialog.destroy();
				this._lineItemViewDialog = null;
			}
		},

		/* sap.m.PulltoRefresh : refresh event handler */
		refreshData: function(evt) {
			var pullToRefreshControl = evt.getSource();

			// load some more data
			var model = this.getView().getModel();
			model.loadData("model/mock.json", "", true, "GET", true);

			//var salesOrders = model.getData();

			//jQuery.ajax("Data.json", {
			//	dataType: "json",
			//	success: function(data) {
			//		var oModel = new sap.ui.model.json.JSONModel(data);
			//	}
			//});

			setTimeout(function(p) {
				p.hide();
			}, 1000, pullToRefreshControl);
		},

		/* handle selection of list item in desktop mode */
		handleListSelect: function(evt) {
			console.log("list item select - desktop");

			this.bus.publish("nav", "to", {
				id: "idViewRoot--idViewDetail",
				data: {
					context: evt.getParameter("listItem").getBindingContext()
				}
			});
		},

		/* handle selection of list item in mobile mode */
		handleListItemPress: function(evt) {
			console.log("list item select - mobile");

			this.bus.publish("nav", "to", {
				id: "idViewRoot--idViewDetail",
				data: {
					context: evt.getSource().getBindingContext()
				}
			});
		},

		handleSearch: function(evt) {
			// create model filter
			var filters = [];
			var query = evt.getParameter("query");
			if (query && query.length > 0) {
				var filter = new sap.ui.model.Filter("SoId", sap.ui.model.FilterOperator.Contains, query);
				filters.push(filter);
			}

			// update list binding
			var list = this.getView().byId("list");
			var binding = list.getBinding("items");
			binding.filter(filters);
		},

		handleViewSettings: function() {
			// create and open settings dialog
			var that = this;
			if (!this._lineItemViewDialog) {
				this._lineItemViewDialog = new sap.m.ViewSettingsDialog({
					groupItems: [
						new sap.m.ViewSettingsItem({
							text: "Price",
							key: "GrossAmount"
						}),
						new sap.m.ViewSettingsItem({
							text: "Status",
							key: "BillingStatus"
						})
					],
					confirm: function(evt) {
						var aSorters = [];
						var mParams = evt.getParameters();
						if (mParams.groupItem) {
							var sPath = mParams.groupItem.getKey();
							var bDescending = mParams.groupDescending;
							var vGroup = sap.ui.demo.util.Grouper[sPath];
							aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, vGroup));
						}
						var oBinding = that.getView().byId("list").getBinding("items");
						oBinding.sort(aSorters);
					}
				});
			}

			this._lineItemViewDialog.open();
		}

	});

}());