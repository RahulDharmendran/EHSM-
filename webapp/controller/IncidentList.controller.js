sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment"
], function (Controller, Filter, FilterOperator, Fragment) {
    "use strict";

    return Controller.extend("ehsmportal.controller.IncidentList", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("IncidentList").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            this._sEmployeeId = oEvent.getParameter("arguments").employeeId;

            // Filter Table by EmployeeId
            var oTable = this.byId("incidentTable");
            var oBinding = oTable.getBinding("items");
            if (oBinding) {
                var oFilter = new Filter("EmployeeId", FilterOperator.EQ, this._sEmployeeId);
                oBinding.filter([oFilter]);
            }
        },

        onNavBack: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Dashboard", { employeeId: this._sEmployeeId }, true);
        },

        onIncidentPress: function (oEvent) {
            var oItem = oEvent.getParameter("listItem");
            var oBindingContext = oItem.getBindingContext();

            if (!this._oDialog) {
                Fragment.load({
                    name: "ehsmportal.view.IncidentDetail",
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

        onCloseIncidentDialog: function () {
            if (this._oDialog) {
                this._oDialog.close();
            }
        }
    });
});
