/** @module Cloobster/Translations */

/**
*	@name Cloobster.Translations
*	Module provides data used for translation.
*	Other modules can depend on this, and resolve service instances
*	with angulars depency injection.
*/
angular.module("PReports.translations", [], ["$provide", function($provide) {
	//holds all translations
	var map = {		
		//common error messages
		"error.image.upload" : {
			"DE" : "Bild hochladen fehlgeschlagen.",
			"EN" : "Image upload failed."
		},
		"error.404" : {
			"DE" : "404 Eine Ressource konnte nicht geladen werden.",
			"EN" : "404 Resource not available."
		},
		"error.403" : {
			"DE" : "Ungültige Zugangsdaten oder keine Zugriffsrechte.",
			"EN" : "Invalid credentials or insufficient access rights."
		},
		"error.general" : {
			"DE" : "Es gibt ein Problem mit der Verbindung zum Service.",
			"EN" : "There has been a connection problem."
		},
		"error.appengine" : {
		   "DE" : "Es liegt eine Serverstörung vor. Wir arbeiten an einer Lösung.",
	       "EN" : "The service has been temporarily interrupted. We are working on a solution."
	    },
		"common.error.footer" : {
			"DE" : "Falls dieser Fehler weiterhin besteht, konktaktieren sie <a href='mailto:support@cloobster.com'>support@cloobster.com</a>.",
			"EN" : "If this error persists, contact <a href='mailto:support@cloobster.com'>support@cloobster.com</a>."
		},
		"common.sending" : {
			"DE" :  "Sende...",
			"EN" :  "Sending..."
		},
		"common.send" : {
			"DE" :  "Sende",
			"EN" :  "Send"
		},
		"common.password.invalid" : {
			"DE" : "Passwort inkorrekt!",
			"EN" : "Password invalid!"
		},
		"common.more" : {
			"DE" :  "Mehr",
			"EN" : "More"
		},
		//reports
		"reports" : {
			"DE" :  "Reports",
			"EN" : "Reports"
		},
		"reports.back" : {
			"DE" :  "Reportliste",
			"EN" : "Reports list"
		},
		"reports.new" : {
			"DE" :  "Projektname eingeben und Neuer Report anklicken",
			"EN" : "Enter project name and click New report"
		},
		"reports.new.button" : {
			"DE" :  "Neuer Report",
			"EN" : "New report"
		},
		"reports.table.name" : {
			"DE" :  "Projektname",
			"EN" : "Project name"
		},
		"reports.table.year" : {
			"DE" :  "Jahr",
			"EN" : "Year"
		},
		"reports.table.week" : {
			"DE" :  "KW",
			"EN" : "Week"
		},
		"reports.table.images" : {
			"DE" :  "Bilder",
			"EN" : "Images"
		},
		"reports.table.actions" : {
			"DE" :  "Aktion",
			"EN" : "Action"
		},
		//report
		"report.name" : {
			"DE" :  "Projektname",
			"EN" : "Project name"
		},
		"report.start.title" : {
			"DE" :  "Start",
			"EN" : "Start"
		},
		"report.start.ph" : {
			"DE" :  "Startdatum eingeben",
			"EN" : "Enter start date"
		},
		"report.golive.title" : {
			"DE" :  "Go live",
			"EN" : "Go live"
		},
		"report.golive.ph" : {
			"DE" :  "Go live eingeben",
			"EN" : "Enter go live"
		},
		"report.year" : {
			"DE" :  "Jahr",
			"EN" : "Year"
		},
		"report.week" : {
			"DE" :  "Report Kalenderwoche",
			"EN" : "Report calendar week"
		},
		"report.leaddevelopers.title" : {
			"DE" :  "Lead developers",
			"EN" : "Lead developers"
		},
		"report.leaddevelopers.ph" : {
			"DE" :  "Entwickler eingeben",
			"EN" : "Enter developers"
		},
		"report.executivesponsor.title" : {
			"DE" :  "Executive Sponsor",
			"EN" : "Executive Sponsor"
		},
		"report.executivesponsor.ph" : {
			"DE" :  "Executive Sponsor eingeben",
			"EN" : "Enter executive sponsor"
		},
		"report.partner.title" : {
			"DE" :  "Partner",
			"EN" : "Partner"
		},
		"report.partner.ph" : {
			"DE" :  "Partner eingeben",
			"EN" : "Enter partner"
		},
		"report.projectmanagers.title" : {
			"DE" :  "Projektmanager",
			"EN" : "Project manager"
		},
		"report.projectmanagers.ph" : {
			"DE" :  "Manager eingeben",
			"EN" : "Enter manager"
		},
		"report.milestones" : {
			"DE" :  "Meilensteine",
			"EN" : "Milestones"
		},
		"report.milestones.ph" : {
			"DE" :  "Meilenstein eintragen",
			"EN" : "Enter milestone"
		},
		"report.milestones.start" : {
			"DE" :  "Meilenstein Start",
			"EN" : "Milestone start"
		},
		"report.milestones.end" : {
			"DE" :  "Meilenstein Datum",
			"EN" : "Milestone date"
		},
		"report.milestones.name" : {
			"DE" :  "Name",
			"EN" : "Name"
		},
		"report.lastweektasks" : {
			"DE" :  "Ergebnisse",
			"EN" : "Achievements"
		},
		"report.nextweektasks" : {
			"DE" :  "Nächste Aufgaben",
			"EN" : "Next objectives"
		},
		"report.tasks.ph" : {
			"DE" :  "Aufgaben eingeben",
			"EN" : "Enter tasks"
		},
		"report.potentials" : {
			"DE" :  "Identifizierte Potentiale",
			"EN" : "Identified potentials"
		},
		"report.potentials.ph" : {
			"DE" :  "Potentiale eingeben",
			"EN" : "Enter potentials"
		},
		"report.risks" : {
			"DE" :  "Risiken & Behinderungen",
			"EN" : "Risks & Impediments"
		},
		"report.risks.ph" : {
			"DE" :  "Risiken/Behinderungen eingeben",
			"EN" : "Enter risks/impediments"
		},
		"report.codereviews" : {
			"DE" :  "Code Reviews",
			"EN" : "Code reviews"
		},
		"report.codereviews.reviewer" : {
			"DE" :  "Reviewer",
			"EN" : "Reviewer"
		},
		"report.codereviews.reviewer.ph" : {
			"DE" :  "Reviewer eintragen",
			"EN" : "Enter reviewer"
		},
		"report.codereviews.topic" : {
			"DE" :  "Thema",
			"EN" : "Topic"
		},
		"report.codereviews.topic.ph" : {
			"DE" :  "Thema eintragen",
			"EN" : "Enter topic"
		},
		"report.codereviews.content" : {
			"DE" :  "Ergebnis",
			"EN" : "Result"
		},
		"report.codereviews.content.ph" : {
			"DE" :  "Ergenisse eintragen",
			"EN" : "Enter results"
		},
		"report.systems" : {
			"DE" :  "Systeme",
			"EN" : "Systems"
		},
		"report.systems.name" : {
			"DE" :  "Systemname",
			"EN" : "System name"
		},		
		"report.systems.name.ph" : {
			"DE" :  "Systemname eintragen",
			"EN" : "Enter system name"
		},
		"report.systems.url" : {
			"DE" :  "Url",
			"EN" : "Url"
		},
		"report.systems.url.ph" : {
			"DE" :  "Url eintragen (http://)",
			"EN" : "Enter url (http://)"
		},
		"report.systems.remarks" : {
			"DE" :  "Bemerkungen",
			"EN" : "Remarks"
		},
		"report.systems.remarks.ph" : {
			"DE" :  "Bemerkungen eintragen (z. B. Zugangsdaten)",
			"EN" : "Enter remarks (e.g. credentials)"
		},
		"report.images" : {
			"DE" :  "Architektur-Diagramme",
			"EN" : "Architecture diagrams"
		},
		"report.delete.title" : {
			"DE" :  "Report löschen",
			"EN" : "Delete report"
		},
		"report.delete.text" : {
			"DE" :  "Report wird unwideruflich gelöscht!",
			"EN" : "Report will be deleted permanent!"
		},
		"report.copy.title" : {
			"DE" :  "Report kopieren",
			"EN" : "Copy report"
		},
		"report.copy.text" : {
			"DE" :  "Erzeugt eine Kopie des Reports, setzt aktuelle Kalenderwoche und Jahr.",
			"EN" : "Creates a copy of this report and uses current calendar week."
		},
		"report.copyof" : {
			"DE" :  "Dies ist eine Kopie",
			"EN" : "This is a copy"
		},
		"report.lastmodified" : {
			"DE" :  "Zuletzt geändert"
		},
		"report.createdon" : {
			"DE" :  "Erzeugt am"
		},
		"report.killing.msg" : {
			"DE" :  "Lösche Report {{reportToDelete.name}} in "
		},
		"report.428.title" : {
			"DE" : "Report wure bearbeitet"
		},
		"report.428.msg" : {
			"DE" : "Der Report wurde in der Zwischenzeit bearbeitet. Sie können Neuladen und die letzte Änderung verwerfen oder"+
			 " abbrechen, Ihre letzte Änderung sichern und manuell neuladen. Der Undo Stack wurde geleert, um Überschreiben zu verhindern."
		},
		"report.428.cancel" : {
			"DE" : "Abbrechen"
		},
		"report.428.reload" : {
			"DE" : "Neuladen und verwerfen"
		},
		"report.notification" : {
			"DE" : "Empfänger für Report-Benachrichtigung",
			"EN" : "Recipients for report notification"
		},
		"report.notification.info" : {
			"DE" : "E-Mails von Personen hinzufügen, um diesen Benachrichtigungen schicken zu können.",
			"EN" : "Add emails of people you want to notify."
		},
		"report.notification.title" : {
			"DE" : "Benachrichtigung senden",
			"EN" : "Send notification"
		},
		"report.notification.text" : {
			"DE" : "Benachrichtigung an eingetragene Empfänger mit Link zu diesem Report schicken?",
			"EN" : "Send a notification to recipients with a link to this report?"
		},
		"notification.subject.template" : {
			"DE" : "Technischer Report {{name}} KW {{week}}|{{year}}",
			"EN" : "Technical report {{name}} CW {{week}}|{{year}}"
		},
		"notification.content.template" : {
			"DE" : "Der technische Report fuer {{name}} - KW {{week}}|{{year}} ist verfuegbar unter"+
			" {{url}} Dies ist eine automatisch generierte Benachrichtigung von preports.",
			"EN" : "Technical report for {{name}} - CW {{week}}|{{year}} is available under"+
			" {{url}} This is an automatically generated notification from preports."
		},
		"report.notification.recipient" : {
			"DE" : "Empfänger",
			"EN" : "Recipient"
		},
		"report.notification.recipient.ph" : {
			"DE" : "E-Mail eingeben",
			"EN" : "Enter email"
		},
		"report.signal.budget" : {
			"DE" : "Budget",
			"EN" : "Budget"
		},
		"report.signal.time" : {
			"DE" : "Time",
			"EN" : "Time"
		},
		"report.signal.quality" : {
			"DE" : "Quality",
			"EN" : "Quality"
		},
		"report.costs.table.th.title" : {
			"DE" : "K€",
			"EN" : "K€"
		},
		"report.costs.table.th.current" : {
			"DE" : "Aktuell",
			"EN" : "Current"
		},
		"report.costs.table.th.rest" : {
			"DE" : "Rest",
			"EN" : "Rest"
		},
		"report.costs.table.tr.title" : {
			"DE" : "Kosten(total)",
			"EN" : "COST(total)"
		},
		"report.costs.plan" : {
			"DE" : "Geplant",
			"EN" : "Plan"
		},
		"report.costs.plan.ph" : {
			"DE" : "Eingabe in K€",
			"EN" : "Enter in K€"
		},
		"report.costs.current.ph" : {
			"DE" : "Aktuelle Kosten",
			"EN" : "Current costs"
		},
		"report.costs.dialog.title": {
			"DE" : "Kostenberechnung in Projektstunden",
			"EN" : "Costs calculations in project hours"
		},
		"report.costs.dialog.msg": {
			"DE" : "Geben Sie die aufgewendeten Projektstunden ein.",
			"EN" : "Enter hours spend in project."
		},
		"report.dialog.costs.external" : {
			"DE" : "Extern",
			"EN" : "External"
		},
		"report.dialog.costs.internal.bi" : {
			"DE" : "Intern BI",
			"EN" : "Internal BI"
		},
		"report.dialog.costs.internal.iquest" : {
			"DE" : "Intern iQuest",
			"EN" : "Internal iQuest"
		},
		"report.ordernumber.title": {
			"DE" : "#Order",
			"EN" : "#Order"
		},
		"report.ordernumber.ph": {
			"DE" : "SAP Nummer eingeben",
			"EN" : "Enter SAP number"
		},
		"report.time.plan.title": {
			"DE" : "Plan",
			"EN" : "Plan"
		},
		"report.time.current.title": {
			"DE" : "Aktuell",
			"EN" : "Current"
		},
		"report.time.plan": {
			"DE" : "Plan",
			"EN" : "Plan"
		},
		"report.time.plan.ph": {
			"DE" : "Geplanter GoLive",
			"EN" : "Planned GoLive"
		},
		"report.time.current": {
			"DE" : "Aktuell",
			"EN" : "Current"
		},
		"report.time.current.ph": {
			"DE" : "Aktueller GoLive",
			"EN" : "Current GoLive"
		},
		"report.time.time.title": {
			"DE" : "Zeit",
			"EN" : "Time"
		},
		//general
		"back" : {
			"DE" :  "zurück",
			"EN" : "back"
		},
		"start" : {
			"DE" :  "Start",
			"EN" : "Start"
		},
		"end" : {
			"DE" :  "Ende",
			"EN" : "End"
		},
		"save" : {
			"DE" :  "Speichern",
			"EN" : "Save"
		},
		"cancel" : {
			"DE" :  "Abbrechen",
			"EN" : "Cancel"
		},
		"enter" : {
			"DE" :  "Eingeben",
			"EN" : "Enter"
		},
		"or" : {
			"DE" :  "oder",
			"EN" : "or"
		},
		"all" : {
			"DE" :  "alle",
			"EN" : "all"
		},
		"file.dropzone" : {
			"DE" :  "Bilder hierher ziehen",
			"EN" : "Drop images"
		},		
		"search" : {
			"DE" :  "Suche",
			"EN" : "Search"
		},
		"delete" : {
			"DE" :  "Löschen",
			"EN" : "Delete"
		},
		"copy" : {
			"DE" :  "Kopieren",
			"EN" : "Copy"
		},
		"error.title" : {
			"DE" :  "Ein Fehler ist aufgetreten",
			"EN" : "An error occured"
		},
		"undo" : {
			"DE" :  "Rückgängig"
		},
		"next" : {
			"DE" : "Nächste"
		},
		"prev" : {
			"DE" : "Vorherige"
		},
		"send" : {
			"DE" : "Senden",
			"EN" : "Send"
		},
		"name" : {
			"DE" : "Name",
			"EN" : "Name"
		},
		"date" : {
			"DE" :  "Datum",
			"EN" : "Date"
		},
		"milestone" : {
			"DE" :  "Meilenstein",
			"EN" : "Milestone"
		},
		//Property editor
		"propertyeditor.error.required" : {
			"DE" :  "Pflichtfeld",
			"EN" : "Required"
		},
		"propertyeditor.error.email" : {
			"DE" : "Bitte gültige E-Mail eingeben.",
			"EN" : "Please enter a valid email."
		}
	};

	$provide.value("translation", map);
}]);