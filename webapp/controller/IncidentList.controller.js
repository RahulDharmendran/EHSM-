sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (Controller, Filter, FilterOperator, Fragment, JSONModel) {
    "use strict";

    return Controller.extend("ehsmportal.controller.IncidentList", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("IncidentList").attachPatternMatched(this._onObjectMatched, this);
            this.getView().setModel(new JSONModel(), "incidentModel");
        },

        _onObjectMatched: function (oEvent) {
            this._sEmployeeId = oEvent.getParameter("arguments").employeeId;
            this._loadData();
        },

        _loadData: function () {
            var oTable = this.byId("incidentTable");
            oTable.setBusy(true);

            var oModel = this.getOwnerComponent().getModel();
            var aFilters = [new Filter("EmployeeId", FilterOperator.EQ, this._sEmployeeId)];

            oModel.read("/ZRD_EHSM_INCIDENTSet", {
                filters: aFilters,
                success: function (oData) {
                    var aResults = oData.results || [];

                    // Helper function to format EDM Time
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

                    // Manually fix dates and times for JSON Model
                    aResults.forEach(function (oItem) {
                        // Convert IncidentDate to Date object if exists
                        if (oItem.IncidentDate && !(oItem.IncidentDate instanceof Date)) {
                            oItem.IncidentDate = new Date(oItem.IncidentDate);
                        }

                        // Safely handle CompletionDate
                        if (oItem.CompletionDate) {
                            if (typeof oItem.CompletionDate === "string" && oItem.CompletionDate.indexOf("0000") === -1) {
                                oItem.CompletionDate = new Date(oItem.CompletionDate);
                            } else if (!(oItem.CompletionDate instanceof Date)) {
                                oItem.CompletionDate = null;
                            }
                        } else {
                            oItem.CompletionDate = null;
                        }

                        // Fix Time Format
                        if (oItem.IncidentTime) {
                            oItem.IncidentTime = formatTime(oItem.IncidentTime);
                        }
                        if (oItem.CompletionTime) {
                            oItem.CompletionTime = formatTime(oItem.CompletionTime);
                        }

                        // Create formatted display strings
                        var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ style: "medium" });

                        if (oItem.CompletionDate instanceof Date) {
                            oItem.CompletionDateDisplay = oDateFormat.format(oItem.CompletionDate);
                        } else {
                            oItem.CompletionDateDisplay = "N/A";
                        }
                    });

                    this.getView().getModel("incidentModel").setData({ results: aResults });
                    oTable.setBusy(false);
                }.bind(this),
                error: function (oError) {
                    oTable.setBusy(false);
                    sap.m.MessageToast.show("Failed to load incidents.");
                }
            });
        },

        onNavBack: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Dashboard", { employeeId: this._sEmployeeId }, true);
        },

        onIncidentPress: function (oEvent) {
            var oItem = oEvent.getParameter("listItem");
            var oBindingContext = oItem.getBindingContext("incidentModel");

            if (!this._oDialog) {
                Fragment.load({
                    name: "ehsmportal.view.IncidentDetail",
                    controller: this
                }).then(function (oDialog) {
                    this._oDialog = oDialog;
                    this.getView().addDependent(this._oDialog);
                    this._oDialog.bindElement({
                        path: oBindingContext.getPath(),
                        model: "incidentModel"
                    });
                    this._oDialog.open();
                }.bind(this));
            } else {
                this._oDialog.bindElement({
                    path: oBindingContext.getPath(),
                    model: "incidentModel"
                });
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
