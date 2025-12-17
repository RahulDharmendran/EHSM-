sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (Controller, Filter, FilterOperator, Fragment, JSONModel) {
    "use strict";

    return Controller.extend("ehsmportal.controller.RiskList", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RiskList").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            this._sEmployeeId = oEvent.getParameter("arguments").employeeId;
            this._loadData();
        },

        _loadData: function () {
            var oTable = this.byId("riskTable");
            oTable.setBusy(true);

            var oModel = this.getOwnerComponent().getModel();
            var aFilters = [new Filter("EmployeeId", FilterOperator.EQ, this._sEmployeeId)];

            oModel.read("/ZRD_EHSH_RISKSet", {
                filters: aFilters,
                success: function (oData) {
                    var aResults = oData.results || [];

                    // Manually fix dates for JSON Model
                    aResults.forEach(function (oItem) {
                        if (oItem.RiskIdentificationDate) { oItem.RiskIdentificationDate = new Date(oItem.RiskIdentificationDate); }
                    });

                    var oJSONModel = new JSONModel({ results: aResults });
                    this.getView().setModel(oJSONModel);
                    oTable.setBusy(false);
                }.bind(this),
                error: function (oError) {
                    oTable.setBusy(false);
                    sap.m.MessageToast.show("Failed to load risks.");
                }
            });
        },

        onNavBack: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Dashboard", { employeeId: this._sEmployeeId }, true);
        },

        onRiskPress: function (oEvent) {
            var oItem = oEvent.getParameter("listItem");
            var oBindingContext = oItem.getBindingContext();

            if (!this._oDialog) {
                Fragment.load({
                    name: "ehsmportal.view.RiskDetail",
                    controller: this
                }).then(function (oDialog) {
                    this._oDialog = oDialog;
                    this.getView().addDependent(this._oDialog);
                    this._oDialog.bindElement(oBindingContext.getPath());
                    this._oDialog.open();
                }.bind(this));
            } else {
                this._oDialog.bindElement(oBindingContext.getPath());
                this._oDialog.open();
            }
        },

        onCloseRiskDialog: function () {
            if (this._oDialog) {
                this._oDialog.close();
            }
        }
    });
});
