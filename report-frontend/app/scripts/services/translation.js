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
		"error.404" : {
			"DE" : "Eine Ressource konnte nicht geladen werden.",
			"EN" : "Resource not available."
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
		"reports.new" : {
			"DE" :  "Projektname",
			"EN" : "Project name"
		},
		"reports.new.button" : {
			"DE" :  "Neuer Report",
			"EN" : "New report"
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
			"DE" :  "Golive",
			"EN" : "Golive"
		},
		"report.golive.ph" : {
			"DE" :  "Golive eingeben",
			"EN" : "Enter golive"
		},
		"report.year" : {
			"DE" :  "Jahr",
			"EN" : "Year"
		},
		"report.leaddevelopers.title" : {
			"DE" :  "Lead developers",
			"EN" : "Lead developers"
		},
		"report.projectManagers.title" : {
			"DE" :  "Projektmanager",
			"EN" : "Project manager"
		},
		"report.leaddevelopers.ph" : {
			"DE" :  "Entwickler eingeben",
			"EN" : "Enter developers"
		},
		"report.projectmanagers.ph" : {
			"DE" :  "Manager eingeben",
			"EN" : "Enter manager"
		},
		"report.milestones" : {
			"DE" :  "Meilensteine",
			"EN" : "Milestones"
		},
		"report.milestones.start" : {
			"DE" :  "Meilenstein Start",
			"EN" : "Milestone start"
		},
		"report.milestones.end" : {
			"DE" :  "Meilenstein Ende",
			"EN" : "Milestone end"
		},
		"report.lastweektasks" : {
			"DE" :  "Aufgaben letzte Woche",
			"EN" : "Last week tasks"
		},
		"report.nextweektasks" : {
			"DE" :  "Aufgaben nächste Woche",
			"EN" : "Nextweek tasks"
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
		"report.images" : {
			"DE" :  "Architektur-Diagramme",
			"EN" : "Architecture diagrams"
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
		"file.dropzone" : {
			"DE" :  "Bilder hierher ziehen",
			"EN" : "Drop images"
		},
		"propertyeditor.error.required" : {
			"DE" :  "Pflichtfeld",
			"EN" : "Required"
		},
		"search" : {
			"DE" :  "Suche",
			"EN" : "Search"
		},
	};

	$provide.value("translation", map);
}]);