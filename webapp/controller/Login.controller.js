sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("ehsmportal.controller.Login", {
        onLoginPress: function () {
            var sEmpId = this.getView().byId("empIdInput").getValue();
            var sPassword = this.getView().byId("passwordInput").getValue();

            if (!sEmpId || !sPassword) {
                MessageToast.show("Please enter both Employee ID and Password.");
                return;
            }

            // Construct the path for the specific entity
            // Pattern: /ZRD_EHSM_LOGINSet(EmployeeId='00000001',Password='191203')
            var sPath = "/ZRD_EHSM_LOGINSet(EmployeeId='" + sEmpId + "',Password='" + sPassword + "')";

            var oModel = this.getOwnerComponent().getModel();

            sap.ui.core.BusyIndicator.show();

            oModel.read(sPath, {
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    if (oData.Status === "Success") {
                        MessageToast.show("Login Successful!");
                        var oRouter = this.getOwnerComponent().getRouter();
                        oRouter.navTo("Dashboard", {
                            employeeId: sEmpId
                        });
                    } else {
                        MessageToast.show("Login Failed. Please check credentials.");
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    // In a real scenario, we might want to assume success if offline or mock, but let's stick to error
                    // However, if the service is not actually running, this will always fail.
                    // For the sake of demonstration, if we get a network error in this environment, 
                    // we might not see "Login Successful".
                    // But I must implement what was asked.
                    MessageToast.show("An error occurred during login.");
                }
            });
        }
    });
});
