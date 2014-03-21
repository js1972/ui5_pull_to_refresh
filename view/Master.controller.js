(function() {
	"use strict";

	jQuery.sap.require("sap.ui.demo.util.Formatter");
	jQuery.sap.require("sap.ui.demo.util.Grouper");

	sap.ui.controller("sap.ui.demo.view.Master", {

		currentRows: 0,
		listInit: false,
		scroller: null,
		usingIScroll: true,

		onInit: function() {
			this.bus = sap.ui.getCore().getEventBus();
		},

		onExit: function() {
			if (this._lineItemViewDialog) {
				this._lineItemViewDialog.destroy();
				this._lineItemViewDialog = null;
			}
		},

		/**
		 * sap.m.PulltoRefresh : refresh event handler.
		 * Note that the iScroll library is only used in the mobile scenario. We need to work 
		 * with the UI5 scroller in desktop mode.
		 */
		refreshData: function(evt) {
			var pullToRefreshControl = evt.getSource();
			var model = this.getView().getModel();
			
			// Get the scroller
			this.scroller = pullToRefreshControl.getParent()._oScroller._scroller;
			if (!this.scroller) {
				this.scroller = pullToRefreshControl.getParent()._oScroller;
				this.usingIScroll = false;
			}

			// Load some more data (dummy json) and pre-pend it to our model
			jQuery.ajax("model/more_mock_data.json", {
				dataType: "json",
				success: function(moreData) {
					var d = model.getData();
					d.SalesOrderCollection = moreData.SalesOrderCollection.concat(d.SalesOrderCollection);

					// dummy delay to simulate network latency
					setTimeout(function(p) {
						model.setData(d);
						p.hide();
					}, 1000, pullToRefreshControl);
				}
			});
		},

		/**
		 * Fired when the sap.m.List is updated via a data change or binding - set scroll pos to previously viewed list item.
		 * In desktop mode we have to calculate the item offset outselves as we don't have iScroll available.
		 */
		handleUpdateFinished: function(evt) {
			if (evt.getParameter("reason") === "Change") {
				var actualRows = evt.getParameter("actual");

				if (this.listInit && actualRows > this.currentRows) {
					var diff = actualRows - this.currentRows; // - 1;
					var rowsToScroll = diff < 0 ? 0 : diff;

					// Get scroller
					
					
					if (this.scroller) {
						setTimeout(function() {
							var listItemSelector = "#__item0-idViewRoot--idViewMaster--list-" + rowsToScroll;
							if (this.usingIScroll) {
								this.scroller.scrollToElement(listItemSelector, 300);
								this.scroller.scrollTo(0, 20, 500);
							} else {
								var offset = $(listItemSelector).position().top;
								this.scroller.scrollTo(0, offset, 300);
							}
						}.bind(this), 200);
					}
				}
				this.listInit = true;
				this.currentRows = actualRows;
			}
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
