sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (Controller, Filter, FilterOperator, Fragment, JSONModel) {
    "use strict";

    return Controller.extend("ehsmportal.controller.Dashboard", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Dashboard").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            this._sEmployeeId = oEvent.getParameter("arguments").employeeId;
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
