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
		//index
		"product.brand" : {
			"DE" : "cloobster",
			"EN" : "cloobster"
		},
		"nav.logout" : {
			"DE" : "Logout",
			"EN" : "Logout"
		},
		"login.title" : {
			"DE" : "Login für Geschäftskunden",
			"EN": "Login für corporate customers"
		},
		"nav.restaurants" : {
			"DE" : "Administration",
			"EN" : "Administration"
		},
		"nav.menus" : {
			"DE" : "Produkte",
			"EN" : "Products"
		},
		"nav.about" : {
			"DE" : "Über",
			"EN": "About"
		},
		"nav.profile" : {
			"DE" : "Profil",
			"EN" : "Profile"
		},
		"nav.registration" : {
			"DE" : "Registrieren",
			"EN" : "Register"
		},
		"nav.accounts" : {
			"DE" : "Benutzerkonten",
			"EN" : "User accounts"
		},
		"home.signup" : {
			"DE" :  "Zur Registrierung!",
			"EN" : "Sign up!"
		},
		"home.notregistered" : {
			"DE" :  "In 5 Schritten Ihre eigene App Präsenz gestalten!<br>Jetzt registrieren und 30 Tage kostenfrei und unverbindlich ausprobieren.",
			"EN" : "Create your app in 5 simple steps.<br/>Register now and get your first month for free."
		},
		//businesses header partial
		"businesses.headertabs.howto" : {
			"DE" :  "Assistent",
			"EN" : "Wizard"
		},
		"businesses.headertabs.location" : {
			"DE" :  "Locations",
			"EN" : "Locations"
		},
		"businesses.headertabs.locationsettings" : {
			"DE" :  "Einstellungen",
			"EN" : "Settings"
		},
		"businesses.headertabs.categories" : {
			"DE" : "Angebote",
			"EN" : "Offers"
		},
		"businesses.headertabs.accounts" : {
			"DE" :  "Benutzerkonten",
			"EN" : "User Accounts"
		},
		"businesses.headertabs.activation" : {
			"DE" :  "Angebote zuweisen",
			"EN" : "Assign offers"
		},
		"businesses.headertabs.areas" : {
			"DE" :  "QR Codes",
			"EN" : "QR Codes"
		},
		"businesses.headertabs.infopages" : {
			"DE" :  "Info-Seiten",
			"EN" :  "Info Pages"
		},
		"businesses.headertabs.documents" : {
			"DE" :  "Dokumente",
			"EN" : "Documents"
		},
		"businesses.headertabs.appconfig" : {
			"DE" : "App gestalten",
			"EN" : "Customize App"
		},
		"businesses.headertabs.externals" : {
			"DE" :  "Externe Partner",
			"EN" : "External partners"
		},
		//registration partial
		"registration.title" : {
			"DE" : "cloobster Registrierung",
			"EN" : "cloobster Registration"
		},
		"registration.form.fullname" : {
			"DE" : "Name*",
			"EN" : "Name*"
		},
		"registration.form.fullname.error.required" : {
			"DE" : "Bitte teilen Sie uns ihren Namen mit.",
			"EN" : "Tell us your name."
		},
		"registration.form.fullname.error.minlength" : {
			"DE" : "Der Name muss min. aus 3 Zeichen bestehen",
			"EN" : "Name must consist at least of 3 characters."
		},
		"registration.form.login" : {
			"DE" : "Benutzername*",
			"EN" : "User name*"
		},
		"registration.form.login.error.required" : {
			"DE" : "Suchen Sie sich bitte einen Benutzernamen aus.",
			"EN" : "Select a user name."
		},
		"registration.form.login.error.pattern" : {
			"DE" : 'Ihr Benutzername muss zwischen 4-30 Zeichen lang sein. Es sind nur Kleinbuchstaben, "_", "-" und "." erlaubt.',
			"EN" : 'Your username must consist of 4-30 characters. Only lowercase letters, "_", "-", and "." are permittet.'
		},
		"registration.form.email" : {
			"DE" : "E-Mail*",
			"EN" : "Email*"
		},
		"registration.form.email.error.required" : {
			"DE" : "Bitte geben Sie Ihre E-Mail an.",
			"EN" : "Please enter your email address."
		},
		"registration.form.email.error.email" : {
			"DE" : "Keine gültige E-Mail.",
			"EN" : "No valid email address."
		},
		"registration.form.emailrepeat" : {
			"DE" : "E-Mail wiederholen*",
			"EN" : "Repeat email address*"
		},
		"registration.form.emailrepeat.error.match" : {
			"DE" : "E-Mails stimmen nicht überein.",
			"EN" : "Email address does not match."
		},
		"registration.form.password" : {
			"DE" : "Passwort*",
			"EN" : "Password*"
		},
		"registration.form.password.error.required" : {
			"DE" : "Bitte wählen Sie ein Passwort.",
			"EN" : "Please enter a password."
		},
		"registration.form.password.error.pattern" : {
			"DE" : "Min. 6 Zeichen. Muss einen Buchstaben und eine Ziffer oder Sonderzeichen besitzen.",
			"EN" : "Min. 6 characters. Must contain one letter and one number or special character."
		},
		"registration.form.passwordrepeat" : {
			"DE" : "Passwort wiederholen*",
			"EN" : "Repeat password*"
		},
		"registration.form.passwordrepeat.error.match" : {
			"DE" : "Passwörter stimmen nicht überein.",
			"EN" : "Passwords don't match."
		},
		"registration.form.phone" : {
			"DE" : "Telefon*",
			"EN" : "Phone*"
		},
		"registration.form.phone.error.required" : {
			"DE" : "Bitte geben Sie eine Telefonnummer für Rückfragen an.",
			"EN" : "Please enter a phone number, so you we can call you back."
		},
		"registration.form.company" : {
			"DE" : "Firmenname*",
			"EN" : "Company name*"
		},
		"registration.form.company.error.required" : {
			"DE" : "Bitte geben Sie den Namen Ihrer Firma an.",
			"EN" : "Please enter company name."
		},
		"registration.form.address" : {
			"DE" : "Straße",
			"EN" : "Street"
		},
		"registration.form.address.error.required" : {
			"DE" : "Bitte geben Sie Ihre Adresse an.",
			"EN" : "Please enter address."
		},
		"registration.form.city" : {
			"DE" : "Stadt",
			"EN" : "City"
		},
		"registration.form.city.error.required" : {
			"DE" : "Bitte geben Sie Ihre Stadt an.",
			"EN" : "Please enter city."
		},
		"registration.form.postcode" : {
			"DE" : "Postleitzahl",
			"EN" : "Zipcode"
		},
		"registration.form.postcode.error.required" : {
			"DE" : "Bitte geben Sie Ihre Postleitzahl an.",
			"EN" : "Please enter zip code."
		},
		"registration.form.businessphone" : {
			"DE" : "Telefon Firma",
			"EN" : "Phone (business)"
		},
		"registration.form.country" : {
			"DE" : "Land",
			"EN" : "Country"
		},
		"registration.form.country.error.required" : {
			"DE" : "Bitte geben Sie Ihr Land an.",
			"EN" : "Please enter country."
		},
		"registration.form.fullname.placeholder" : {
			"DE" : "z.B. Max Mustermann",
			"EN" : "e.g. John Doe"
		},
		"registration.form.login.placeholder" : {
			"DE" : "z.B. mustermann63",
			"EN" : "e.g. jdoe63"
		},
		"registration.form.email.placeholder" : {
			"DE" : "z.B. mustermann@gmail.com",
			"EN" : "e.g. johndoe@gmail.com"
		},
		"registration.form.emailrepeat.placeholder" : {
			"DE" : "E-Mail wiederholen",
			"EN" : "Repeat email address"
		},
		"registration.form.password.placeholder" : {
			"DE" : "Passwort",
			"EN" : "Password"
		},
		"registration.form.passwordrepeat.placeholder" : {
			"DE" : "Passwort wiederholen",
			"EN" : "Repeat password"
		},
		"registration.form.phone.placeholder" : {
			"DE" : "z.B. 0049-170-4153172",
			"EN" : "e.g. 0049-170-4153172"
		},
		"registration.form.company.placeholder" : {
			"DE" : "z.B. ACME Hotel",
			"EN" : "e.g. ACME Hotel"
		},
		"registration.form.address.placeholder" : {
			"DE" : "z.B. Bahnhofstraße 3",
			"EN" : "e.g. Mainstreet 3"
		},
		"registration.form.city.placeholder" : {
			"DE" : "z.B. Frankfurt",
			"EN" : "e.g. London"
		},
		"registration.form.postcode.placeholder" : {
			"DE" : "z.B. 60311",
			"EN" : "e.g. W11"
		},
		"registration.form.businessphone.placeholder" : {
			"DE" : "z.B. 0049-170-4153172",
			"EN" : "e.g. 0049-170-4153172"
		},
		"location.placeholder.description" : {
			"DE" :  "z.B. In der Nähe von Frankfurt gelegen, zählen wir zu den besten Spa Hotels der Region!",
			"EN" : "e.g. An Iconic 5* hotel providing 21st century comforts against a backdrop of exquisitely restored splendor."
		},
		"location.placeholder.slogan" : {
			"DE" :  "z.B. Service at its Peak!",
			"EN" : "e.g. Service at its Peak!"
		},
		"location.placeholder.url" : {
			"DE" :  "z.B. http://www.example.com",
			"EN" : "e.g. http://www.example.com"
		},
		"registration.action.fblogin" : {
			"DE" : "Mit Facebook einloggen und cloobster verknüpfen.",
			"EN" : "Log in to Facebook and link with cloobster."
		},
		"registration.form.account.label" : {
			"DE" : "Meine Benutzerdaten",
			"EN" : "My data"
		},
		"registration.form.action.reset" : {
			"DE" : "Zurücksetzen",
			"EN" : "Reset"
		},
		"registration.form.action.register" : {
			"DE" : "Registrieren",
			"EN" : "Register"
		},
		"registration.form.terms" : {
			"DE" : 'Allgemeine Geschäftsbedinungen (AGB) und Datenschutzbestimmung',
			"EN" : 'Terms Of Service and Privacy Policy'
		},
		"registration.form.acceptterms" : {
			"DE" : "Hiermit akzeptiere ich die AGB und Datenschutzbestimmung der Karazy GmbH",
			"EN" : "I hereby accept the Terms Of Service and Privacy Policy "
		},
		"registration.form.accept-terms.error.required" : {
			"DE" : "Bitte akzeptieren Sie die AGB und Datenschutzbestimmung, um fortzufahren.",
			"EN" : "Please accept the Terms Of Service and Privacy Policy to continue."
		},
		"registration.form.action.register.tooltip" : {
			"DE" : "Für die Registrierung bitte alle Pflichtfelder ausfüllen.",
			"EN" : "Please enter all mandatory fields to complete registration."
		},
		"registration.form.company.label" : {
			"DE" : "Meine Firmendaten",
			"EN" : "My company data"
		},
		"registration.form.submit.message" : {
			"DE" : "Vielen dank für die Registrierung {{account.name}},<br/>"+
				"eine E-mail mit Bestätigungslink wurde an {{account.email}} gesendet.",
			"EN" : "Thank you for your registration, {{account.name}}.<br/>"+
				"An email with an activation link will be sent to {{account.email}}."
		},
		"registration.confirmemail.title" : {
			"DE" : "E-Mail-Adresse bestätigt",
			"EN" : "E-mail address has been confirmed."
		},
		"registration.confirmemail.message" : {
			"DE" : "Vielen Dank, die E-Mail-Adresse wurde bestätigt, und das Konto kann ab sofort genutzt werden.",
			"EN" : "Thank you, your e-mail address has been confirmed and your account can now be used."
		},
		"registration.form.requiredfield" : {
			"DE" :  "* Pflichtfeld",
			"EN" : "* required field"
		},
		"registration.success.title" : {
			"DE" :  "cloobster Registrierung erfolgreich!",
			"EN" :  "cloobster registration successful!"
		},
		"registrationForm.fields.optional" : {
			"DE" :  "(optionale Angaben)",
			"EN" : "(optional Information)"
		},
		//businesses partial
		"businesses.title" : {
			"DE" : "Meine Locations",
			"EN" : "My Locations"
		},
		"businesses.empty.description" : {
			"DE" :  "Im Moment haben Sie keine gespeicherten Locations. Um cloobster zu nutzen, müssen Sie mindestens eine Location (Hotel, Restaurant) anlegen.",
			"EN" : "You have no current locations. You need at least one location (hotel, restaurant) to use cloobster."
		},
		"businesses.description" : {
			"DE" :  "Hier können Sie Ihre unterschiedlichen Locations verwalten und für cloobster vorbereiten.",
			"EN" :  "You can add, edit, or delete your locations here."
		},
		"businesses.add" : {
			"DE" : "Location hinzufügen",
			"EN" : "Add location"
		},
		"businesses.add.title" : {
			"DE" : "Location hinzufügen",
			"EN" : "Add location"
		},
		"businesses.action.show" : {
			"DE" : "Einstellungen",
			"EN" : "Settings"
		},
		"businesses.action.menus" : {
			"DE" : "Angebote",
			"EN" : "Offers"
		},
		"businesses.action.documents" : {
			"DE" :  "Dokumente",
			"EN" : "Documents"
		},
		"businesses.action.infopages" : {
			"DE" :  "Info-Seiten",
			"EN" :  "Info pages"
		},
		"businesses.action.accounts" : {
			"DE" : "Benutzerverwaltung",
			"EN" : "User management"
		},
		"businesses.action.delete" : {
			"DE" : "Location löschen",
			"EN" : "Delete location"
		},
		"businesses.action.activate" : {
			"DE" :  "Zuweisen",
			"EN" : "Assign"
		},
		"businesses.form.name" : {
			"DE" : "Name*",
			"EN" : "Name*"
		},
		"businesses.form.description" : {
			"DE" : "Beschreibung*",
			"EN" : "Description*"
		},
		"businesses.form.address" : {
			"DE" : "Addresse*",
			"EN" : "Address*"
		},
		"businesses.form.city" : {
			"DE" : "Stadt*",
			"EN" : "City*"
		},
		"businesses.form.postcode" : {
			"DE" : "Postleitzahl*",
			"EN" : "Zip code*"
		},
		"businesses.form.phone" : {
			"DE" : "Telefon",
			"EN" : "Phone"
		},
		"businesses.form.currency" : {
			"DE" : "Währung",
			"EN" : "Currency"
		},
		"businesses.form.error.required" : {
			"DE" : "Bitte füllen Sie das Feld aus.",
			"EN" : "Please fill out this field."
		},
		"businesses.form.mandatory" : {
			"DE" : "Felder markiert mit * sind Pflicht.",
			"EN" : "Fields marked with * are mandatory."
		},
		"businesses.dialog.delete" : {
			"DE" : "Location löschen",
			"EN" : "Delete location"
		},
		"busineses.business.deleted.tooltip" : {
			"DE" : "Diese Location wurde gelöscht.",
			"EN" : "This location has been deleted."
		},
		"businesses.new.name.placeholder" : {
			"DE" :  "z.B. Hotel goldener Palast",
			"EN" : "e.g. Hotel golden Palace"
		},
		"business.new.title" : {
			"DE" :  "Neue Location",
			"EN" : "New Location"
		},
		"business.new.text" : {
			"DE" :  "Möchten Sie eine neue Location anlegen?",
			"EN" : "Do you want to add a new Location?"
		},
		//business detail partial
		"business.detail.help" : {
			"DE" :  "Hier können Sie das Profil der aktiven Location pflegen.<br/>Außerdem können Sie hier die Oberfläche der App konfigurieren.",
			"EN" : "Edit properties of current location.<br/>Configure corporate identity for app."
		},
		"business.help.paymentmethod.popover" : {
			"DE" :  "Legen Sie hier fest, welche Möglichkeiten der Gast hat, den Check-In abzuschliessen (Z. B. auf Hotelrechnung, Bar).",
			"EN" : "Here you can define the options a customer has to complete the check-in (e.g. hotel bill, cash)."
		},
		"business.help.coordinates.popover" : {
			"DE" : "Koordinaten werden aus der Addresse generiert, und können manuell per Klick auf die Karte unten angepasst werden.",
			"EN" : "Coordinates are generated from the location address and can be manually modified by clicking on the map below."
		},
		"business.action.edit.enable" : {
			"DE" : "Location editieren",
			"EN" : "Enable edit mode"
		},
		"business.action.edit.disabled" : {
			"DE" : "Editiermodus beenden",
			"EN" : "Disable edit mode"
		},
		"business.action.edit.disable.hint" : {
			"DE" : "Profileigenschaft anklicken, um zu editieren.",
			"EN" : "Select profile properties to edit"
		},
		"business.detail.section.profile" : {
			"DE" :  "Location Profil",
			"EN" :  "Location profile"
		},
		"business.detail.add.image.button" : {
			"DE" :  "Bild hinzufügen",
			"EN" :  "Add image"
		},
		"business.detail.logo.editor.title" : {
			"DE" : "Logo",
			"EN" : "Logo"
		},
		"business.detail.picture1.editor.title" : {
			"DE" : "Profilbild 1",
			"EN" : "Profile picture 1"
		},
		"business.detail.picture2.editor.title" : {
			"DE" : "Profilbild 2",
			"EN" : "Profile picture 2"
		},
		"business.detail.picture3.editor.title" : {
			"DE" : "Profilbild 3",
			"EN" : "Profile picture 3"
		},
		"business.detail.logo" : {
			"DE" :  "Logo Bild",
			"EN" : "Logo picture"
		},
		"business.detail.logo.button" : {
			"DE" : "Logo hinzufügen",
			"EN" : "Add logo"
		},
		"business.detail.section.pictures" : {
			"DE" :  "Profilbilder hochladen",
			"EN" : "Upload profile pictures"
		},
		"business.detail.picture1.button" : {
			"DE" : "Profilbild 1 hinzufügen",
			"EN" : "Add profile picture 1"
		},
		"business.detail.picture2.button" : {
			"DE" : "Profilbild 2 hinzufügen",
			"EN" : "Add profile picture 2"
		},
		"business.detail.picture3.button" : {
			"DE" : "Profilbild 3 hinzufügen",
			"EN" : "Add profile picture 3"
		},
		"business.detail.picture.edit" : {
			"DE" : "Bild anklicken zum editieren.",
			"EN" : "Click picture to edit."
		},
		"business.detail.name" : {
			"DE" : "Name",
			"EN" : "Name"
		},
		"business.detail.description" : {
			"DE" : "Beschreibung",
			"EN" : "Description"
		},
		"business.detail.slogan" : {
			"DE" : "Slogan",
			"EN" : "Slogan"
		},
		"business.detail.url" : {
			"DE" : "Webseite",
			"EN" : "Website"
		},
		"business.detail.stars" : {
			"DE" :  "Sterne",
			"EN" : "Stars"
		},
		"business.detail.address" : {
			"DE" : "Adresse",
			"EN" : "Address"
		},
		"business.detail.city" : {
			"DE" : "Stadt",
			"EN" : "City"
		},
		"business.detail.postcode" : {
			"DE" : "Postleitzahl",
			"EN" : "Zip code"
		},
		"business.detail.coordinates" : {
			"DE" : "Koordinaten",
			"EN" : "Coordinates"
		},
		"business.detail.phone" : {
			"DE" : "Telefon",
			"EN" : "Phone"
		},
		"business.detail.currency" : {
			"DE" : "Währung",
			"EN" : "Currency"
		},
		"business.detail.paymentmethod" : {
			"DE" : "Bezahlart",
			"EN" : "Payment method"
		},
		"business.detail.paymentmethods" : {
			"DE" : "Bezahlarten",
			"EN" : "Payment methods"
		},
		"business.detail.paymentmethods.list.new" : {
			"DE" : "Neue Bezahlart",
			"EN" : "New payment"
		},
		"business.detail.section.app" : {
			"DE" :  "App Dashboard",
			"EN" : "App Dashboard"
		},
		"business.detail.section.app.description" : {
			"DE" :  "Konfigurieren Sie das Aussehen der cloobster App, um es an Ihre CI anzupassen.",
			"EN" : "Configure cloobster app to best fit your corporate identity."
		},
		"business.detail.app.header" : {
			"DE" :  "App Header Bild ",
			"EN" :  "App header image"
		},
		"business.detail.app.header.description" : {
			"DE" : "Für ein optimales Aussehen der App wird das Bild auf ein festes Seitenverhältnis zugeschnitten.<br>Wählen Sie mit dem Rahmen einen Ausschnitt.",
			"EN" : "To fit your app the image will have to be cropped.<br>Change aspect ratio below."
		},
		"business.detail.themes" : {
			"DE" : "Themes",
			"EN" : "Themes"
		},
		"business.detail.themes.description" : {
			"DE" : "Wählen Sie das Motiv, das am besten zu Ihrer CI passt.",
			"EN" : "Choose a theme which best fits your corporate identity."
		},
		"business.detail.themes.tooltip" : {
			"DE" : "Bitte klicken, um Motiv zu aktivieren.",
			"EN" : "Click to activate theme."
		},
		"business.detail.themes.default.description" : {
			"DE" :  "Das Standard-cloobster-Motiv",
			"EN" :  "Default cloobster theme"
		},
		"business.detail.themes.red.description" : {
			"DE" :  "Ein rotes und elegantes Motiv",
			"EN" :  "A red and elegant theme"
		},
		"business.detail.themes.green.description" : {
			"DE" :  "Ein grünes und freundliches Motiv",
			"EN" :  "A green and friendly theme"
		},
		"business.detail.themes.blue.description" : {
			"DE" :  "Ein blaues und luftiges Motiv",
			"EN" :  "A blue and breezy theme"
		},
		"business.detail.themes.blackpink.description" : {
			"DE" :  "Ein ausgeflipptes schwarz-pink Motiv",
			"EN" :  "A funky black and pink theme"
		},
		"business.detail.themes.bluegold.description" : {
			"DE" :  "Ein edles blau-golden Motiv",
			"EN" : "A noble blue-gold theme"
		},
		"business.detail.section.facebook" : {
			"DE" :  "Facebook Konfiguration",
			"EN" :  "Facebook configuration"
		},
		"business.detail.section.facebook.description" : {
			"DE" : "Hier können Sie konfigurieren, wie Posts in Facebook dargestellt werden.",
			"EN" : "Configure appearance of facebook posts here."
		},
		"business.detail.facebook.url" : {
			"DE" :  "Facebook Link",
			"EN" :  "Facebook link"
		},
		"business.detail.facebook.wallpost.image" : {
			"DE" :  "Pinwand Bild",
			"EN" :  "Wallpost image"
		},
		"business.detail.facebook.wallpost.image.description"  : {
			"DE" : "Für ein optimales Aussehen in einem Facebook-Post wird das Bild auf ein festes Seitenverhältnis zugeschnitten.<br>Wählen Sie mit dem Rahmen einen Ausschnitt.",
			"EN" : "Image needs to be cropped.<br>Change aspect ratio below."
		},
		"business.action.delete.invalid" : {
			"DE" : "Passwort inkorrekt!",
			"EN" : "Password invalid!"
		},
		"business.dialog.delete.text" : {
		"DE" : "Sie sind dabei, <strong>{{activeBusiness.name}}</strong> zu löschen! Die Location wird deaktiviert und in einen Lesemodus versetzt. "+
			"Aktuell eingeloggte Servicekräfte und Gäste können noch Bestellungen einsehen, aber keine weitere Aktionen tätigen. Die Location "+
			" wird nach einer Weile permanent gelöscht!",
		"EN" : "You are about to delete <strong>{{activeBusiness.name}}</strong>! Location will be read-only after it has been deleted and will be permanently removed shortly afterwards."
		},
		"dialog.delete.confirm" : {
			"DE" : "Bitte geben Sie Ihr Passwort ein, um die Löschaktion zu bestätigen.",
			"EN" : "Please enter your password to confirm deletion."
		},
		"business.languageselection.title" : {
			"DE" :  "Sprachauswahl",
			"EN" :  "Select language"
		},
		"business.languageselection.description" : {
			"DE" :  "Wählen Sie die Sprachen aus, die Sie in cloobster anbieten wollen.<br/>Sie können dann in Bereichen, die Mehrsprachigkeit "+
			"unterstützen, mittels einer Auswahlliste (rechts oben) die jeweilige Sprache, die Sie pflegen wollen, auswählen.<br/>"+
			"Nicht übersetzte Felder werden dem Kunden in der Standardsprache angezeigt.",
			"EN" : "Please select languages you want to offer in cloobster app.<br/>You can select a language for each location using the drop-down menu in the upper right corner.<br/>Fields that have not been translated will be shown in the default language."
		},
		"business.detail.section.subscription" : {
			"DE" :  "Paket Verwaltung",
			"EN" : "Subscription Management"
		},
		"business.detail.section.subscription.description" : {
			"DE" :  "Hier können Sie ihr cloobster Paket verwalten. Im Basis Paket sind die Funktionen"+
				" Bestellen, Feedback und VIP Call nicht vergübar.",
			"EN" : "Manage your cloobster subscription. Basic subscription does not support Ordering, Feedback and VIP call."
		},
		"business.detail.subscription.pending.description" : {
			"DE" :  "Eine Anfrage zum Wechsel in Paket <strong>{{pendingSubscription.name}}</strong> läuft.",
			"EN" : "A change request for subscription <strong>{{pendingSubscription.name}}</strong> is running."
		},
		"business.detail.subscription.cancel.error" : {
			"DE" :  "Ihre Anfrage wurde bereits vom cloobster Support bearbeitet und kann nicht angebrochen werden.",
			"EN" : "Your request already has been processed by cloobster support and can't be canceled."
		},
		"business.detail.subscription.th.subscription" : {
			"DE" :  "Paket",
			"EN" : "Subscription"
		},
		"business.detail.subscription.th.spots" : {
			"DE" :  "Maximale nutzbare Spots",
			"EN" : "Maximum usable spots"
		},
		"business.detail.subscription.th.fee" : {
			"DE" :  "Kosten pro Monat",
			"EN" : "Cost per month"
		},
		"business.detail.subscription.th.action" : {
			"DE" :  "Aktion",
			"EN" : "Action"
		},
		"business.detail.subscription.change" : {
			"DE" :  "Wechsel anfordern",
			"EN" : "Change request"
		},
		"business.detail.subscription.subscribed" : {
			"DE" :  "Ihr aktuelles Paket",
			"EN" : "Your current subscription"
		},
		"business.detail.subscription.pending" : {
			"DE" :  "Laufende Anfrage",
			"EN" : "Pending subscription"
		},
		"business.detail.subscription.upgrade.title" : {
			"DE" :  "Wechseln Sie heute!",
			"EN" : "Upgrade today!"
		},
		"business.detail.subscription.upgrade.description" : {
			"DE" :  '<span class="label label-important">Basis</span> Momentan haben Sie ein Basis Paket.<br/>'+ 
			'Wechseln Sie auf ein anderes Paket um alle cloobster Funktionen zu nutzen. '+ 
			'<a href="http://www.cloobster.com" target="_blank">Mehr Information</a>',
			"EN" : '<span class="label label-important">Basic</span> Currently you are using a basic subscription.<br/>'+ 
			'Upgrade to another cloobster subscription to gain access to all funtions. '+ 
			'<a href="http://www.cloobster.com" target="_blank">Learn more</a>'
		},
		"subscription.basic" : {
			"DE" :  "Basis",
			"EN" : "Basic"
		},
		"business.detail.subscription.unlimited" : {
			"DE" :  "unbegrenzt",
			"EN" : "unlimited"
		},
		"business.detail.subscriptioncounter.title" : {
			"DE" :  "Benutzte Spots",
			"EN" : "Used spots"
		},
		"business.detail.subscription.change.text" : {
			"DE" :  "Paketwechsel anfordern?",
			"EN" : "Request subscription change?"
		},
		"business.detail.subscription.cancel" : {
			"DE" :  "Anfrage widerrufen",
			"EN" : "Cancel request?"
		},
		"business.detail.subscription.cancel.text" : {
			"DE" :  "Möchten Sie die Anfrage widerrufen?",
			"EN" : "Do you want to cancel your request?"
		},
		"business.detail.section.cockpit" : {
			"DE" :  "Benachrichtigungen",
			"EN" : "Notifications"
		},
		"business.detail.cockpitsettings.offlinealert" : {
			"DE" : "Verbindungs- abbrüche",
			"EN" : "Connection Loss"
		},
		"business.detail.cockpitsettings.offlinealert.description" : {
			"DE" :  "Eine E-Mail wird versendet, wenn Probleme mit dem Cockpit auftreten. Dazu gehören Verbindungsabbrüche oder unbeabsichtigtes schliessen des Cockpits.",
			"EN" : "The system will send an e-mail, if it detects a connection problem or the client was closed accidently and is offline for more than 30 minutes."
		},
		"business.detail.cockpitsettings.inactivecheckinnotification" : {
			"DE" : "Inaktiven Checkins",
			"EN" : "Inactive Checkins"
		},
		"business.detail.cockpitsettings.inactivecheckinnotification.description" : {
			"DE" : "Offene Cockpits werden benachrichtigt, falls es CheckIns gibt die über 48 Stunden inaktiv waren.",
			"EN" : "The system will notify open cockpits, if there have been checkins inactive for over 48 hours."
		},

		"business.detail.cockpitsettings.ordermailnotification" : {
			"DE" : "Eingehende Bestellungen (E-Mail)",
			"EN" : "Incoming Orders (e-mail)"
		},
		"business.detail.cockpitsettings.ordermailnotification.description" : {
			"DE" : "Eine E-Mail wird bei Eingang von neuen Bestellungen an die eingetragene Addresse geschickt.",
			"EN" : "An e-mail will be send to the configured address for incoming orders."
		},
		//profile partial
		"profile.title" : {
			"DE" : "Profil",
			"EN" : "Profile"
		},
		"profile.description" : {
			"DE" :  "Hier können Sie Ihr Profil anpassen.",
			"EN" : "Here you can edit your profile information."
		},
		"profile.account.title" : {
			"DE" :  "Accountdaten",
			"EN" : "Account Data"
		},
		"profile.account.login" : {
			"DE" :  "Benutzername",
			"EN" : "User name"
		},
		"profile.account.name" : {
			"DE" : "Name",
			"EN" : "Name"
		},
		"profile.account.email" : {
			"DE" : "E-Mail",
			"EN" : "Email"
		},
		"profile.company.action.edit.enable" : {
			"DE" : "Firmenprofil bearbeiten",
			"EN" : "Edit company profile"
		},
		"profile.company.action.edit.disable" : {
			"DE" : "Bearbeiten beenden",
			"EN" : "Done editing"
		},
		"profile.account.action.changepassword" : {
			"DE" : "Passwort ändern",
			"EN" : "Change password"
		},
		"profile.account.action.edit.enable" : {
			"DE" : "Konto bearbeiten",
			"EN" : "Edit account"
		},
		"profile.account.action.edit.disable.hint" : {
			"DE" : "Kontoeigenschaft anklicken, um dieses zu editieren.",
			"EN" : "Click to edit account profile."
		},
		"profile.account.action.edit.disable" : {
			"DE" : "Bearbeiten beenden",
			"EN" : "Done editing"
		},
		"profile.company.action.edit.disable.hint" : {
			"DE" : "Profileigenschaft anklicken, um zu editieren.",
			"EN" : "Click to edit property."
		},
		"profile.company.title" : {
			"DE" :  "Firmendaten",
			"EN" : "Company Data"
		},
		"profile.company.name" : {
			"DE" :  "Firmenname",
			"EN" : "Company name"
		},
		"profile.company.address" : {
			"DE" : "Adresse",
			"EN" : "Address"
		},
		"profile.company.city" : {
			"DE" : "Stadt",
			"EN" : "City"
		},
		"profile.company.postcode" : {
			"DE" : "Postleitzahl",
			"EN" : "Zip code"
		},
		"profile.company.phone" : {
			"DE" : "Telefon",
			"EN" : "Phone"
		},
		"profile.company.url" : {
			"DE" : "Homepage",
			"EN" : "Website"
		},
		"profile.company.country" : {
			"DE" : "Land",
			"EN" : "Country"
		},
		"profile.company.address.editor.title" : {
			"DE" : "Adresse",
			"EN" : "Address"
		},
		"profile.company.city.editor.title" : {
			"DE" : "Stadt",
			"EN" : "City"
		},
		"profile.company.postcode.editor.title" : {
			"DE" : "Postleitzahl",
			"EN" : "Zipcode"
		},
		"profile.company.phone.editor.title" : {
			"DE" : "Telefon",
			"EN" : "Phone"
		},
		"profile.company.url.editor.title" : {
			"DE" : "Homepage",
			"EN" : "Website"
		},
		"profile.dialog.changepassword.title" : {
			"DE" : "Passwort ändern",
			"EN" : "Change password"
		},
		"profile.dialog.changepassword.text" : {
			"DE" : "Bitte geben Sie sowohl das aktuelle als auch das neue Passwort ein. Danach müssen Sie sich mit den neuen Zugangsdaten erneut einloggen.",
			"EN" : "Please enter current and new password. You will have to log in again afterwards with your new credentials."	
		},
		"profile.account.newpasswordrepeat" : {
			"DE" :  "Neues Passwort wiederholen",
			"EN" :  "Repeat password"
		},
		"profile.account.newpassword" : {
			"DE" :  "Neues Passwort",
			"EN" :  "New password"
		},
		"profile.confirmemailupdate.message" : {
			"DE" : "Vielen Dank, die neue E-Mail Adresse wurde bestätigt.<br/>Alle neuen Nachrichten werden an diese Adresse gesendet.",
			"EN" : "Thank you, your new e-mail address has been confirmed.<br/>All new messages will be sent to this address."
		},
		//menus partial
		"menus.description" : {
			"DE" : "Hier können Sie Ihre Produkte und Services anlegen. Alle Produkte und Services werden einer Kategorie zugeordnet.<br/>"+
					"Alle Kategorien können verschiedenen \"Service Bereichen\" zugewiesen werden (im Tab Kategorie zuweisen).",
			"EN" : "You can manage your products and services here.<br/>"+
					"In order to save time, all categories can be associated with several service areas."
		},
		"menus.list.title" : {
			"DE" : "Kategorien",
			"EN" : "Categories"
		},		
		"menu.container.hint" : {
			"DE" :  "Bitte vergessen Sie nicht, die Kategorie im Tab <a href='#/businesses/{{activeBusinessId}}/category_assignment'>\"Angebote zuweisen\"</a> einem Servicebereich zuzuweisen.",
			"EN" : "Don't forget to <a href='#/businesses/{{activeBusinessId}}/category_assignment'>\"Assign offers\"</a>assign this category to a service area afterwards."
		},
		"menu.container.title" : {
			"DE" : "Kategorie editieren",
			"EN" : "Edit category"
		},
		"menu.speciallist.header" : {
			"DE" :  "Spezielle Listen",
			"EN" : "Special lists"
		},
		"menus.list.orphaned" : {
			"DE" : "Verwaiste Produkte",
			"EN" : "Orphaned products"
		},
		"menus.list.allproducts" : {
			"DE" :  "Alle Produkte",
			"EN" : "All products"
		},
		"menus.list.allproducts.description" : {
			"DE" :  "<p>Liste aller Produkte. Die Liste kann gefiltert und es können Massenoperationen auf Produkten angewandt werden.</p>",
			"EN" : "<p>List of all products. The list can be filtered and mass operations can be executed on products.</p>"
		},
		"menus.list.allproducts.help" : {
			"DE" :  "<i class='icon-ok icon-black'></i> Produkt aktiv<br/>"+
					"<i class='icon-ban-circle icon-black'></i> Produkt inaktiv<br/>"+
					"<i class='icon-star icon-black'></i> Produkt ist Spezial<br/>"+
					"<i class='icon-star-empty icon-black'></i> Produkt nicht Spezial<br/>"+
					"<i class='icon-eye-open icon-black'></i> Produkt wird auf App Dashboard angezeigt<br/>"+
					"<i class='icon-eye-close icon-black'></i> Produkt wird auf App Dashboard verborgen<br/>"+
					"<i class='icon-info-sign icon-black'></i> Wenn Aktiv so kann der Benutzer das Produkt nur anschauen, aber nicht bestellen<br/>"+
					"<i class='icon-shopping-cart icon-black'></i>Benutzer kann Produkt bestellen",
			"EN" : "<i class='icon-ok icon-black'></i> Product active<br/>"+
					"<i class='icon-ban-circle icon-black'></i> Product inactive<br/>"+
					"<i class='icon-star icon-black'></i> Produkt is special<br/>"+
					"<i class='icon-star-empty icon-black'></i> Product is NOT sepcial<br/>"+
					"<i class='icon-eye-open icon-black'></i> Product can be displayed on app dashboard<br/>"+
					"<i class='icon-eye-close icon-black'></i> Product will never be shown on app dashboard<br/>"+
					"<i class='icon-eye-close icon-black'></i> If active user can only view but not order the product<br/>"+
					"<i class='icon-shopping-cart icon-black'></i>User can order product"
		},
		"products.filter.active.tooltip" : {
			"DE" :  "Inaktive Produkte anzeigen",
			"EN" : "Show inactive products"
		},
		"products.filter.special.tooltip" : {
			"DE" :  "Spezialprodukte anzeigen",
			"EN" : "Display special products"
		},
		"products.filter.showindashboard.tooltip" : {
			"DE" :  "Nur auf Dashboard sichtbare Produkte anzeigen.",
			"EN" : "Display only products visible on dashboard."
		},
		"products.filter.hideindashboard.tooltip" : {
			"DE" :  "Vom Dashboard ausgeblendete Produkte anzeigen",
			"EN" : "Display products hidden in dashboard"
		},
		"products.action.setactive" : {
			"DE" :  "aktiv setzen",
			"EN" : "set active"
		},
		"products.action.setinactive" : {
			"DE" :  "inaktiv setzen",
			"EN" : "set inactive"
		},
		"products.action.setspecial" : {
			"DE" :  "als Spezial setzen",
			"EN" : "set as special"
		},
		"products.action.setnotspecial" : {
			"DE" :  "Spezial entfernen",
			"EN" : "remove special"
		},
		"products.action.sethideindashboard" : {
			"DE" :  "vom dashbard ausblenden",
			"EN" : "hide in dashbard"
		},
		"products.action.setshowindashboard" : {
			"DE" :  "auf dashboard anzeigen",
			"EN" : "set visible in dashboard"
		},
		"menus.list.orphaned.tooltip" : {
			"DE" : "Nicht zugewiesene Produkte anzeigen",
			"EN" : "Show non-assigned products."
		},		
		"menus.menu.field.activate" : {
			"DE" : "Aktiv",
			"EN" : "Active"
		},
		"menus.menu.field.deactivate" : {
			"DE" : "Inaktiv",
			"EN" : "Inactive"
		},
		"menus.menu.delete" : {
			"DE" : "Löschen",
			"EN" : "Delete"	
		},
		"menus.menu.dialog.delete.title" : {
			"DE" : "Kategorie {{currentMenu.title}} löschen",
			"EN" : "Delete {{currentMenu.title}} category"
		},
		"menus.menu.dialog.delete.text" : {
			"DE" : "<strong>{{currentMenu.title}}</strong> löschen? Dies kann nicht rückgängig gemacht werden!<br/>Produkte werden nicht gelöscht.",
			"EN" : "Delete <strong>{{currentMenu.title}}</strong>? This cannot be undone.!<br/>Products won't be deleted."
		},
		"menu.products.container.title" : {
			"DE" : "Produkte dieser Kategorie",
			"EN" : "Products of this category"
		},
		"products.list.title" : {
			"DE" : "Kategorien",
			"EN" : "Categories"
		},
		"menus.products.list.new" : {
			"DE" : "Neu",
			"EN" : "New"
		},
		"menus.products.container.link.title" : {
			"DE" : "Alle Produkte",
			"EN" : "All products"
		},
		"menus.products.link.action.copy" : {
			"DE" : "Kopieren",
			"EN" : "Copy"
		},
		"menus.products.link.action.copylink" : {
			"DE" : "Kopieren und Auswahlmöglichkeiten verknüpfen.",
			"EN" : "Copy and link choices."
		},
		"menus.products.link.action.deepcopy" : {
			"DE" : "Kopieren inklusive Auswahlmöglichkeiten.",
			"EN" : "Copy including choices."
		},
		"menus.product.copy.name" : {
			"DE" : "-Kopie",
			"EN" : "-copy"
		},
		"menus.product.special.badge" : {
			"DE" :  "Spezialangebot",
			"EN" : "special offer"
		},
		"menus.product.inactive.badge" : {
			"DE" :  "Inaktiv",
			"EN" : "Inactive"
		},
		"menus.product.special.tooltip" : {
			"DE" :  "Spezialangebot (de)aktivieren. Diese werden gesondert im App Startscreen hervorgehoben.",
			"EN" : "(de)activate special offer. They will be highlighted on the app home screen."
		},
		"menus.product.noorder.tooltip" : {
			"DE" :  "Infoprodukt (de)aktivieren. Infoprodukte können nicht bestellt werden.",
			"EN" : "(De)Activate info product. User can't order info products."
		},
		"menus.product.noorder.badge" : {
			"DE" :  "Nur Anzeige",
			"EN" : "Only display"
		},
		"menus.product.active.tooltip" : {
			"DE" :  "Produkt aktiveren/deaktivieren. Achtung! Produkt ist nicht für Benutzer verfügbar.",
			"EN" : "Activate/deactivate product. Attention! Product is not available for user."
		},
		"menus.product.hideindashboard.tooltip" : {
			"DE" :  "Auge geschlossen: Produkt bei Zufallskacheln auf App Dashboard NIE anzeigen.",
			"EN" : "Eye closed: NEVER show product in a random tile on app dashboard."
		},
		"menus.products.link.description" : {
			"DE" : "Klicken Sie auf eine bestehendes Produkt, um dieses zu kopieren und der aktuellen Kategorie hinzuzufügen. Optional können Auswahlmöglichkeiten <strong>verknüpft</strong> oder <strong>kopiert</strong> werden. <i class='icon-question-sign'></i>",
			"EN" : "Click on existing product to copy it and add to current category."+
				"Optionally link or copy choices."
		},
		"menus.products.link.description.popover" : {
			"DE" :  "Änderungen an Auswahlmöglichkeiten (AM) ...<br/>"+
				"<b>verknüpfen</b> - Änderung der AM am kopiertem Produkt ändert diese auch am original Produkt, da diese voneinander abhängen (oder umgekehrt).<br/>"+
				"<b>kopieren</b> - Änderung der AM am kopiertem Produkt hat keinen Einfluss auf die AM am original Produkt, da diese unabhängig sind (oder umgekehrt).",
			"EN" : "Editing choices ...<br/>"+
				"<b>linking</b> - changes to choices of copied product also changes them for original product (vice versa). They are linked.<br/>"+
				"<b>copy</b> - changes to choices of copied product have no effect on original product (vice versa). They are independent."
		},
		"menus.help.symbols.popover" : {
			"DE" :  "<dl>"+
						"<dt><i class='icon-edit icon-black'></i></dt>"+
					  "<dd>Bearbeiten</dd>"+
					  "<dt><i class='icon-ok icon-black'></i></dt>"+
					  "<dd>Aktives Produkt (kann bestellt werden)</dd>"+
					  "<dt><i class='icon-ban-circle icon-black'></i></dt>"+
					  "<dd>Inaktives Produkt (kann NICHT bestellt werden)</dd>"+
					  "<dt><i class='icon-move icon-black'></i></dt>"+
					  "<dd>Per Drag&Drop verschieben</dd>"+
					  "<dt><i class='icon-trash icon-black'></i></dt>"+
					  "<dd>Löschen</dd>"+
					  "<dt><i class='icon-star icon-black'></i></dt>"+
					  "<dd>Spezialangebot</dd>"+
					  "<dt><i class='icon-eye-open icon-black'></i></dt>"+
					  "<dd>Sichtbar auf App Dashboard</dd>"+
					  "<dt><i class='icon-eye-close icon-black'></i></dt>"+
					  "<dd>Nicht sichtbar auf App Dashboard</dd>"+
					"</dl>",
			"EN" :  "<dl>"+
						"<dt><i class='icon-edit icon-black'></i></dt>"+
					  "<dd>edit</dd>"+
					  "<dt><i class='icon-ok icon-black'></i></dt>"+
					  "<dd>active product</dd>"+
					  "<dt><i class='icon-ban-circle icon-black'></i></dt>"+
					  "<dd>inactive product</dd>"+
					  "<dt><i class='icon-move icon-black'></i></dt>"+
					  "<dd>rearrange by drag&drop</dd>"+
					  "<dt><i class='icon-trash icon-black'></i></dt>"+
					  "<dd>delete</dd>"+
					  "<dt><i class='icon-star icon-black'></i></dt>"+
					  "<dd>special offer</dd>"+
					  "<dt><i class='icon-eye-open icon-black'></i></dt>"+
					  "<dd>Visible in app dashboard</dd>"+
					  "<dt><i class='icon-eye-close icon-black'></i></dt>"+
					  "<dd>Not visible in app dashboard</dd>"+
					"</dl>"
		},			
		"menus.products.orphaned.title" : {
			"DE" : "Nicht zugewiesene Produkte",
			"EN" : "Orphaned products"
		},
		"menus.products.orphaned.description" : {
			"DE" : "Liste aller Produkte die keiner Kategorie zugeordnet sind.",
			"EN" : "List of all non-assigned products."
		},
		"product.container.title" : {
			"DE" : "Produkt editieren",
			"EN" : "Edit product"
		},
		"menus.editor.title.tooltip" : {
			"DE" : "Titel editieren",
			"EN" : "Edit title"
		},
		"menus.editor.description.tooltip" : {
			"DE" : "Beschreibung editieren",
			"EN" : "Edit description"
		},
		"menus.placeholder.title" : {
			"DE" :  "Titel *",
			"EN" : "Title *"
		},
		"menus.placeholder.description" : {
			"DE" :  "Beschreibung",
			"EN" : "Description"
		},
		"product.editor.name.tooltip" : {
			"DE" : "Name editieren",
			"EN" : "Edit name"
		},
		"product.editor.shortDesc.tooltip" : {
			"DE" : "Kurzbeschreibung editieren",
			"EN" : "Edit short description"
		},
		"product.editor.longDesc.tooltip" : {
			"DE" : "Beschreibung editieren",
			"EN" : "Edit description"
		},
		"product.editor.price.tooltip" : {
			"DE" : "Preis editieren",
			"EN" : "Edit price"
		},
		"product.editor.image.description" : {
			"DE" : "Das Produktbild muss für die beste Darstellung am Gerät auf ein passendes Seitenverhältnis zugeschnitten werden.",
			"EN" : "For the best result on the device, the product image has to be cut to a fitting aspect ratio."
		},
		"product.placeholder.name" : {
			"DE" :  "Name *",
			"EN" : "Name *"
		},
		"product.placeholder.shortDesc" : {
			"DE" :  "Kurze Beschreibung",
			"EN" : "Short description"
		},
		"product.placeholder.longDesc" : {
			"DE" :  "Lange Beschreibung",
			"EN" : "Long description"
		},
		"product.placeholder.price" : {
			"DE" :  "Preis*",
			"EN" : "Price*"
		},
		"menus.product.field.active" : {
			"DE" : "Produkt dem Gast anzeigen",
			"EN" : "Show product to customers"
		},
		"menus.product.delete" : {
			"DE" : "Löschen",
			"EN" : "Delete product"
		},
		"menus.product.action.move" : {
			"DE" : "Verschieben...",
			"EN" : "Move to..."
		},
		"menus.product.action.move.tooltip" : {
			"DE" : "Verschiebt das aktuelle Produkt<br/>in ausgewählte Kategorie.",
			"EN" : "Moves current product to selected category."
		},
		"menus.product.dialog.delete.title" : {
			"DE" : "Produkt {{currentProduct.name}} löschen",
			"EN" : "Delete {{currentProduct.name}} product"
		},
		"menus.product.dialog.delete.text" : {
			"DE" : "<strong>{{currentProduct.name}}</strong> löschen? Dies kann nicht rückgängig gemacht werden!",
			"EN" : "Delete <strong>{{currentProduct.name}}</strong>? This cannot be undone!"
		},
		"product.choices.container.title" : {
			"DE" : "Auswahl zu diesem Produkt",
			"EN" : "Choices for this product"
		},
		"menus.choices.list.new" : {
			"DE" : "Neu.",
			"EN" : "New choice..."
		},
		"menus.choices.list.existing" : {
			"DE" : "Bestehend",
			"EN" : "Existing choice..."
		},
		"menus.choices.list.linked" : {
			"DE" : "Abhängige Auswahl",
			"EN" : "Dependent choice"
		},
		"menus.choices.list.remove.tooltip" : {
			"DE" : "Auswahl von diesem Produkt entfernen.",
			"EN" : "Remove choice from this product."
		}, 
		"menus.choices.link.description" : {
			"DE" : "Klicken Sie auf eine bestehende Auswahlmöglichkeit, um diese mit dem aktuellen Produkt zu <strong>verknüpfen</strong> oder zu <strong>kopieren</strong>.<br/>Es werden keine abhängigen Auswahlen angezeigt.",
			"EN" : "Click on existing choice to link with (or copy to) current product."
		},
		"choices.container.link.title" : {
			"DE" : "Auswahlmöglichkeiten",
			"EN" : "All choices"
		},
		"menus.choices.link.search" : {
			"DE" : "Suchen: ",
			"EN" : "Search: "
		},
		"menus.choices.link.action.copy" : {
			"DE" : "Kopieren",
			"EN" : "Copy"
		},
		"menus.choices.link.action.link" : {
			"DE" : "Verknüpfen",
			"EN" : "Link"
		},
		"menu.container.empty.description" : {
			"DE" : "Um die Details zu einer Kategorie anzuzeigen, wählen Sie bitte eine Kategorie aus der Liste links oder legen Sie eine neue an.",
			"EN" : "To view category details, please select a category from the list or add a new category."
		},
		"choice.container.title" :{
			"DE" : "Auswahl editieren",
			"EN" : "Edit choice"
		},
		"menus.options.title" : {
			"DE" : "Optionen",
			"EN" : "Options"
		},
		"option.configuration.container.title" : {
			"DE" : "Optionen",
			"EN" : "Options"
		},
		"menus.options.list.new" : {
			"DE" : "Neue Option...",
			"EN" : "New option..."
		},
		"menu.editor.title" : {
			"DE" : "Titel",
			"EN" : "Title"
		},
		"menu.editor.description" : {
			"DE" : "Beschreibung",
			"EN" : "Description"
		},
		"product.editor.name" : {
			"DE" : "Name",
			"EN" : "Name"
		},
		"product.editor.price" : {
			"DE" : "Preis",
			"EN" : "Price"
		},
		"product.editor.price.validation" : {
			"DE" : "Muss eine Zahl sein und falls nötig einen Punkt als Dezimaltrennzeichen haben. (z.B. 9.95, oder 5)",
			"EN" : "Must be a number and if needed use a colon as decimal mark. (e. g. 9.95, or 5)"
		},
		"product.editor.shortDesc" : {
			"DE" : "Kurz Beschreibung",
			"EN" : "Short description"
		},
		"product.editor.longDesc" : {
			"DE" : "Lange Beschreibung",
			"EN" : "Long description"
		},
		"product.container.empty.description" : {
			"DE" : "Um die Details zu einem Produkt anzuzeigen, wählen Sie bitte ein Produkt aus der Liste links oder legen Sie ein neues an.",
			"EN" : "To view product details, please select a product from the list or add a new product."
		},		
		"choice.editor.text" : {
			"DE" : "Auswahlname",
			"EN" : "Choice text"
		},
		"choice.placeholder.text" : {
			"DE" :  "Auswahlname *",
			"EN" : "Choice name *"
		},
		"choice.editor.maxOccurence" : {
			"DE" : "Maximale Auswahl von Optionen",
			"EN" : "Maximum number of options"
		},
		"choice.editor.minOccurence" : {
			"DE" : "Minimale Auswahl von Optionen",
			"EN" : "Minimum number of options"
		},
		"choice.editor.maxOccurence.error" : {
			"DE" : "Maximale Auswahl muss größer als minimale Auswahl sein oder 0 für keine Beschränkung.",
			"EN" : "Maximum number of options must be greater than minimum number of options or 0 for no limit."
		},
		"choice.editor.minOccurence.error" : {
			"DE" : "Minimale Auswahl muss kleiner als maximale Auswahl sein, falls diese nicht 0 ist.",
			"EN" : "Minimum number of options must be less than maximum number of options if the maximum is greater than 0."
		},
		"choice.editor.included" : {
			"DE" : "Anzahl von Inklusivoptionen",
			"EN" : "Amount of options included"
		},
		"menus.choices.field.maxOccurence" : {
			"DE" : "Gast kann max {{currentChoice.maxOccurence}} Option(en) auswählen",
			"EN" : "Guest can choose max {{currentChoice.maxOccurence}} option(s)"
		},
		"menus.choices.field.minOccurence" : {
			"DE" : "Gast muss min {{currentChoice.minOccurence}} Option(en) auswählen",
			"EN" : "Guest has to choose min {{currentChoice.minOccurence}} option(s)"
		},
		"menus.choices.field.included" : {
			"DE" : "Optionen inklusive: {{currentChoice.included}}",
			"EN" : "Options free of charge {{currentChoice.included}}"
		},
		"menus.choices.field.price" : {
			"DE" : "Preis: {{currentChoice.price | kcurrency:activeBusiness.currency}}",
			"EN" : "Price: {{currentChoice.price | kcurrency:activeBusiness.currency}}"
		},
		"menus.choices.field.linkedchoices" : {
			"DE" : "Untergeordnete Auswahlen",
			"EN" : "Linked choices"
		},
		"menus.choices.field.linkedproducts" : {
			"DE" : "Verwendet in",
			"EN" : "Used in"
		},
		"menus.choices.field.linkedproducts.help" : {
			"DE" : "Listet alle Produkte auf,<br/> die diese Auswahlmöglichkeit verwenden.",
			"EN" : "Lists all products<br/> using this choice."
		},
		"menus.choices.action.remove" : {
			"DE" : "Entfernen",
			"EN" : "Remove choice from product."
		},
		"menus.choice.dialog.delete.text" : {
			"DE" : "<strong>{{currentChoice.text}}</strong> wird von diesem Produkt entfernt.",
			"EN" : "<strong>{{currentChoice.text}}</strong>  will be removed from this product."
		},
		"choice.editor.text.tooltip" : {
			"DE" : "Auswahlname editieren",
			"EN" : "Edit choice name"
		},
		"choice.editor.price.tooltip" : {
			"DE" : "Preis editieren",
			"EN" : "Edit price"
		},
		"choice.editor.maxOccurence.tooltip" : {
			"DE" : "Maximale Optionsauswahl editieren",
			"EN" : "Edit maximum number of choices"
		},
		"choice.editor.minOccurence.tooltip" : {
			"DE" : "Minimale Optionsauswahl editieren",
			"EN" : "Edit minimum number of choices"
		},
		"choice.editor.included.tooltip" : {
			"DE" : "Anzahl inklusiv<br/>Optionen editieren",
			"EN" : "Edit number of included options"
		},
		"option.editor.name.tooltip" : {
			"DE" : "Name für Option editieren",
			"EN" : "Edit option name"
		},
		"option.editor.price.tooltip" : {
			"DE" : "Preis für Option editieren",
			"EN" : "Edit option price"
		},
		"option.placeholder.name" : {
			"DE" :  "Optionsname *",
			"EN" : "Option name *"
		},
		"option.placeholder.price" : {
			"DE" :  "Optionspreise *",
			"EN" : "Option price *"
		},
		"menu.new.default.title" : {
			"DE" : "Meine Kategorie",
			"EN" : "My category"
		},
		"product.new.default.name" : {
			"DE" : "Mein Produkt",
			"EN" : "My product"
		},
		"choice.new.default.text" : {
			"DE" : "Meine Auswahlmöglichkeit",
			"EN" : "My choice"
		},
		"option.new.default.name" : {
			"DE" : "Meine Option",
			"EN" : "My option"
		},
		"menus.choices.field.overridePrice.label" : {
			"DE" : "Preis pro Option",
			"EN" : "Price per option"
		},
		"menus.choices.field.overridePrice.none" : {
			"DE" : "Individueller Preis",
			"EN" : "Individual price"
		},
		"menus.choices.field.overridePrice.overridesingleprice" : {
			"DE" : "Standardpreis",
			"EN" : "Standard price"
		},
		"menus.choices.field.overridePrice.overridefixedsum" : {
			"DE" : "Bündelpreis",
			"EN" : "Bundle price"
		},
		"menus.choices.field.overridePrice.description" : {
			"DE" : "<b>Individueller Preis</b> - Alle Auswählmöglichkeiten haben einen eigenen Preis<br/>"+
					"<b>Standardpreis</b> - Alle Auswählmöglichkeiten haben den gleichen Preis<br/>"+
					"<b>Bündelpreis</b> - Alle Auswählmöglichkeiten zusammen haben einen Preis<br/>",
			"EN" : "<b>Individual price</b> - All choices have an individual price<br/>"+
					"<b>Standard price</b> - All choices have the same price<br/>"+
					"<b>Bundle price</b> - All choices have one price and are included<br/>"
		},
		"menus.choices.field.parentselect.label" : {
			"DE" : "Übergeordnete Auswahl:",
			"EN" : "Parent choice"
		},
		"menus.choices.field.parentselect.nullparent" : {
			"DE" : "--- auswählen ---",
			"EN" : "--- select ---"
		},
		"menus.choices.parentselect.tooltip" : {
			"DE" : "Ein hier ausgewähltes Element führt dazu, dass diese Auswahlmöglichkeit nur aktiv wird, "+
			"wenn der Kunde im übergeordneten Element eine Auswahl trifft.",
			"EN" : "Select a parent choice to only enable current choice when the parent gets selected."
		},
		"menus.choices.linkedchoices.tooltip" : {
			"DE" : "Auflistung aller Auswahlmöglichkeiten, die von dieser abhängen.",
			"EN" : "Lists all choices link to this choice."
		},
		"choice.container.empty.description" : {
			"DE" : "Um die Details zu einer Option anzuzeigen, wählen Sie bitte eine Option aus der Liste links oder legen Sie eine neue an.",
			"EN" : "To view option details please select an option from the list or add a new option."
		},
		//spots partial
		"areas.description" : {
			"DE" :  "Für jede \"cloobster location\" können Sie mehrere \"Servicebereiche\" anlegen(z.B. \"Bar\", \"Zimmer\", \"Spa\", \"Konferenzraum\", etc.).<br>"
			+"Jeder Servicebereich beinhaltet verschiedene Spots (QR Code für den Check-in). Ein Spot repräsentiert einen konkreten Standort (z. B. Zimmer 101).",
			"EN" : "For each \"cloobster location\" you can add several \"service areas\" (like \"Bar\", \"Rooms\", \"Spa\", \"Conference Area\", etc.).<br>"+
				"Each service area has different spots (QR Code for check-in). A spot represents a real location (e.g. room 101)."
		},
		"areas.list.title" : {
			"DE" :  "Servicebereiche",
			"EN" :  "Service areas"
		},
		"areas.detail.title" : {
			"DE" :  "Servicebereich editieren",
			"EN" :  "Edit service area"
		},
		"area.new.default.name" : {
			"DE" :  "Mein Servicebereich",
			"EN" :  "My service area"
		},
		"areas.field.active" : {
			"DE" :  "Aktiv: Gäste können einchecken",
			"EN" :  "Active: Guests can check in"
		},
		"areas.placeholder.name" : {
			"DE" :  "Name *",
			"EN" :  "Name *"
		},
		"areas.editor.name" : {
			"DE" :  "Name des Servicebereichs",
			"EN" :  "Name of service area"
		},
		"areas.editor.name.tooltip" : {
			"DE" :  "Name editieren",
			"EN" :  "Edit name"
		},
		"areas.placeholder.description" : {
			"DE" :  "Beschreibung",
			"EN" :  "Description"
		},
		"areas.editor.description" : {
			"DE" :  "Beschreibung des Servicebereichs",
			"EN" :  "Description of service area"
		},
		"areas.editor.description.tooltip" : {
			"DE" :  "Beschreibung editieren",
			"EN" : " Edit description"
		},
		"areas.spot.detail.title" : {
			"DE" :  "Spot editieren",
			"EN" :  "Edit spot"
		},
		"areas.spots.list.title" : {
			"DE" : "Spots hinzufügen/editieren",
			"EN" : "Edit/add spots"
		},
		"areas.container.empty.description" : {
					"DE" :  "Zeigt Details des ausgewählten Servicebereichs an. Wählen Sie einen Bereich aus der Liste links",
					"EN" :  "Shows details of the selected area. Select an area from the list."
				},		
		"areas.spots.list.description" : {
			"DE" : "Spots (z.B. Tische oder Zimmer), die diesem Servicebereich zugeordnet sind.",
			"EN" : "Spots assigned to this area."
		},
		"areas.spots.list.description.welcome" : {
			"DE" :  "Dies ist eine spezielle Welcome Area mit Welcome Spot. Sie können keine Spots löschen oder hinzufügen zu einer Welcome Area."
				+" Ein Welcome Spot repräsentiert die gesamte Location. Kunden können eichecken und Ihre Informationen sowie Produkte einsehen. Aber Sie können keine Bestellung oder VIP Calls tätigen.",
			"EN" : "This is a special welcome area with a welcome spot. You can't add or remove spots to a welcome area. " +
				"A welcome spot represents your whole location. Customers can check-i and have a look at your information as well as your products and services. But they can't order or submit a VIP Call."
		},
		"areas.spot.container.empty.description" : {
			"DE" :  "Zeigt Details des ausgewählten Spots an. Wählen Sie einen Spot aus der Liste links.",
			"EN" :  "Shows details of selected area. Select an area from the list."
		},
		"areas.categories.list.title" : {
			"DE" :  "Zugewiesenen Kategorien",
			"EN" :  "Assigned categories"
		},
		"areas.categories.list.description" : {
			"DE" :  "Liste der Produktkategorien (z.B. Getränke), auf die der Gast Zugriff hat, wenn er in diesem Bereich eingecheckt ist. "+
				"Die Reihenfolge der Kategorien regelt auch die Darstellungsreihenfolge in der App (mittels Drag&Drop die Reihenfolge ändern).",
			"EN" :  "List of product categories (e.g. beverages) available to customers checked in to this service area. Order of areas also reflects display order inside the app."
		},
		"areas.categories.removeall" : {
			"DE" :  "Alle Entfernen",
			"EN" :  "Remove All"
		},
		"areas.allcategories.addall" : {
			"DE" :  "Alle Hinzufügen",
			"EN" :  "Add All"
		},
		"areas.allcategories.list.title" : {
			"DE" :  "Verfügbare Kategorien",
			"EN" :  "Available categories"
		},
		"areas.allcategories.list.description" : {
			"DE" :  "Hier aufgelistete Produktkategorien können (mittels Drag&Drop) dem aktuellen Servicebereich zugewiesen werden, um diese für eingecheckte Gäste verfügbar zu machen.",
			"EN" : "The following product categories can be assigned (via drag & drop) to current service area to make them available to customers."
		},		
		"areas.categories.moveable.tooltip" : {
			"DE" :  "Ziehen und loslassen, um zuzuweisen oder die Reihenfolge zu ändern.",
			"EN" :  "Drag & drop to assign and change order of appearance."
		},
		"areas.action.delete" : {
			"DE" : "Servicebereich löschen",
			"EN" : "Delete service area"
		},
		"areas.dialog.delete.text" : {
			"DE" : "{{currentArea.name}} wird gelöscht! Der Servicebereich, alle Spots und ihre Barcodes können dann nicht mehr verwendet werden."+
					" Aktuell eingeloggte Servicekräfte und Gäste können den Bereich noch nutzen.<br/>"+
					"Der Bereich und alle Spots werden nach einer Weile permanent gelöscht",
			"EN" : "You're about to delete {{currentArea.name}}. This area, all spots, and barcodes cannot be used any longer."+
					"All current customer checkins at the specific spots will continue to work.<br/>"+
					"Data will be permanently deleted."
		},
		"areas.basicmode.message.text" : {
			"DE" :  "Sie benutzen ein Basis Paket. Sie können Servicebereiche und Spots anlegen. Diese sind jedoch nicht aktiv.",
			"EN" : "You are using a basic subscription. You can create/manage service areas and spots but they won't be active."
		},
		"spots.editor.name" : {
			"DE" : "Name",
			"EN" : "Name"
		},
		"spots.placeholder.name" : {
			"DE" :  "Name *",
			"EN" :  "Name *"
		},
		"spots.editor.barcode" : {
			"DE" : "Barcode",
			"EN" : "Barcode"
		},
		"spots.editor.name.tooltip" : {
			"DE" : "Name editieren",
			"EN" : "Edit name"
		},
		"spots.editor.barcode.tooltip" : {
			"DE" : "Barcode editieren",
			"EN" : "Edit barcode"
		},
		"spots.field.active" : {
			"DE" : "Aktiv: Gäste können einchecken",
			"EN" : "Activ: Guests can check in"
		},
		"spot.action.delete" : {
			"DE" : "Spot löschen",
			"EN" : "Delete spot"
		},
		"spot.action.delete.text" : {
			"DE" : "{{currentSpot.name}} wird gelöscht!<br/>Bereits ausgedruckte Barcodes können nicht wiederverwendet werden!",
			"EN" : "{{currentSpot.name}} will be deleted!<br/>Barcode cannot be reused!"
		},
		"spot.action.testcheckin" : {
			"DE" :  "App anschauen",
			"EN" : "App anschauen"
		},
		"spots.masscreation.title" : {
			"DE" :  "Mehrere Spots anlegen",
			"EN" :  "Create multiple spots"
		},
		"spots.masscreation.description" : {
			"DE" :  "Hier können Sie mehrere Spots auf einmal anlegen.<br/>Zum Beispiel Zimmer 100 bis Zimmer 199",
			"EN" :  "Create multiple spots at a time here. E.g. room 100 to 199."
		},
		"spot.masscreation.button" : {
			"DE" :  "Mehrere",
			"EN" :  "Multiple"
		},
		"spots.masscreation.name" : {
			"DE" :  "Name*",
			"EN" :  "Name*"
		},
		"spots.masscreation.startnumber" : {
			"DE" :  "Startnummer",
			"EN" :  "Start number"
		},
		"spots.masscreation.count" : {
			"DE" :  "Anzahl*",
			"EN" :  "Number*"
		},
		"spots.masscreation.placeholder.name" : {
			"DE" :  "z.B. Zimmer oder Tisch",
			"EN" :  "e.g. room or table"
		},
		"spots.masscreation.placeholder.startnumber" : {
			"DE" :  "z.B. 100 (Standard 1)",
			"EN" :  "e.g. 100 (standard 1)"
		},
		"spots.masscreation.placeholder.count" : {
			"DE" :  "z.B. 50",
			"EN" :  "e.g. 50"
		},
		"spots.masscreation.count.error.min" : {
			"DE" :  "Anzahl muss min. 1 sein.",
			"EN" :  "Create at minimum 1 spot."
		},
		"spots.masscreation.count.error.max" : {
			"DE" :  "Anzahl darf max. 500 sein.",
			"EN" :  "Create at maximum 500 spots."
		},
		"spots.massdelete.title" : {
			"DE" :  "Selektierte Spots löschen",
			"EN" :  "Delete selected spots"
		},
		"spots.massdelete.description" : {
			"DE" :  "Löscht alle selektierten Spots. Diese Aktion kann nicht rückgängig gemacht werden.<br/>"+
			"Ausgedruckte Barcodes sind danach nicht mehr gültig.",
			"EN" :  "Deletes all selected spots. Action cannot be undone.<br/>"+
			"Printed bar codes will become invalid."
		},
		"spots.massactivate.tooltip" : {
			"DE" :  "Selektierte aktivieren",
			"EN" :  "Activate selectted spots"
		},
		"spots.massdeactivate.tooltip" : {
			"DE" :  "Selektierte deaktivieren",
			"EN" :  "Deactivate selected spots"
		},
		"spots.massdelete.tooltip" : {
			"DE" :  "Selektierte löschen",
			"EN" :  "Delete selected spots"
		},
		"spots.filtered.status" : {
			"DE" :  "Spots gefiltert {{filteredSpots.length}} | markiert {{getCheckedSpotsCount()}}",
			"EN" :  "Spots filtered {{filteredSpots.length}} | selected {{getCheckedSpotsCount()}}"
		},
		"spots.legend.inactive" : {
			"DE" :  "Inaktiv",
			"EN" :  "Inactive"
		},
		"spots.listheader.selected" : {
			"DE" :  "Markierte ...",
			"EN" :  "Selected ..."
		},
		"spots.listheader.create" : {
			"DE" :  "Anlegen ...",
			"EN" :  "Create ..."
		},
		"spots.action.setactive" : {
			"DE" :  "Aktiv setzen",
			"EN" :  "Make active"
		},
		"spots.action.setinactive" : {
			"DE" :  "Inaktiv setzen",
			"EN" :  "Make inactive"
		},
		"spots.action.generatepdf.requested" : {
			"DE" :  "PDF-Datei generieren - Gestartet",
			"EN" :  "Generate PDF file - Requested"
		},
		"spots.action.generatepdf" : {
			"DE" :  "PDF-Datei generieren",
			"EN" :  "Generate PDF file"
		},
		"spots.action.generatepdf.description" : {
			"DE" :  "Geniert ein Aufsteller PDF für ausgewählte Spots. Wenn das Dokument fertig erstellt wurde, kann es im Dokumententab heruntergeladen werden.<br/>Sie haben <strong>{{getCheckedSpotsCount()}}</strong> Spots ausgewählt.",
			"EN" :  "Generates printable PDF file for selected spots. Once document has been generated, you can download it in the documents tab.<br/>You have selected <strong>{{getCheckedSpotsCount()}}</strong> spots."
		},
		"spots.generatepdf.documentname" : {
			"DE" :  "Optionaler Dokumentname:",
			"EN" :  "Optional document name"
		},
		"spots.generatepdf.documentname.placeholder" : {
			"DE" :  "z.B. Barcodes für Zimmer 100 bis 199",
			"EN" :  "e.g. bar codes for rooms 100 to 199"
		},
		"spots.generatepdf.documentname.maxlength" : {
			"DE" :  "Maximal 100 Zeichen erlaubt.",
			"EN" :  "Maximum number of characters is 100."
		},
		"areas.subscription.basic.description" : {
			"DE" :  "<span class='label label-important'>Basis</span> Sie verwenden ein Basis Paket. Sie können ganz normal Servicebereiche und Spots anlegen.<br/>Kunden können jedoch weder bestellen (nur ihre Produkte & Dienstleistungen einsehen)"+
					" und keinen VIP Call benutzen.<br/>" +
			 		"<a href='http://www.cloobster.com' target='_blank'>Mehr Information</a> oder <a href='#/businesses/{{activeBusiness.id}}'>upgrade</a>.",
			"EN" :  "<span class='label label-important'>Basic</span> Currently you are using a basic subscription. You can add service areas and spots <br/>but customers can't order"+
					" or use the VIP Call.<br/>" +
			 		"<a href='http://www.cloobster.com' target='_blank'>Learn more</a> or <a href='#/businesses/{{activeBusiness.id}}'>upgrade</a>."
		},
		"areas.editor.barcoderequired.help" : {
			"DE" :  "<h4>Bei Spotwechsel gilt</h4>"+
			"<b>Barcode nötig:</b> Barcode des Spots muss gescannt werden<br/><b>Kein Barcode nötig:</b> Spot wird über eine Liste ausgewählt<br/>"+
			"\"Barcode nötig\" ist sicherer, erfordert aber für jeden Spot individuelle Aufsteller.",
			"EN" : "<h4>A spot switch requires</h4>"+
				"<b>Barcode required:</b> spot barcode needs to be scanned<br/><b>No barcode required:</b> spot will be chosen from list<br/>"+
				"\"Barcode required\" is more secure, but requires an individual stand-up display per spot."
		},
		"areas.editor.barcoderequired.true" : {
			"DE" :  "Barcode nötig",
			"EN" : "Barcode required"
		},
		"areas.editor.barcoderequired.false" : {
			"DE" :  "Kein Barcode nötig",
			"EN" : "No barcode required"
		},
		"spot.master.description" : {
			"DE" :  "Der Masterspot dient als Einstiegspunkt für einen Servicebereich. Gäste "+
					"können hier einchecken, müssen zum bestellen aber einen konkreten Spot angeben. Beispielsweise kann für den Zimmerbereich "+
					"lediglich der Masterspot an Gäste ausgegeben werden um nicht viele individuelle Aufsteller (Kein Barcode aktivieren!) verteilen zu müssen.",
			"EN" : "This is the \"master\" spot for this area. The master spot serves as an entry point. To be able to order a guest has to choose "+
				"his real spot. For example you can hand out the master spot for rooms and don't need to provide individual stan-up displays for all of them (disable barcode required!)."
		},
		"spot.cloobsterwidget" : {
			"DE" :  "Snippet auswählen, kopieren und auf Website einfügen um bei installierter App mittels Button einen Check-in zu ermöglichen.",
			"EN" : "Copy and paste snippet on a website for direct cloobster Check-in via a button at this spot when app is installed."
		},		
		//infopage partial
		"infopages.description" : {
			"DE" :  "Hier können Sie Informationen zur aktuellen Location anlegen. Dies können zum Beispiel Informationen<br/>"+
			"über Blumenservice, Frühstückszeiten, Kontaktdaten und so weiter sein. Infoseiten werden zufällig auf dem App Dashboard angezeigt.<br/>"+
				"Dies können Sie explizit für einzelne Seiten deaktivieren.",
			"EN" : "Information pages for your locations (e.g. business hours, available services, tips).<br/>Infopages will be displayed randomly in"+
				"app dashboard. You can disable this explicitly for unique pages." 
		},
		"infopages.list.title" : {
			"DE" :  "Info-Seiten",
			"EN" :  "Info pages"
		},
		"infopage.container.title" : {
			"DE" :  "Informationsdetails",
			"EN" :  "Details"
		},
		"infopage.title" : {
			"DE" :  "Titel bearbeiten",
			"EN" :  "Edit title"
		},
		"infopage.shortText" : {
			"DE" :  "Kurztext bearbeiten",
			"EN" :  "Edit short text"
		},
		"infopage.image" : {
			"DE" :  "Bild hinzufügen",
			"EN" :  "Add picture"
		},
		"infopage.html" : {
			"DE" :  "Text bearbeiten",
			"EN" :  "Edit text"
		},
		"infopage.url" : {
			"DE" :  "Link bearbeiten",
			"EN" :  "Edit link"
		},
		"infopage.url.validation" : {
			"DE" :  "Bitte eine gültige Adresse eingeben (z.b. http://www.cloobster.com oder www.google.de).",
			"EN" :  "Please enter a valid link (e.g. http://www.cloobster.com oder www.google.de)."
		},
		"infopages.dialog.delete.title" : {
			"DE" :  "Info-Seite löschen",
			"EN" :  "Delete info page"
		},
		"infopages.dialog.delete.text" : {
			"DE" :  "Die Seite {{currentInfoPage.title}} wird gelöscht.<br/>Dies kann nicht rückgängig gemacht werden.",
			"EN" :  "Info page {{currentInfoPage.title}} will be deleted.<br/>This action cannot be undone."
		},
		"infogape.empty.description" : {
			"DE" :  "Um die Details zu einer Info-Seite zu bearbeiten, wählen Sie bitte eine Info-Seite aus der Liste links oder legen Sie eine neue an.",
			"EN" :  "To edit info page, please select info page from list or add a new page."
		},
		"infopage.placeholder.title" : {
			"DE" :  "Titel *",
			"EN" :  "Title *"
		},
		"infopage.placeholder.shortText" : {
			"DE" :  "Kurze Information",
			"EN" :  "Short Text"
		},
		"infopage.placeholder.html" : {
			"DE" :  "Ausführliche Information",
			"EN" :  "Long Text"
		},
		"infopage.placeholder.url" : {
			"DE" :  "Externer Link",
			"EN" :  "External Link"
		},
		"infopage.hideindashboard.true" : {
			"DE" :  "Infoseite wird nie auf dem App Dashboard angezeigt",
			"EN" : "Infopage will never be shown in app dashboard"
		},
		//documents partial
		"documents.title" : {
			"DE" :  "Dokumente",
			"EN" :  "Documents"
		},
		"documents.description" : {
			"DE" :  "Hier können Sie Dokumente der ausgewählten Location verwalten. Dokumente sind zum Beispiel Spot Aufsteller als PDF oder Marketing Flyer.",
			"EN" :  "Organize your documents here (e.g. PDF files, marketing handouts)"
		},
		"documents.table.description" : {
			"DE" :  "Die Dokumentabelle aktualisiert sich automatisch.",
			"EN" :  "Document tables refreshes automatically."
		},
		"documents.table.document" : {
			"DE" :  "Name",
			"EN" :  "Name"
		},
		"documents.table.type" : {
			"DE" :  "Typ",
			"EN" :  "Type"
		},
		"documents.table.status" : {
			"DE" :  "Status",
			"EN" :  "Status"
		},
		"documents.table.date" : {
			"DE" :  "Erstellt am",
			"EN" :  "Created on"
		},
		"documents.table.actions" : {
			"DE" :  "Aktionen",
			"EN" :  "Actions"
		},
		"documents.table.actions.description" : {
			"DE" :  "<i class='icon-download'></i> Dokument herunterladen<br/>"
					+"<i class='icon-trash'></i> Dokument löschen",
			"EN" : "<i class='icon-download'></i> Download document<br/>"
					+"<i class='icon-trash'></i> Delete document"
		},
		"documents.dialogdelete.title" : {
			"DE" :  "Dokument löschen",
			"EN" :  "Delete document"
		},
		"documents.dialogdelete.description" : {
			"DE" :  "Löschen des Dokuments \"{{documentToDelete.name}}\" vom {{documentToDelete.createDate | date:'short'}} kann nicht rückgängig gemacht werden.",
			"EN" : "Deletion of document \"{{documentToDelete.name}}\" dated {{documentToDelete.createDate | date:'short'}} cannot be undone."
		},
		"documents.status.complete" : {
			"DE" :  "Abgeschlossen",
			"EN" :  "Complete"
		},
		"documents.status.error" : {
			"DE" :  "Fehler",
			"EN" :  "Error"
		},
		"documents.status.pending" : {
			"DE" :  "In Bearbeitung",
			"EN" :  "In progress"
		},
		//accounts partial
		"accounts.title" : {
			"DE" : "Benutzerverwaltung",
			"EN" : "Account management"
		},
		"accounts.description" : {
			"DE" :  "Hier können Sie Benutzerkonten verwalten. Es gibt zwei Arten von Konten.<br/>"+
			"<ol><li>Admin-Konten haben die gleichen Rechte wie das Firmenkonto,<br/>können aber keine weiteren Admins "+
			" anlegen und keine Locations anlegen/löschen.</li>"+
			"<li>Service-Konten können nur auf das Cockpit zugreifen.</li></ol>"+
			"Jedem Konto können Sie die Locations zuweisen, auf die es Zugriff hat.",
			"EN" : "Here you can manage user accounts for your company.<br>"+
			"For each account you can define businesses to which the account has access."
		},
		"accounts.admin.exists.company" : {
			"DE" : "Dieser Benutzer ist mit einem anderen Firmenkonto verknüpft!",
			"EN" : "This user is already assigned to another company account."
		},
		"accounts.admin.exists.user" : {
			"DE" : "Dieser Benutzer existiert bereites. Möchten Sie ihm Adminrechte für Ihre Firma gewähren?",
			"EN" : "This user exists. Do you want to assign administrative rights?"  
		},
		"accounts.admin.exists.assigned" : {
			"DE" : "Dieser Benutzer ist bereits Administrator.",
			"EN" : "This user is already an administrator."
		},
		"accounts.tab.admin" : {
			"DE" : "Admin",
			"EN" : "Admin"
		},
		"accounts.tab.cockpit" : {
			"DE" : "Service",
			"EN" : "Service"
		},
		"accounts.list.title.users" : {
			"DE" : "Benutzerkonten",
			"EN" : "User accounts"
		},
		"accounts.list.title.administrators" : {
			"DE" : "Administratorkonten",
			"EN" : "Administrator accounts"
		},
		"accounts.list.new" : {
			"DE" : "Neuer Benutzer ...",
			"EN" : "New user..."
		},
		"accounts.admin.new.title" : {
			"DE" : "Neuer Administrator",
			"EN" : "New administrator"
		},
		"accounts.admin.mail.check" : {
			"DE" : "E-Mail prüfen",
			"EN" : "Check email address"
		},
		"accounts.create" : {
			"DE" : "Anlegen",
			"EN" : "Create"
		},
		"accounts.admin.new.email.placeholder" : {
			"DE" : "Account E-Mail",
			"EN" : "Account email address"
		},
		"accounts.admin.new.name.placeholder" : {
			"DE" : "Vor- und Nachname",
			"EN" : "First and last name"
		},
		"accounts.admin.businesses.list.title" : {
			"DE" : "Zugewiesene Locations",
			"EN" : "Assigned businesses"
		},
		"accounts.admin.businesses.list.description" : {
			"DE" : "Für hier aufgelistete Locations hat der Benutzer Administrationsrechte.<br/>Dies beinhaltet auch das Servicecockpit.",
			"EN" : "User has administrative rights for the following locations.<br/>This includes the service cockpit."
		},
		"accounts.admin.dialog.remove.title" : {
			"DE" : "Admin user entfernen",
			"EN" : "Remove admin user"
		},
		"accounts.admin.dialog.remove.text" : {
			"DE" : "{{currentAdmin.name}} wird entfernt!",
			"EN" : "{{currentAdmin.name}} will be removed!"
		},
		"accounts.all.businesses.list.title" : {
			"DE" : "Verfügbare Locations",
			"EN" : "Available businesses"
		},
		"accounts.all.businesses.list.description" : {
			"DE" : "Drag & drop in die Liste der zugewiesenen Locations, um dem Benutzer entsprechende Rechte zu gewähren.",
			"EN" : "Drag & drop to list of assigned businesses to grant user access."
		},
		"accounts.businesses.moveable.tooltip" : {
			"DE" : "Ziehen um zuzuweisen.",
			"EN" : "Drag to assign."
		},
		"accounts.cockpit.new.title" : {
			"DE" : "Neuer Servicebenuzer",
			"EN" : "New service user"
		},
		"accounts.cockpit.edit.title" : {
			"DE" : "Servicebenuzer editieren",
			"EN" : "Edit service user"
		},
		"accounts.cockpit.businesses.list.description" : {
			"DE" : "Für hier aufgelistete Locations hat der Benutzer Zugriffsrechte auf das Service Cockpit.",
			"EN" : "User has access to the following locations."
		},
		//activate account partial
		"account.activation.admin.title" : {
			"DE" : "Account aktivieren",
			"EN" : "Activate account"
		},
		"account.activation.admin.submit" : {
			"DE" : "Aktivieren",
			"EN" : "Activate"
		},
		"account.activation.admin.description" : {
			"DE" : "Um die Aktivierung abzuschliessen, füllen Sie bitte die fehlenden Felder aus.",
			"EN" : "To complete your account activation, please enter missing details below!"
		},	
		//category assignment partial
		"activation.description" : {
			"DE" :  "Hier können Sie den Servicebereichen spezifische Kategorien zuweisen.<br/>Somit können in einem \"Spa-Bereich\""+
				" andere Produkte und Dienstleistungen als auf dem \"Zimmer\" angeboten werden.",
			"EN" : "Here you can assign specific categories to your service areas.<br/>E.g. provide different services in \"spa\" than in \"room service\"."
		},
		"activation.assigned.container.empty.description" : {
			"DE" :  "Liste zugewiesener Kategorien des ausgewählten Servicebereichs. Bitte wählen Sie einen Bereich links.",
			"EN" : "List of assigned categories of selected service area. Please choose an area to the left."
		},
		"activation.all.container.empty.description" : {
			"DE" :  "Liste aller verfügbaren Kategorien.",
			"EN" : "Lists all available categories."
		},	
		//howto partial
		"howto.title" : {
			"DE" :  "In 4 Schritten zur eigenen App",
			"EN" : "4 steps for your own app"
		},
		"howto.step1.title" : {
			"DE" :  "Location anlegen",
			"EN" : "Create location"
		},
		"howto.step1.description" : {
			"DE" :  "Legen Sie Ihre \"Location\" an. Laden Sie Bilder hoch, wählen<br/> das Farbschema aus und konfigurieren "+
			" sie Facebook.",
			"EN" : "Create your \"Location\". Upload pictures, choose your color theme  and configure Facebook."
		},
		"howto.step2.title" : {
			"DE" :  "Angebote anlegen",
			"EN" : "Add offers"
		},
		"howto.step3.title" : {
			"DE" :  "Angebote zuweisen",
			"EN" : "Assign offers"
		},
		"howto.step4.title" : {
			"DE" :  "Infoseiten anlegen",
			"EN" : "Create infopages"
		},
		"howto.step2.description" : {
			"DE" :  "Legen Sie hier Ihren Produkt- und Servicekatalog an (Room Service, Wellness, Ausflüge).",
			"EN" : "Add your products and services (e.g. room service, wellness, arrangements)."
		},
		"howto.step3.description" : {
			"DE" :  "Machen Sie die Produkte sichtbar indem Sie sie dem Welcome Spot zuweisen.",
			"EN" : "Make your products visible by assigning them to a welcome spot."
		},
		"howto.step4.description" : {
			"DE" :  "Hier können Sie für den Gast wichtige Informationen anlegen (z. B. Gäste ABC).",
			"EN" : "Provide valuable information for your customer (e.g. breakfast times)"
		},
		"howto.success.title" : {
			"DE" :  "Gratulation",
			"EN" : "Congratulation"
		},
		"howto.success.description" : {
			"DE" :  "Scannen Sie den QR Code links. Wenn Sie cloobster nicht auf Ihrem Smartphone haben, "+
			"werden Sie automatisch zum App Store geleitet.<p style='color: red;'>Tipp: Zeigen Sie den QR Code auf Ihrer Website, Facebook, Twitter und Broschüren. (Download: Rechte Maustaste und speichern unter.)</p>",
			"EN" : "Scan the QR code on the left. If you don't have cloobster installed you will be redirected to the app store."+
				"<p style='color: red;'>Hint: Show the QR Code on your website, facebook, twitter and brochures. (Download: right click and save under)</p>"
		},
		"howto.success.qr.tooltip" : {
			"DE" :  "Download: Rechte Maustaste und speichern unter.",
			"EN" : "Download: right click and save under"
		},
		"howto.location.select" : {
			"DE" :  "Wählen oder erstellen Sie eine Location bevor Sie mit Schritt 2-4 fortfahren.",
			"EN" : "Choose or create a location before proceeding with step 2-4."
		},
		//wizard partial
		"appwizard.title" : {
			"DE" :  "Gestalten Sie Ihre App Präsenz in 5 Schritten",
			"EN" : "Create your own app presence in 5 simple steps"
		},
		"appwizard.step1.title" : {
			"DE" :  "Wie soll die Location heißen, in der Sie die App einsetzen werden?",
			"EN" : "Whats the name of the location you'll want to use the app with?"
		},
		"appwizard.step1.description" : {
			"DE" :  "Beispiel: Hotel Donaublick, Zum Grünen Baum, Bäcker Müller...",
			"EN" : "Example: Hotel Mountain View, Restaurant Big Burger, Bakery Cronut..."
		},
		"appwizard.step2.title" : {
			"DE" :  "Beschreiben Sie die Location",
			"EN" : "Describe your Location"
		},
		"appwizard.step3.logobutton" : {
			"DE" :  "Logo auswählen",
			"EN" : "Upload logo"
		},
		"appwizard.step3.mainpicbutton" : {
			"DE" :  "Hauptbild auswählen",
			"EN" : "Upload main picture"
		},
		"appwizard.step5.title" : {
			"DE" :  "Wie ist der Link zu Ihrer Facebookseite?",
			"EN" : "Link to your facebook page"
		},
		"appwizard.step4.title" : {
			"DE" :  "Was möchten Sie Ihren Kunden anbieten?",
			"EN" : "What do you want to offer your customers?"
		},
		"appwizard.step4.offer1.title" : {
			"DE" :  "Titel Angebot 1",
			"EN" : "Title offer 1"
		},
		"appwizard.step4.offer2.title" : {
			"DE" :  "Titel Angebot 2",
			"EN" : "Title offer 2"
		},
		"appwizard.step4.offer3.title" : {
			"DE" :  "Titel Angebot 3",
			"EN" : "Title offer 4"
		},
		"appwizard.step4.shortdesc" : {
			"DE" :  "Kurzbeschreibung",
			"EN" : "Short description"
		},
		"appwizard.step4.price" : {
			"DE" :  "Preis",
			"EN" : "Price"
		},
		"appwizard.generateapp" : {
			"DE" :  "App jetzt generieren",
			"EN" : "Generate App"
		},
		"appwizard.infopage.title" : {
			"DE" :  "Über uns",
			"EN" : "About us"
		},
		"appwizard.complete.text1" : {
			"DE" :  "Ihre App wurde generiert. Scannen Sie mit cloobster den QR-Code, um Ihre App zu sehen. Falls die cloobster App noch nicht installiert ist, einfach herunterladen oder QR-Code einmalig scannen (z.B. mit Barcoo).",
			"EN" : "Your App has been generated. Scan qr code with cloobster to see your app. If you don't have cloobster app installed, just download or scan qr code once (e.g. with Barcoo)."
		},
		"appwizard.complete.text2" : {
			"DE" : "Den QR Code können Sie übrigens schon jetzt benutzen und auf Flyer, Aufsteller, Facebook, Webseite veröﬀentlichen.",
			"EN" : "You can start immediately to use the qr code on facebook, flyers and your website."
		},
		"appwizard.complete.checkinbtn" : {
			"DE" :  "Smartphone Check-in (App muss installiert sein!)",
			"EN" : "Mobile Device Check-in (App must be installed)"
		},
		"appwizard.complete.checkinbtn.desktop" : {
			"DE" : "Desktop Check-in (für Google Chrome oder Apple Safari!)",
			"EN" : "Desktop Check-in (for Google Chrome or Apple Safari!)"
		},
		"appwizard.complete.checkinbtn.description" : {
			"DE" :  "Alternativer Check-in mittels Button",
			"EN" : "Alternative Check-in via button"
		},
		"appwizard.continuebutton" : {
			"DE" :  "App weiter bearbeiten",
			"EN" : "Continue editing"
		},
		"appwizard.quit.title" : {
			"DE" :  "Änderungen gehen verloren!",
			"EN" : "Changes will be lost!"
		},
		"appwizard.quit.message" : {
			"DE" :  "Wenn Sie diesen Bereich verlassen, gehen die eingetragenen Daten verloren.",
			"EN" : "Your data entries will be lost when you leave this area."
		},
		"appwizard.saving" : {
			"DE" :  "Erstelle App...",
			"EN" : "Creating App..."
		},
		//report partial
		"reports.description" : {
			"DE" :  "Hier können Sie die wichtigsten Kennzahlen (KPI) anschauen. Wählen Sie zunächst welche Kennzahl Sie anschauen möchten<br/>"+
			"und anschließend den Zeitraum sowie den gewünschten Servicebereich.",
			"EN" : "Here you'll find the most important performance figures (KPI). First select the KPI you want to see<br/>"+
			"then define the date range and service area."
		},
		"reports.types.title" : {
			"DE" :  "Reporttyp",
			"EN" : "Report type"
		},
		"reports.parameters.title" : {
			"DE" :  "Report Parameter",
			"EN" : "Report parameters"
		},
		"reports.parameters.empty.description" : {
			"DE" :  "Konfigurieren Sie hier den Report. Bitte wählen Sie zunächst einen Reporttyp aus der Liste links.",
			"EN" : "Configure the report. Please select a report type in the list on the left to proceed."
		},
		"reports.parameter.startdate" : {
			"DE" :  "Startdatum",
			"EN" : "start date"
		},
		"reports.parameter.enddate" : {
			"DE" :  "Enddatum",
			"EN" : "end date"
		},
		"reports.report.title" : {
			"DE" :  "Report",
			"EN" : "Report"
		},
		"reports.report.title.params" : {
			"DE" :  "Report <small>für {{currentReportParameters.serviceArea}} von {{currentReportParameters.fromDate | date:'shortDate'}} bis {{currentReportParameters.toDate | date:'shortDate'}}</small>",
			"EN" : "Report <small>for {{currentReportParameters.serviceArea}} from {{currentReportParameters.fromDate | date:'shortDate'}} to {{currentReportParameters.toDate | date:'shortDate'}}</small>"
		},
		"reports.report.empty.description" : {
			"DE" :  "Hier wird der Report angezeigt. Bitte konfigurieren Sie zunächst die Reportparameter.",
			"EN" : "Displays the report. Please configure the report parameters to proceed."
		},
		"reports.type.checkins" : {
			"DE" :  "Anzahl Check-Ins",
			"EN" : "Check-in count"
		},
		"reports.type.orders" : {
			"DE" :  "Anzahl Bestellungen",
			"EN" : "Orders count"
		},
		"reports.type.customerrequests" : {
			"DE" :  "Anzahl Service Calls",
			"EN" : "Service Call count"
		},
		"reports.type.feedback" : {
			"DE" :  "Anzahl Feedback",
			"EN" : "Feedback count"
		},
		"reports.type.turnover" : {
			"DE" :  "Umsatz",
			"EN" : "Turnover amount"
		},
		"reports.chart.haxis" : {
			"DE" :  "Datum",
			"EN" : "Date"
		},
		"reports.report.servicearea" : {
			"DE" :  "Servicebereich",
			"EN" : "Service area"
		},
		"reports.report.count" : {
			"DE" :  "Anzahl",
			"EN" : "Count"
		},
		"reports.report.day" : {
			"DE" :  "Tag",
			"EN" : "Day"
		},
		"reports.report.month" : {
			"DE" :  "Monat",
			"EN" : "Month"
		},
		"reports.report.year" : {
			"DE" :  "Jahr",
			"EN" : "Year"
		},
		"reports.report.comment" : {
			"DE" :  "Kommentar",
			"EN" : "Comment"
		},
		"reports.report.email" : {
			"DE" :  "E-Mail",
			"EN" : "Email"
		},
		"reports.action.show" : {
			"DE" :  "Report anzeigen",
			"EN" : "Show report"
		},
		"reports.action.export.xls" : {
			"DE" :  "Report als XLS exportieren",
			"EN" : "Export report as XLS"
		},
		"reports.report.noresult" : {
			"DE" :  "Keine Datensätze gefunden im angegebenen Zeitraum.",
			"EN" : "No results found for given date range."
		},
		"reports.action.export.dialog.title" : {
			"DE" :  "Report exportieren",
			"EN" : "Export report"
		},
		"reports.action.export.dialog.requested.title" : {
			"DE" :  "Export wurde angestoßen",
			"EN" : "Export has been requested"
		},
		"reports.action.export.dialog.text" : {
			"DE" :  "Möchten Sie den Report als Excel Datei exportieren?",
			"EN" : "Do you want to export the selected data to an Excel file?"
		},
		"reports.action.export.dialog.complete" : {
			"DE" :  "Der Export wird verarbeitet und wird im Tab Dokumente bereitgestellt.",
			"EN" : "Your request is being processed and the file will be available under Documents soon."
		},
		"reports.report.documents.open" : {
			"DE" :  "Dokumente öffnen",
			"EN" : "Go to documents"
		},
		"reports.report.allareas" : {
			"DE" :  "alle Bereiche",
			"EN" : "all areas"
		},
		"reports.parameter.getall" : {
			"DE" :  "Zeige alle Daten",
			"EN" : "Show all data"
		},
		"reports.feedback.form.title" : {
			"DE" :  "Formulartitel:",
			"EN" : "Form title:"
		},
		"reports.feedback.average" : {
			"DE" :  "Durschnitt",
			"EN" : "Average"
		},
		"reports.feedback.chart.title" : {
			"DE" :  "Wöchentliche durschnittliche Feedbackwerte",
			"EN" : "Weekly average feedback results"
		},
		"reports.feedback.chart.selection" : {
			"DE" :  "Chart Auswahl",
			"EN" : "Chart selection"
		},
		//app config partial
		"appconfig.description" : {
			"DE" :  "Konfigurieren Sie die App. Gestalten Sie das Dashboard für Ihren individuellen Auftritt. Schalten Sie Features ein oder aus.",
			"EN" : "Customize the look of the app. Add dashboard tiles for your individuell appearance. Turn features on or off."
		},
		"appconfig.subscription.basic.description" : {
			"DE" :  "<span class='label label-important'>Basis</span> Sie verwenden ein Basis Paket. Die Konfiguration eines individuellen Dashboards ist nur nach einem Upgrade des Pakets möglich.<br>" +
			 		"<a href='http://www.cloobster.com' target='_blank'>Mehr Information</a> oder <a href='#/businesses/{{activeBusiness.id}}'>upgrade</a>.",
			"EN" :  "<span class='label label-important'>Basic</span> Currently you are using a basic subscription. Customisation of the dashboard is only usable after an upgrade to your subscription.<br>" +
			 		"<a href='http://www.cloobster.com' target='_blank'>Learn more</a> or <a href='#/businesses/{{activeBusiness.id}}'>upgrade</a>."
		},
		"appconfig.tiles.list.title" : {
			"DE" :  "Kacheltypen",
			"EN" : "Tile types"
		},
		"appconfig.tiles.list.description" : {
			"DE" : "Liste aller verfügbaren Kacheltypen. Fügen Sie diese einfach per <b>Drag&Drop</b> auf die leere Kachel rechts hinzu. Sie können maximal 10 Kacheln platzieren.",
			"EN" : "List of all available tiles. Just add them via <b>drag & drop</b> on the empty tile to the right. You can add a maximum of 10 tiles."
		},
		"appconfig.tilesconfig.list.title" : {
			"DE" :  "Dashboard Vorschau",
			"EN" : "Dashboard preview"
		},
		"appconfig.tilesconfig.list.description" : {
			"DE" :  "Vorschau des App Dashboards. Fügen Sie Kacheln aus der Liste links hinzu. Sortieren Sie diese anschließend per <b>Drag & Drop</b>. Kachel <b>anklicken</b> für weitere Details.",
			"EN" : "Shows a preview how your app dashboard will look like. Just drop a tile from the list on the empty tile. Rearrange order by <b>drag and drop</b>. <b>Click</b> tile for more details."
		},
		"appconfig.tile.empty" : {
			"DE" :  "Kachel hier ablegen",
			"EN" : "drop a tile"
		},
		"appconfig.tile.maximum" : {
			"DE" :  "Max 10 Kachel erreicht.",
			"EN" : "Max 10 tiles reached."
		},
		"appconfig.tiledetail.title" : {
			"DE" :  "Kacheldetails",
			"EN" : "Tile details"
		},
		"appconfig.tiledetail.empty.description" : {
			"DE" :  "Zeigt die Details einer Kachel. Wähle Sie eine aus der Dashboard Vorschau.",
			"EN" : "Shows the selected tile details. Select a tile from dashboard preview."
		},
		"appconfig.tiledetail.productlist.title" : {
			"DE" :  "Produktliste",
			"EN" : "Product list"
		},
		"appconfig.tiledetail.infopages.title" : {
			"DE" :  "Infoseiten Einträge",
			"EN" : "Infopage entries"
		},
		"appconfig.tiledetail.menulist.title" : {
			"DE" :  "Menüliste",
			"EN" : "Menu list"
		},
		"appconfig.list.dataselection.description" : {
			"DE" :  "Wählen Sie die Datensätze für diese Kachel aus. Einer der Datensätze wird dann zufällig auf dem Dashboard angezeigt.",
			"EN" : "Select the data entries for this tile. One of those entires will be displayed randomly on the dashboard."
		},
		"tiles.template.feedback" : {
			"DE" :  "Feedback",
			"EN" : "Feedback"
		},
		"tiles.template.products" : {
			"DE" :  "Angebote",
			"EN" : "Offers"
		},
		"tiles.template.infopages" : {
			"DE" :  "Infoseiten",
			"EN" : "Infopages"
		},
		"tiles.template.actions" : {
			"DE" :  "Service Call",
			"EN" : "Service Call"
		},
		"tiles.template.allinfopages" : {
			"DE" :  "Infoseite: Zufall",
			"EN" : "Infopage: Random"
		},
		"tiles.template.infopagesselected" : {
			"DE" :  "Infoseite: Ausgewählt",
			"EN" : "Infopage: Selected"
		},
		"tiles.template.productsall" : {
			"DE" :  "Produkte (Zufall)",
			"EN" : "Products (Random)"
		},
		"tiles.template.productsspecial" : {
			"DE" :  "Produkte (Special)",
			"EN" : "Products (Special)"
		},
		"tiles.template.productsselected" : {
			"DE" :  "Produkte (Ausgewählt)",
			"EN" : "Products (Selected)"
		},
		"tiles.template.menusselected" : {
			"DE" :  "Kategorie",
			"EN" : "Category"
		},
		"tiles.template.feedback.description" : {
			"DE" :  "Shortcut um in den Feedbackbereich zu gelangen, statt über die seitliche Navigation.",
			"EN" : "Shortcut to quickly reach Feedback instead of the navigation menu."
		},
		"tiles.template.products.description" : {
			"DE" :  "Shortcut um in den Produktbereich zu gelangen, statt über die seitliche Navigation.",
			"EN" : "Shortcut to quickly reach Products instead of the navigation menu."
		},
		"tiles.template.infopages.description" : {
			"DE" :  "Shortcut um in den A - Z Bereich zu gelangen, statt über die seitliche Navigation.",
			"EN" : "Shortcut to quickly reach A - Z instead of the navigation menu."
		},
		"tiles.template.actions.description" : {
			"DE" :  "Shortcut um in den Aktionsbereich zu gelangen, statt über die seitliche Navigation.",
			"EN" : "Shortcut to quickly reach Actions instead of the navigation menu."
		},
		"tiles.template.infopagesall.description" : {
			"DE" :  "Zeigt eine zufällige Infoseite. Seiten die markiert sind als verborgen auf dem Dashboard werden nicht angezeigt. ",
			"EN" : "Display a random infopage. Ignores pages flagged to be hidden on dashboard."
		},
		"tiles.template.infopagesselected.description" : {
			"DE" :  "Zeigt eine zufällige Infoseite aus der Menge der selektierten. Explizites markieren ignoriert die \"verborgen auf Dashboard\" Einstellung.",
			"EN" : "Displays a random infopage out of the ones you select. The hide on dashboard flag will be ignored."
		},
		"tiles.template.productsall.description" : {
			"DE" :  "Zeigt ein zufälliges Produkt (keine Specials!). Produkte die markiert sind als verborgen auf dem Dashboard werden nicht angezeigt.",
			"EN" : "Display a random product. Ignores products flagged to be hidden on dashboard. Only products assigned to active area are shown."
		},
		"tiles.template.productsspecial.description" : {
			"DE" :  "Zeigt ein zufälliges Produkt welches als Special markiert ist. Produkte die markiert sind als verborgen auf dem Dashboard werden nicht angezeigt.",
			"EN" : "Display a random product marked as special. Ignores products flagged to be hidden on dashboard. Only products assigned to active area are shown."
		},
		"tiles.template.productsselected.description" : {
			"DE" :  "Zeigt ein zufälliges Produkt aus der Menge der Selektierten an. Explizites markieren ignoriert die \"verborgen auf Dashboard\" Einstellung.",
			"EN" : "Displays a random product out of the ones you select. The hide on dashboard flag will be ignored. Only products assigned to active area are shown."
		},
		"tiles.template.menusselected.description" : {
			"DE" :  "Zeigt ein zufälliges Menü aus der Menge der Selektierten an.",
			"EN" : "Displays a random menu out of the ones you select."
		},
		"appconfig.tiledetail.empty.description" : {
			"DE" :  "Zeigt details einer Kachel an. Wählen Sie eine Kachel aus der Dashboard Vorschau.",
			"EN" : "Shows the selected tile details. Select a tile from dashboard preview."
		},		
		"tiles.dialog.delete.title" : {
			"DE" :  "Kachel löschen",
			"EN" : "Delete tile"
		},
		"tiles.dialog.delete.text" : {
			"DE" :  "Kachel wird entfernt!",
			"EN" : "Tile will be removed!"
		},
		"appconfig.features.title" : {
			"DE" :  "Features",
			"EN" : "Features"
		},
		"appconfig.features.description" : {
			"DE" :  "Funktionen (de)aktivieren in der App",
			"EN" : "Configure features you want to be available in the app."
		},
		"appconfig.features.externals.description" : {
			"DE" :  "Funktionen externer Partner.",
			"EN" : "Features of external partners."
		},
		"appconfig.features.products" : {
			"DE" :  "Produkte",
			"EN" : "Products"
		},
		"appconfig.features.productsorder" : {
			"DE" :  "Bestellfunktion",
			"EN" : "Order function"
		},
		"appconfig.features.infopages" : {
			"DE" :  "Infoseiten",
			"EN" : "Infopages"
		},
		"appconfig.features.feedback" : {
			"DE" :  "Feedback",
			"EN" : "Feedback"
		},
		"appconfig.features.requestscall" : {
			"DE" :  "Service Call",
			"EN" : "Service Call"
		},
		"appconfig.features.facebookpost" : {
			"DE" :  "Facebook Post",
			"EN" : "Facebook Post"
		},
		"appconfig.features.contact" : {
			"DE" :  "Kontaktinformation",
			"EN" : "Contact information"
		},
		//general
		"common.warning.title" : {
			"DE" : "Achtung!",
			"EN" : "Warning!"
		},
		"common.hint" : {
			"DE" : "Hinweis",
			"EN" : "Message"
		},
		"common.ok" : {
			"DE" : "Ok",
			"EN" : "Ok"
		},
		"common.new" : {
			"DE" : "Neu",
			"EN" : "New"
		},
		"common.cancel" : {
			"DE" : "Abbrechen",
			"EN" : "Cancel"
		},
		"common.close" : {
			"DE" :  "Schliessen",
			"EN" : "Close"
		},
		"common.add" : {
			"DE" : "Hinzufügen",
			"EN" : "Add"
		},
		"common.delete" : {
			"DE" : "Löschen",
			"EN" : "Delete"
		},
		"common.save" : {
			"DE" : "Speichern",
			"EN" : "Save"
		},
		"common.search" : {
			"DE" : "Suchen",
			"EN" : "Search"
		},
		"common.password" : {
			"DE" : "Passwort",
			"EN" : "Password"
		},
		"common.remove" : {
			"DE" : "Entfernen",
			"EN" : "Remove"
		},
		"common.active" : {
			"DE" : "Aktiv",
			"EN" : "Active"
		},
		"common.inactive" : {
			"DE" : "Inaktiv",
			"EN" : "Inactive"
		},
		"common.copy" : {
			"DE" : "Kopie",
			"EN" : "Copy"
		},
		"common.help" : {
			"DE" : "Hilfe",
			"EN" : "Help"
		},
		"common.image.edit" : {
			"DE" :  "Bild anklicken um zu editieren",
			"EN" : "Click image to edit"
		},
		"common.image.add" : {
			"DE" :  "Bild hinzufügen",
			"EN" :  "Add picture"
		},
		"common.all" : {
			"DE" :  "Alle",
			"EN" : "All"
		},
		"common.default.language" : {
			"DE" :  "Standardsprache",
			"EN" : "default language"
		},
		"common.action" : {
			"DE" :  "Aktion",
			"EN" : "Action"
		},
		"common.download" : {
			"DE" :  "Download",
			"EN" : "Download"
		},
		"common.confirm" : {
			"DE" :  "Bestätigen",
			"EN" : "Confirm"
		},
		"common.dropdown.select" : {
			"DE" :  "-- auswählen --",
			"EN" : "-- select --"
		},
		"common.back" : {
			"DE" :  "zurück",
			"EN" : "back"
		},
		"general.sortable" : {
			"DE" : "Ziehen, um zu sortieren",
			"EN" : "Drag to sort"
		},		
		"validation.field.required" : {
			"DE" :  "* Bitte füllen Sie die Pflichtfelder aus.",
			"EN" : "* Please fill out required fields."
		},
		"common.masscheck.tooltip" : {
			"DE" :  "Alle anwählen/abwählen",
			"EN" :  "Select/deselect all"
		},
		"common.language.display" : {
			"DE" :  "Anzeigesprache",
			"EN" : "Display language"
		},
		"common.disabled" : {
			"DE" :  "Deaktiviert",
			"EN" : "Disabled"
		},
		"common.create" : {
			"DE" :  "Anlegen",
			"EN" : "Create"
		},
		//breadcrumb
		"breadcrumb.home" : {
			"DE" : "Home",
			"EN" : "Home"
		},
		"breadcrumb.businesses" : {
			"DE" : "Locations",
			"EN" : "businesses"
		},
		"breadcrumb.menus" : {
			"DE" : "Kategorien",
			"EN" : "Categories"
		},
		"breadcrumb.areas" : {
			"DE" : "Servicebereiche",
			"EN" : "Service areas"
		},
		//file upload
		"fileupload.button.add" : {
			"DE" : "Bild auswählen...",
			"EN" : "Select image..."
		},
		"fileupload.button.crop" : {
			"DE" : "Zuschneiden",
			"EN" : "Crop image"
		},	
		"fileupload.image.label" : {
			"DE" : "Ausgewähltes Bild: ",
			"EN" : "Selected image: "
		},
		"fileupload.button.submit.saving" : {
			"DE" : "Speichere ...",
			"EN" : "Saving..."
		},
		"fileupload.uploading" : {
			"DE" : "Hochladen ...",
			"EN" : "Uploading ..."
		},
		"fileupload.cropping" : {
			"DE" : "Zuschneiden ...",
			"EN" : "Cropping ..."
		},
		"fileupload.image.description" : {
			"DE" : "Wählen Sie eine Bilddatei zum Hochladen. Überprüfen Sie, dass sie nicht größer als 3MB ist und vom Typ GIF, PNG oder JPEG.",
			"EN" : "Please select a file. Ensure the file is less than 3 MB in size and the format is GIF, PNG, or JPEG."
		},
		"fileupload.dimensions.description" : {
			"DE" : "Minimale Abmessungen: ",
			"EN" : "Minimal dimensions: "
		},
		"fileupload.submit.error" : {
			"DE" : "Beim Hochladen ist ein Fehler aufgetreten. Überprüfen Sie, dass die Datei nicht größer als 3 MB ist und vom Typ GIF, PNG oder JPEG.",
			"EN" : "An error occurred during upload. Please check file size (< 3 MB) and format (GIF, PNG, JPEG)."
		},
		"fileupload.save.error" : {
			"DE" : "Beim Speichern des Bildes ist ein Fehler aufgetreten. Bitte überprüfen sie Ihre Internetverbindung und versuchen sie es erneut.",
			"EN" : "An error occurred during saving of the image. Please check your connection and try again."
		},
		"fileupload.crop.error" : {
			"DE" : "Beim Zuschneiden ist ein Fehler aufgetreten. Überprüfen sie die Auswahl und probieren sie es noch einmal.",
			"EN" : "An error occurred while cropping image. Please check selection and try again."
		},
		"fileupload.error.dimensions" : {
			"DE" : "Das Bild muss mindestens die Abmessungen {{editorMinWidth}} x {{editorMinHeight}} Pixel haben.",
			"EN" : "The image must at least have the dimensions {{editorMinWidth}} x {{editorMinHeight}} pixel."
		},
		"fileupload.error.size" : {
			"DE" : "Maximal erlaubte Dateigröße beträgt 3 MB.",
			"EN" : "Maximum file size is 3 MB."
		},
		"fileupload.error.type" : {
			"DE" : "Bild muss vom Typ JPEG, GIF oder PNG sein.",
			"EN" : "Image type must be JPEG, GIF, or PNG."
		},
		"propertyeditor.repeat.placeholder" : {
			"DE" : "Hier die Eingabe wiederholen",
			"EN" : "Repeat input here"
		},
		"propertyeditor.error.required" : {
			"DE" : "Bitte einen Text eingeben.",
			"EN" : "Please enter a text."
		},
		"propertyeditor.error.number" : {
			"DE" : "Bitte eine Zahl eingeben.",
			"EN" : "Please enter a number."
		},
		"propertyeditor.error.email" : {
			"DE" : "Bitte eine gültige E-Mail-Adresse eingeben.",
			"EN" : "Please enter a valid email."
		},
		//externals partial
		"externals.help" : {
			"DE" :  "Liste externer Partner und zugehörige Konfiguration. cloobster übernimmt keine Verantwortung für"+
					" Daten von Drittanbietern.",
			"EN" : "List of external data providers and their configuration."+
					"cloobster is not responsible for data coming from third parties."
		},
		"externals.list.title" : {
			"DE" :  "Externe Partner",
			"EN" : "External Partners"
		},
		"externals.configuration.title" : {
			"DE" :  "Konfiguration",
			"EN" : "Configuration"
		},
		"externals.empty.description" : {
			"DE" :  "Bitte einen Partner aus der Liste auswählen.",
			"EN" : "Please select a partner from the list."
		},
		"externals.de.ztix.name" : {
			"DE" :  "Ztix",
			"EN" : "Ztix"
		},
		"externals.de.panoramafotobuch.name" : {
			"DE" :  "Panorama Fotobuch",
			"EN" : "Panorama Photobook"
		},
		"externals.de.ztix.description" : {
			"DE" :  "Um Veranstaltungen aus dem ztix System anzuzeigen, tragen Sie bitte die Veranstalter ID ein." +
					"<br/>Anschließend aktivieren Sie das Feature unter",
			"EN" : "To display events from ztix platform, simply enter your host ID.<br/>"+
					"Afterwards enable the feature under"
		},
		"externals.de.ztix.title" : {
			"DE" :  "Ticketing leicht gemacht",
			"EN" : "Ticketing made easy"
		},
		"externals.de.ztix.editor.host.label" : {
			"DE" :  "Veranstalter ID(s)",
			"EN" : "Host ID(s)"
		},
		"externals.de.ztix.editor.host.placeholder" : {
			"DE" :  "Id Nummer der Veranstalter",
			"EN" : "Id number of hosts"
		},
		"externals.de.ztix.hosts.error" : {
			"DE" :  "Bitte eine gültige Zahl eingeben. Mehrere Veranstalter können durch / getrennt werden.",
			"EN" : "Enter a valid number. Seperate multiple hosts via /"
		},
		"tiles.template.external.de.ztix.events" : {
			"DE" :  "Ztix Veranstaltungen",
			"EN" : "Ztix Events"
		},
		"tiles.template.external.de.ztix.events.description" : {
			"DE" :  "Shortcut um in den Veranstaltungen zu gelangen, statt über die seitliche Navigation. (Externer Partner Feature!)",
			"EN" : "Shortcut to quickly reach Events instead of the navigation menu. (External partner feature!)"
		},
		//login_form partial
		"login.message" : {
			"DE" : "Zugang mit Ihrem Geschäftskundenkonto.",
			"EN" : "Access with your business account."
		},
		"login.password.forgot" : {
			"DE" :  "Passwort vergessen?",
			"EN" : "Forgot password?"
		},
		"login.facebook" : {
			"DE" :  "Login mit Facebook",
			"EN" :  "Login with Facebook"
		},
		"login.remember" : {
			"DE" :  "Eingeloggt bleiben",
			"EN" :  "Remember login"
		},
		"login.input.login" : {
			"DE" :  "Login",
			"EN" : "Login"
		},
		"login.input.password" : {
			"DE" :  "Passwort",
			"EN" : "password"
		},
		//loginService errors
		"login.error.cockpituser" : {
			"DE" :  "Cockpit-Benutzerkonten haben auf die Verwaltung keinen Zugriff.",
			"EN" :  "Cockpit users cannot access management options."
		},
		//passwordforgot partial
		"login.password.reset.title" : {
			"DE" :  "Passwort zurücksetzen",
			"EN" :  "Reset password"
		},
		"login.password.reset.description" : {
			"DE" :  "Bitte gebe die E-Mail Adresse Deines Accounts an.",
			"EN" :  "Enter email address you registered with your account."
		},
		"login.password.reset.complete.description" : {
			"DE" :  "Eine Nachricht mit Resetlink wurde an Deinen E-Mail Account geschickt.",
			"EN" :  "Email has been sent to your email account."
		},
		//passwordreset partial
		"passwordreset.complete" : {
			"DE" :  "Neues Passwort erfolgreich gespeichert.",
			"EN" :  "New password has been saved."
		},
		"passwordreset.description" : {
			"DE" :  "Gib ein neues Passwort ein.",
			"EN" :  "Enter a new password."
		},
		//specific error messages
		"error.account.login.exists" : {
			"DE" : "Der Benutzername existiert bereits.",
			"EN" : "User name already exists."
		},
		"error.account.email.exists" : {
			"DE" : "Die E-Mail-Adresse wird bereits benutzt.",
			"EN" : "The e-mail address is already in use."
		},
		"error.accesstoken.invalid" : {
			"DE" : "Dieser Link ist nicht mehr gültig.",
			"EN" : "This link is no longer valid."
		},
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
		"report.leaddevelopers.title" : {
			"DE" :  "Lead developers",
			"EN" : "Lead developers"
		},
		"report.projectManagers.title" : {
			"DE" :  "Projektmanager",
			"EN" : "Project manager"
		},
	};

	$provide.value("translation", map);
}]);