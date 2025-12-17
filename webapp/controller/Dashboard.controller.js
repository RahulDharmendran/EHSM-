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

            // Filter Incidents by EmployeeId if needed, but let's keep the dashboard logic simple first
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
        },

        onRecentIncidentPress: function (oEvent) {
            var oItem = oEvent.getParameter("listItem");
            var oContext = oItem.getBindingContext();
            var oData = oContext.getObject();

            // Transform data to match JSON model structure expected by Fragment
            var oProcessedData = Object.assign({}, oData);

            // Helpers (same as in IncidentList)
            var formatTime = function (edmTime) {
                if (!edmTime) return "";
                if (typeof edmTime === 'string') {
                    var match = edmTime.match(/PT(\d+)H(\d+)M(\d+)S/);
                    if (match) {
                        return match[1] + ":" + match[2] + ":" + match[3];
                    }
                    return edmTime;
                }
                if (edmTime && edmTime.ms !== undefined) {
                    var date = new Date(edmTime.ms);
                    return date.toISOString().substr(11, 8);
                }
                return edmTime;
            };

            // Formatting Date/Time
            oProcessedData.IncidentTime = formatTime(oProcessedData.IncidentTime);
            oProcessedData.CompletionTime = formatTime(oProcessedData.CompletionTime);

            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ style: "medium" });

            // Completion Date logic
            if (oProcessedData.CompletionDate) {
                // ODataModel might give date object or string? usually string for V2 if not recognized as type
                // But if it's "00000000" or similar.
                // Assuming standard OData V2 Date object or string.
                // Safest to handle both.
                var dCompDate = oProcessedData.CompletionDate;
                if (typeof dCompDate === 'string' && dCompDate.indexOf("0000") !== -1) {
                    oProcessedData.CompletionDateDisplay = "N/A";
                } else if (!dCompDate) {
                    oProcessedData.CompletionDateDisplay = "N/A";
                } else {
                    var dateObj = new Date(dCompDate);
                    // Check if valid date
                    if (isNaN(dateObj.getTime())) {
                        oProcessedData.CompletionDateDisplay = "N/A";
                    } else {
                        oProcessedData.CompletionDateDisplay = oDateFormat.format(dateObj);
                    }
                }
            } else {
                oProcessedData.CompletionDateDisplay = "N/A";
            }

            // Also check IncidentDate
            if (oProcessedData.IncidentDate) {
                var dIncDate = new Date(oProcessedData.IncidentDate);
                // Note: The Fragment still binds IncidentDate 'type: Date' ? No, we didn't change that in Fragment for IncidentDate.
                // Actually, the Fragment uses: {path: 'incidentModel>IncidentDate', type: 'sap.ui.model.type.Date', ...}
                // So we need to provide a Date object in the JSON model for IncidentDate.
                if (typeof oProcessedData.IncidentDate === 'string') {
                    oProcessedData.IncidentDate = new Date(oProcessedData.IncidentDate);
                }
            }
            if (oProcessedData.CompletionDate && typeof oProcessedData.CompletionDate === 'string' && oProcessedData.CompletionDate.indexOf("0000") === -1) {
                oProcessedData.CompletionDate = new Date(oProcessedData.CompletionDate);
            } else if (oProcessedData.CompletionDate && typeof oProcessedData.CompletionDate === 'string') {
                oProcessedData.CompletionDate = null;
            }

            // Create a dedicated JSON Model for the Dialog
            var oDialogModel = new JSONModel(oProcessedData);


            if (!this._oDialog) {
                Fragment.load({
                    name: "ehsmportal.view.IncidentDetail",
                    controller: this
                }).then(function (oDialog) {
                    this._oDialog = oDialog;
                    this.getView().addDependent(this._oDialog);
                    this._oDialog.setModel(oDialogModel, "incidentModel");
                    this._oDialog.open();
                }.bind(this));
            } else {
                this._oDialog.setModel(oDialogModel, "incidentModel");
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
