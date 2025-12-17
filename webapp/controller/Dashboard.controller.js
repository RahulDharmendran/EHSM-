sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("ehsmportal.controller.Dashboard", {
        onLogout: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Login");
        },
        onPressIncident: function () {
            // Placeholder for navigation to Incident Detail
            // sap.m.MessageToast.show("Navigating to Incident Management...");
        },
        onPressRisk: function () {
            // Placeholder for navigation to Risk Assessment
            // sap.m.MessageToast.show("Navigating to Risk Assessment...");
        }
    });
});
