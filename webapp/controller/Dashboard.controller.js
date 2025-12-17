sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("ehsmportal.controller.Dashboard", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Dashboard").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            this._sEmployeeId = oEvent.getParameter("arguments").employeeId;

            // Filter Incidents by EmployeeId
            var oList = this.byId("incidentsList");
            var oBinding = oList.getBinding("items");
            if (oBinding) {
                var oFilter = new Filter("EmployeeId", FilterOperator.EQ, this._sEmployeeId);
                oBinding.filter([oFilter]);
            }
        },

        onLogout: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Login");
        },

        onPressIncident: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("IncidentList", {
                employeeId: this._sEmployeeId
            });
        },

        onPressRisk: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RiskList", {
                employeeId: this._sEmployeeId
            });
        }
    });
});
