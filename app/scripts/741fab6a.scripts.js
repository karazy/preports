"use strict";
//var host = "http://localhost:8080" || "http://preports-grund.paas.pironet-ndh.com";
var host = location.protocol + "//" + location.host;
var PReports = PReports || {};
angular.module("PReports.resources", []), angular.module("PReports.directives", []), angular.module("PReports.services", []), PReports = angular.module("PReports", ["ngCookies", "ngResource", "ngSanitize", "ngRoute", "PReports.resources", "PReports.directives", "PReports.services", "PReports.translations", "PReports.filters", "angularFileUpload", "ui.bootstrap"]).config(["$routeProvider", function(a) {
        a.when("/reports", {templateUrl: "views/reports.html", controller: "PReports.ReportCtrl"}).when("/reports/:reportId", {templateUrl: "views/reports_detail.html", controller: "PReports.ReportCtrl"}).when("/about", {templateUrl: "views/about.html"}).otherwise({redirectTo: "/reports"})
    }]), PReports.ReportCtrl = function(a, b, c, d, e, f, g, h, i, j, k) {
    function l(c) {
        var e;
        return c ? (e = new d(c), void(c._id || e.$create(function() {
            console.log("saved new report"), a.newReportName = null, b.path("reports/" + e._id)
        }, function() {
            alert("could not save report")
        }))) : void console.log("saveReport: no report given")
    }
    function m(a) {
        var b = new Date(a.getFullYear(), 0, 1);
        return Math.ceil(((a - b) / 864e5 + b.getDay() + 1) / 7)
    }
    function n() {
        var b = a.uploader = g.create({scope: a, url: host + "/reports/" + a.currentReport._id + "/images", alias: "image", removeAfterUpload: !0, autoUpload: !1, filters: [function(a) {
                    var c = b.isHTML5 ? a.type : "/" + a.value.slice(a.value.lastIndexOf(".") + 1);
                    return c = "|" + c.toLowerCase().slice(c.lastIndexOf("/") + 1) + "|", -1 !== "|jpg|png|jpeg|bmp|gif|".indexOf(c)
                }]});
        b.bind("completeall", function() {
            a.loadReport(a.currentReport._id)
        }), b.bind("error", function() {
            console.log("setupFileUpload: upload failed"), j.error = !0, j.errorMessage = k.translate("error.image.upload") || k.translate("error.general") || "Error during communication with service."
        })
    }
    function o() {
        f.get(a.config.serviceUrl + "/reports/names").success(function(b) {
            a.projectNames = b
        }).error(i)
    }
    a.reports = [], a.currentReport = null, a.search = {year: 2014}, a.search.calweek = m(new Date), a.calWeeks = [], a.config = h, a.projectNames = [], a.reportNotFound = !1;
    for (var p = 1; 53 > p; p++)
        a.calWeeks.push({week: p});
    a.loadReports = function() {
        console.log("loadReports"), a.reports = d.query({year: a.search.year, calweek: a.search.calweek}, function() {
            $(".copy-button").tooltip()
        })
    }, a.loadReport = function(b) {
        return b ? (a.reportNotFound = !1, void(a.currentReport = d.get({id: b}, function() {
            n()
        }, function(b) {
            a.reportNotFound = !0, i(b)
        }))) : void e.log("loadReport: No Id provided.")
    }, a.createNewReport = function() {
        var b = {}, c = new Date;
        b.year = c.getFullYear(), b.week = m(c), b.name = a.newReportName, b.milestones = [], l(b)
    }, a.updateReport = function() {
        return a.currentReport ? (a.currentReport.year = parseInt(a.currentReport.year), a.currentReport.week = parseInt(a.currentReport.week), void a.currentReport.$update()) : void console.log("updateReport: no current report")
    }, a.deleteReport = function(c) {
        var d = c || a.currentReport;
        return d ? void d.$delete(function() {
            b.path("/")
        }, i) : void console.log("deleteReport: no report to delete")
    }, a.addMilestone = function() {
        return a.currentReport ? (a.currentReport.milestones || (a.currentReport.milestones = []), a.currentReport.milestones.push({name: "New milestone"}), void a.updateReport()) : void console.log("addMilestone: no current report")
    }, a.removeMilestone = function(b) {
        return a.currentReport ? b || 0 === b ? void(a.currentReport.milestones && 0 != a.currentReport.milestones.length && a.currentReport.milestones[b] && (a.currentReport.milestones.splice(b, 1), a.updateReport())) : void console.log("addMilestone: no index given") : void console.log("addMilestone: no current report")
    }, a.addCodeReview = function() {
        return a.currentReport ? (a.currentReport.codeReviews || (a.currentReport.codeReviews = []), a.currentReport.codeReviews.push({authors: "Add authors"}), void a.updateReport()) : void console.log("addCodeReview: no current report")
    }, a.removeCodeReview = function(b) {
        return a.currentReport ? b || 0 === b ? void(a.currentReport.codeReviews && 0 != a.currentReport.codeReviews.length && a.currentReport.codeReviews[b] && (a.currentReport.codeReviews.splice(b, 1), a.updateReport())) : void console.log("removeCodeReview: no index given") : void console.log("removeCodeReview: no current report")
    }, a.deleteReportImage = function(b) {
        return b ? a.currentReport ? void f.delete(h.serviceUrl + "/reports/" + a.currentReport._id + "/images/" + b._id).success(function() {
            angular.forEach(a.currentReport.images, function(c, d) {
                return c._id == b._id ? (a.currentReport.images.splice(d, 1), !1) : void 0
            })
        }).error(i) : void console.log("deleteReportImage: no current report") : void console.log("deleteReportImage: no image given")
    }, a.copyReport = function(a) {
        return a ? (a.copyOf = a._id, delete a._id, a.name = a.name + "_copy", void l(a)) : void console.log("copyReport: no reportToCopy given")
    }, c.reportId ? a.loadReport(c.reportId) : (a.loadReports(), o(), a.$watch("reports", function() {
        $(".copy-button").tooltip()
    }))
}, PReports.ReportCtrl.$inject = ["$scope", "$location", "$routeParams", "Report", "$log", "$http", "$fileUploader", "config", "errorHandler", "$rootScope", "language"], angular.module("PReports.resources").factory("genericResource", ["$resource", "config", "errorHandler", function(a, b, c) {
        function d(d, e, f) {
            var g = a(b.serviceUrl + d, e, f);
            return g.prototype.saving = !1, g.prototype.isSaving = function() {
                return g.prototype.saving
            }, g.prototype.setSaving = function(a) {
                g.prototype.saving = a
            }, g.prototype.$create = function(a, b, d) {
                var e, f, g = this, h = angular.noop;
                switch (arguments.length) {
                    case 3:
                        e = a, h = b, f = d;
                        break;
                    case 2:
                    case 1:
                        angular.isFunction(a) ? (h = a, f = b || c) : (e = a, h = b || angular.noop, f = c);
                    case 0:
                        break;
                    default:
                        throw"Expected between 1-3 arguments [params, success, error], got " + arguments.length + " arguments."
                }
                g.setSaving(!0), g.$save(e, function(a, b) {
                    g.setSaving(!1), h(a, b)
                }, function(a, b, d, e) {
                    g.setSaving(!1), c(a, b, d, e)
                })
            }, g
        }
        return d
    }]), angular.module("PReports.resources").factory("Report", ["genericResource", function(a) {
        var b = a("/reports/:id", {id: "@_id"}, {update: {method: "PUT"}});
        return b
    }]), angular.module("PReports.translations", [], ["$provide", function(a) {
        var b = {"error.image.upload": {DE: "Bild hochladen fehlgeschlagen.", EN: "Image upload failed."}, "error.404": {DE: "404 Eine Ressource konnte nicht geladen werden.", EN: "404 Resource not available."}, "error.403": {DE: "Ungültige Zugangsdaten oder keine Zugriffsrechte.", EN: "Invalid credentials or insufficient access rights."}, "error.general": {DE: "Es gibt ein Problem mit der Verbindung zum Service.", EN: "There has been a connection problem."}, "error.appengine": {DE: "Es liegt eine Serverstörung vor. Wir arbeiten an einer Lösung.", EN: "The service has been temporarily interrupted. We are working on a solution."}, "common.error.footer": {DE: "Falls dieser Fehler weiterhin besteht, konktaktieren sie <a href='mailto:support@cloobster.com'>support@cloobster.com</a>.", EN: "If this error persists, contact <a href='mailto:support@cloobster.com'>support@cloobster.com</a>."}, "common.sending": {DE: "Sende...", EN: "Sending..."}, "common.send": {DE: "Sende", EN: "Send"}, "common.password.invalid": {DE: "Passwort inkorrekt!", EN: "Password invalid!"}, "common.more": {DE: "Mehr", EN: "More"}, reports: {DE: "Reports", EN: "Reports"}, "reports.new": {DE: "Projektname", EN: "Project name"}, "reports.new.button": {DE: "Neuer Report", EN: "New report"}, "reports.table.name": {DE: "Projektname", EN: "Project name"}, "reports.table.year": {DE: "Jahr", EN: "Year"}, "reports.table.week": {DE: "KW", EN: "Week"}, "reports.table.images": {DE: "Bilder", EN: "Images"}, "reports.table.actions": {DE: "Aktion", EN: "Action"}, "report.name": {DE: "Projektname", EN: "Project name"}, "report.start.title": {DE: "Start", EN: "Start"}, "report.start.ph": {DE: "Startdatum eingeben", EN: "Enter start date"}, "report.golive.title": {DE: "Go live", EN: "Go live"}, "report.golive.ph": {DE: "Go live eingeben", EN: "Enter go live"}, "report.year": {DE: "Jahr", EN: "Year"}, "report.week": {DE: "Woche", EN: "Week"}, "report.leaddevelopers.title": {DE: "Lead developers", EN: "Lead developers"}, "report.projectManagers.title": {DE: "Projektmanager", EN: "Project manager"}, "report.leaddevelopers.ph": {DE: "Entwickler eingeben", EN: "Enter developers"}, "report.projectmanagers.ph": {DE: "Manager eingeben", EN: "Enter manager"}, "report.milestones": {DE: "Meilensteine", EN: "Milestones"}, "report.milestones.ph": {DE: "Meilenstein eintragen", EN: "Enter milestone"}, "report.milestones.start": {DE: "Meilenstein Start", EN: "Milestone start"}, "report.milestones.end": {DE: "Meilenstein Ende", EN: "Milestone end"}, "report.lastweektasks": {DE: "Aufgaben letzte Woche", EN: "Last week tasks"}, "report.nextweektasks": {DE: "Aufgaben nächste Woche", EN: "Nextweek tasks"}, "report.tasks.ph": {DE: "Aufgaben eingeben", EN: "Enter tasks"}, "report.potentials": {DE: "Identifizierte Potentiale", EN: "Identified potentials"}, "report.potentials.ph": {DE: "Potentiale eingeben", EN: "Enter potentials"}, "report.risks": {DE: "Risiken & Behinderungen", EN: "Risks & Impediments"}, "report.risks.ph": {DE: "Risiken/Behinderungen eingeben", EN: "Enter risks/impediments"}, "report.codereviews": {DE: "Code Reviews", EN: "Code reviews"}, "report.codereviews.reviewer": {DE: "Reviewer", EN: "Reviewer"}, "report.codereviews.reviewer.ph": {DE: "Reviewer eintragen", EN: "Enter reviewer"}, "report.codereviews.topic": {DE: "Thema", EN: "Topic"}, "report.codereviews.topic.ph": {DE: "Thema eintragen", EN: "Enter topic"}, "report.codereviews.content": {DE: "Ergebnis", EN: "Result"}, "report.codereviews.content.ph": {DE: "Ergenisse eintragen", EN: "Enter results"}, "report.images": {DE: "Architektur-Diagramme", EN: "Architecture diagrams"}, "report.delete.title": {DE: "Report löschen?", EN: "Delete report?"}, "report.delete.text": {DE: "Report wird unwideruflich gelöscht!", EN: "Report will be deleted permanent!"}, "report.copyof": {DE: "Dies ist eine Kopie.", EN: "This is a copy."}, back: {DE: "zurück", EN: "back"}, start: {DE: "Start", EN: "Start"}, end: {DE: "Ende", EN: "End"}, save: {DE: "Speichern", EN: "Save"}, cancel: {DE: "Abbrechen", EN: "Cancel"}, enter: {DE: "Eingeben", EN: "Enter"}, or: {DE: "oder", EN: "or"}, "file.dropzone": {DE: "Bilder hierher ziehen", EN: "Drop images"}, "propertyeditor.error.required": {DE: "Pflichtfeld", EN: "Required"}, search: {DE: "Suche", EN: "Search"}, "delete": {DE: "Löschen", EN: "Delete"}, copy: {DE: "Kopieren", EN: "Copy"}, "error.title": {DE: "Ein Fehler ist aufgetreten", EN: "An error occured"}};
        a.value("translation", b)
    }]), angular.module("PReports.services").factory("language", ["$log", "translation", function(a, b) {
        function c() {
            var b = navigator.language ? navigator.language : navigator.userLanguage;
            return a.info("browser language: " + b), ("undefined" === b || 0 == b.length) && (b = "DE"), b.substring(0, 2).toUpperCase()
        }
        var d = c(), e = {get: function() {
                return c()
            }, translate: function(a) {
                return a && b[a] ? b[a][d] || "" : ""
            }};
        return e
    }]), angular.module("PReports.services").provider("config", function() {
    var a = this;
    a.config_ = {serviceUrl: host, priceRegExp: /([0123456789]+)\.([0123456789]*)/, currencyFormats: {EUR: "$1,$2 €", USD: "$ $1.$2"}}, a.setConfig = function(b) {
        a.config_.serviceUrl = b.serviceUrl, a.config_.priceRegExp = b.priceRegExp, a.config_.currencyFormats = b.currencyFormats
    }, a.setServiceUrl = function(b) {
        a.config_.serviceUrl = b
    }, a.setPriceRegExp = function(b) {
        a.config_.priceRegExp = b
    }, a.setCurrencyFormats = function(b, c) {
        1 == arguments.length && (a.config_.currencyFormats = b), 2 == arguments.length && (a.config_.currencyFormats[b] = c)
    }, a.$get = function() {
        return a.config_
    }
}), angular.module("PReports.services").factory("errorHandler", ["$rootScope", "$location", "$log", "language", "config", function(a, b, c, d) {
        function e(b, e, f, g) {
            var h;
            arguments.length > 1 ? (h = {}, h.data = b, h.status = e, h.headers = f, h.config = g) : h = b.hasOwnProperty("data") ? b : {data: b};
            var i = h.data.errorKey, j = h.data.message;
            a.error = !0, a.errorMessage = d.translate(i) || d.translate("error." + h.status) || j || d.translate("error.general") || "Error during communication with service.", c.error("Error during http method, response object: " + angular.toJson(h))
        }
        return e.reset = function() {
            a.error = !1
        }, e
    }]), angular.module("PReports.services").factory("loadingService", function() {
    var a = {requestCount: 0, isLoading: function() {
            return a.requestCount > 0
        }};
    return a
}), angular.module("PReports.services").factory("onStartInterceptor", ["loadingService", "$rootScope", function(a, b) {
        return function(c) {
            return a.requestCount++, b.ajaxLoading = a.isLoading(), c
        }
    }]), angular.module("PReports.services").factory("onCompleteInterceptor", ["loadingService", "$rootScope", "$q", function(a, b, c) {
        return function(d) {
            return d.then(function(c) {
                return a.requestCount--, b.ajaxLoading = a.isLoading(), c
            }, function(d) {
                return a.requestCount--, b.ajaxLoading = a.isLoading(), c.reject(d)
            })
        }
    }]), angular.module("PReports.services").config(["$httpProvider", function(a) {
        a.responseInterceptors.push("onCompleteInterceptor")
    }]), angular.module("PReports.services").run(["$http", "onStartInterceptor", function(a, b) {
        a.defaults.transformRequest.push(b)
    }]), angular.module("PReports.services").factory("helper", function() {
    var a = {getFieldInputClass: function(a) {
            return a.$dirty && a.$invalid ? "error" : a.$dirty && !a.$invalid ? "success" : ""
        }};
    return a
}), angular.module("PReports.filters", []).filter("breakFilter", function() {
    return function(a) {
        return void 0 !== a ? a.replace(/\n/g, "<br />") : void 0
    }
}), angular.module("PReports.directives").directive("l", ["$locale", "language", "$interpolate", function(a, b, c) {
        return function(a, d, e) {
            function f(f) {
                f && (g = b.translate(f) || (k ? e[k] : d.html()), h = c(g), (i || angular.noop)(), i = a.$watch(h, function(a) {
                    k ? d.attr(k, a) : d.html(a)
                }))
            }
            var g, h, i, j = e.l, k = e.lAttribute;
            e.$observe("l", f), f(j)
        }
    }]), angular.module("PReports.directives").directive("simplePropertyEditor", ["$timeout", "$log", "language", "helper", function(a, b, c) {
        function d(a) {
            return c.translate(a) || a
        }
        function e(a) {
            var b, c = (a.hasOwnProperty("editorRequired") ? "required='required'" : "", a.hasOwnProperty("editorRepeat")), e = (a.hasOwnProperty("editorPattern") ? "ng-pattern='" + a.editorPattern + "'" : "", a.hasOwnProperty("editorType") ? a.editorType : "text");
            return c ? ("textarea" == e ? b = "" : ("email" != e && "password" != e && "number" != e && (e = "text"), b = '<div class="control-group" ng-class="getFieldInputClass(simplePropertyForm.repeatProperty.$invalid)"><div class="controls"><input type="' + e + '" name="repeatProperty" ng-model="editorRepeat" l-attribute="placeholder" l="propertyeditor.repeat.placeholder" required ng-change="matchInput()"></input><div class="help-inline" ng-show="simplePropertyForm.repeatProperty.$dirty && simplePropertyForm.repeatProperty.$invalid"><span ng-show="simplePropertyForm.repeatProperty.$error.required">' + d("propertyeditor.error.required") + '</span><span ng-show="simplePropertyForm.repeatProperty.$error.match">' + d("propertyeditor.error.match") + "</span></div></div></div>"), b) : ""
        }
        function f(a, b) {
            var c, e = a.hasOwnProperty("editorRequired") && !b ? "required='required'" : "", f = a.hasOwnProperty("editorPattern") ? "ng-pattern='" + a.editorPattern + "'" : "", g = a.hasOwnProperty("editorRepeat") ? "ng-change='matchInput()'" : "", h = a.hasOwnProperty("editorMaxLength") ? "maxlength='" + a.editorMaxLength + "'" : "", i = a.hasOwnProperty("editorPlaceholder") ? "placeholder='" + d(a.editorPlaceholder) + "'" : "", j = a.hasOwnProperty("editorType") ? a.editorType : "text", k = b ? "{{'simpleProperty'+" + b + "}}" : "simpleProperty", l = b ? "editorTranslations[" + b + "]" : "editorValue";
            return"textarea" == j ? c = '<textarea class="property-input" rows="4" cols="100" name="' + k + '" ng-model="' + l + '" ' + h + " " + e + " " + f + " " + i + "></textarea>" : ("email" != j && "password" != j && "number" != j && "url" != j && (j = "text"), c = '<input class="property-input" type="' + j + '" ' + i + ' name="' + k + '" ng-model="' + l + '" ' + h + " " + e + " " + f + " " + g + "></input>"), c
        }
        function g(a) {
            return a ? "error" : a ? "" : "success"
        }
        var h = {restrict: "A", replace: !1, transclude: !0, scope: {editorTitle: "@", editorPatternText: "@", editorOnSave: "&", editorEnabled: "=", editorValidate: "&", editorValidateText: "@", editorPlaceholder: "@", editorProperty: "=", editorField: "@", editorEntity: "="}, template: function(a, b) {
                var c, g = (b.hasOwnProperty("editorRequired") ? "required='required'" : "", b.hasOwnProperty("editorPattern") ? "ng-pattern='" + b.editorPattern + "'" : "", b.hasOwnProperty("editorField") ? b.editorField : null), h = b.hasOwnProperty("editorEntity") ? b.editorEntity : null;
                return c = g && h ? '<div class="toggler" ng-transclude></div><div class="simple-property-editor-mask"></div><div class="simple-property-editor" style="display:none; position:absolute; background-color:white;"><h5 class="editor-title" l="{{editorTitle}}">Edit property</h5><form name="simplePropertyForm" novalidate ng-submit="save()" class="edit-property-form"><div class="edit-property-form-inputs"><div class="control-group" ng-class="getFieldInputClass(simplePropertyForm.simpleProperty.$invalid)"><div class="controls">' + f(b) + '<i class="icon-remove icon-black" ng-click="clearInput()"></i><div class="help-inline" ng-show="simplePropertyForm.simpleProperty.$dirty && simplePropertyForm.simpleProperty.$invalid"><span ng-show="simplePropertyForm.simpleProperty.$error.required">' + d("propertyeditor.error.required") + '</span><span ng-show="simplePropertyForm.simpleProperty.$error.number">' + d("propertyeditor.error.number") + '</span><span ng-show="simplePropertyForm.simpleProperty.$error.pattern" l="{{editorPatternText}}">No valid value.</span><span ng-show="simplePropertyForm.simpleProperty.$error.custom" l="{{editorValidateText}}">No valid value.</span><span ng-show="simplePropertyForm.simpleProperty.$error.email" >+' + d("propertyeditor.error.email") + '</span></div></div></div><div ng-repeat="t in editorEntity.translations"><div class="control-group" ng-class="getFieldInputClass(simplePropertyForm.simpleProperty{{t.lang}}.$invalid)"><div class="controls"><label>{{getLanguageTitle(t.lang)}}</label>' + f(b, "t.lang") + '<i class="icon-remove icon-black" ng-click="clearInput(t.lang)"></i></div></div></div></div><div class="row-fluid" style="margin-top: 5px"><button type="button" ng-click="closeDialog()" class="btn" data-dismiss="modal" style="margin-right: 5px;">' + d("cancel") + '</button><button type="submit" class="btn btn-primary" ng-disabled="simplePropertyForm.$invalid">' + d("save") + "</button></div></form></div>" : '<div class="toggler" ng-transclude></div><div class="simple-property-editor-mask"></div><div class="simple-property-editor" style="display:none; position:absolute; background-color:white;"><h5 class="editor-title" l="{{editorTitle}}">Edit property</h5><form name="simplePropertyForm" novalidate ng-submit="save()" class="edit-property-form"><div class=""><div class="control-group" ng-class="getFieldInputClass(simplePropertyForm.simpleProperty.$invalid)"><div class="controls">' + f(b) + '<i class="icon-remove icon-black" ng-click="clearInput()"></i><div class="help-inline" ng-show="simplePropertyForm.simpleProperty.$dirty && simplePropertyForm.simpleProperty.$invalid"><span ng-show="simplePropertyForm.simpleProperty.$error.required">' + d("propertyeditor.error.required") + '</span><span ng-show="simplePropertyForm.simpleProperty.$error.number">' + d("propertyeditor.error.number") + '</span><span ng-show="simplePropertyForm.simpleProperty.$error.pattern" l="{{editorPatternText}}">No valid value.</span><span ng-show="simplePropertyForm.simpleProperty.$error.custom" l="{{editorValidateText}}">No valid value.</span><span ng-show="simplePropertyForm.simpleProperty.$error.email" >+' + d("propertyeditor.error.email") + "</span></div></div></div>" + e(b) + '</div><div class="row-fluid"><button type="button" ng-click="closeDialog()" class="btn span6" data-dismiss="modal">' + d("common.cancel") + '</button><button type="submit" class="btn btn-primary span6" ng-disabled="simplePropertyForm.$invalid">' + d("common.save") + "</button></div></form></div>"
            }, compile: function(c, d) {
                d.hasOwnProperty("editorRequired") ? "required='required'" : "", d.hasOwnProperty("editorPattern") ? "ng-pattern='" + d.editorPattern + "'" : "", d.hasOwnProperty("editorField") ? d.editorField : null, d.hasOwnProperty("editorEntity") ? d.editorEntity : null;
                return{pre: function() {
                    }, post: function(c, d, e) {
                        var f = d.find("div.simple-property-editor"), h = d.find("div.simple-property-editor-mask"), i = d.find("input.property-input, textarea.property-input"), j = c.simplePropertyForm.simpleProperty, k = e.hasOwnProperty("editorEntity");
                        e.hasOwnProperty("editorValidate") && j.$parsers.push(function(a) {
                            return c.editorValidate ? c.editorValidate({value: a}) ? (j.$setValidity("custom", !0), a) : void j.$setValidity("custom", !1) : void 0
                        }), c.save = function() {
                            c.simplePropertyForm.$valid && !c.saved && (c.saved = !0, k ? (c.editorEntity[c.editorField] = c.editorValue, angular.forEach(c.editorEntity.translations, function(a, b) {
                                a[c.editorField] = c.editorTranslations[b]
                            })) : c.editorProperty = c.editorValue, a(c.editorOnSave), h.hide(), f.hide())
                        }, c.closeDialog = function() {
                            h.hide(), f.hide()
                        }, c.clearInput = function(a) {
                            if (a) {
                                c.editorTranslations[a] = "";
                                var b = '[name="simpleProperty' + a + '"]';
                                d.find("input" + b + ".property-input, textarea" + b + ".property-input").trigger("focus")
                            } else
                                c.editorValue = "", i.trigger("focus");
                            c.editorRepeat && (c.editorRepeat = "")
                        }, c.matchInput = function() {
                            c.simplePropertyForm.simpleProperty.$viewValue !== c.simplePropertyForm.repeatProperty.$viewValue ? c.simplePropertyForm.repeatProperty.$setValidity("match", !1) : c.simplePropertyForm.repeatProperty.$setValidity("match", !0)
                        }, c.getLanguageTitle = function(a) {
                            return a ? langcodesMap[a] ? langcodesMap[a].lang : a : void 0
                        }, d.find("div.toggler").bind("click", function() {
                            if (1 == c.editorEnabled || "undefined" == typeof c.editorEnabled) {
                                c.editorRepeat = "", c.saved = !1, k ? (c.editorValue = c.editorEntity[c.editorField], c.editorTranslations = {}, angular.forEach(c.editorEntity.translations, function(a, b) {
                                    c.editorTranslations[b] = a[c.editorField]
                                })) : c.editorValue = c.editorProperty, c.$digest();
                                var a, e, g, j, l, m;
                                e = d.find("div.toggler").offset().top - d.find("div.toggler").offsetParent().offset().top, a = d.find("h5.editor-title").css("lineHeight"), a = a.replace("px", ""), l = d.find("div.value"), g = $(document).height(), j = $(window).width(), h.css({width: j, height: g}), h.show();
                                try {
                                    l && 1 == l.length && (m = l.offset().left - l.offsetParent().offset().left, f.css("left", m))
                                } catch (n) {
                                    b.error("simplePropertyEditor: failed to calculate left")
                                }
                                f.css("top", e - a - 25), f.show(), i.trigger("focus")
                            }
                        }), h.bind("click", function() {
                            c.closeDialog()
                        }), f.bind("keyup", function(a) {
                            27 == a.which && c.closeDialog()
                        }), c.getFieldInputClass = g
                    }}
            }};
        return h
    }]), angular.module("PReports.directives").directive("simpleConfirmDialog", ["language", "$log", function(a) {
        var b = {restrict: "A", replace: !1, transclude: !0, priority: 100, scope: {dialogTitle: "@", dialogText: "@", dialogOnConfirm: "&", dialogConfirmButton: "@", dialogDisabled: "=", dialogClass: "@"}, template: function(a, b) {
                var c, d = b.hasOwnProperty("dialogClass") ? b.dialogClass : "alert-info";
                return c = '<span class="toggler" ng-transclude></span><div class="modal confirm-modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">×</button><h4 l="{{dialogTitle}}">Confirm dialog</h4></div><div class="modal-body ' + d + '"><p l="{{dialogText}}"></p></div>  <div class="modal-footer"><button type="button" class="btn" data-dismiss="modal" l="cancel">Cancel</button><button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="confirm()" l="{{dialogConfirmButton}}">Confirm</button></div></div></div></div>'
            }, compile: function() {
                return{pre: function() {
                    }, post: function(a, b) {
                        var c = b.find(".simple-confirm-dialog");
                        a.confirm = function() {
                            c.modal("hide"), window.setTimeout(function() {
                                a.dialogOnConfirm()
                            }, 200)
                        }, b.find(".toggler").bind("click", function() {
                            var c;
                            a.dialogDisabled || (c = b.find(".confirm-modal"), c.modal("toggle"))
                        })
                    }}
            }};
        return b
    }]), angular.module("PReports.directives").directive("tooltip", ["$locale", "language", function(a, b) {
        return function(a, c, d) {
            var e, f = d.tooltip, g = d.tooltipPosition || "top";
            f && (e = b.translate(f) || f, e && c.tooltip({title: e, placement: g}))
        }
    }]);
