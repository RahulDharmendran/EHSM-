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

                    MessageToast.show("An error occurred during login.");
                }
            });
        }
    });
});
