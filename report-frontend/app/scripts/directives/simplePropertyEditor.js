angular.module('PReports.directives').directive('simplePropertyEditor', ['$timeout', '$log', 'language',  function($timeout, $log, langService) {
	var inputType, //type of the input to generate in form
		required, //if present marks a required field
		//directive configuration
		config = {
		restrict: 'A',
		replace: false,
		transclude: true,
		scope: {
			editorTitle: '@',
			editorPatternText: '@',
			editorOnSave: '&',			
			editorEnabled: '=',
			editorValidate: '&',
			editorValidateText: '@',
			editorPlaceholder: '@',
			//property to edit
			editorProperty: '=',
			//field name to edit
			editorField: '@',
			//complete entity
			editorEntity: '='
		},
		template: function(element, attrs) {
			var required = attrs.hasOwnProperty('editorRequired') ? "required='required'" : "",
				pattern = attrs.hasOwnProperty('editorPattern') ? "ng-pattern='"+attrs.editorPattern+"'" : "",
				editorFieldAttr = attrs.hasOwnProperty('editorField') ? attrs.editorField : null,
				editorEntityAttr = attrs.hasOwnProperty('editorEntity') ? attrs.editorEntity : null,
				html;

			if(!editorFieldAttr || !editorEntityAttr) {
				html =	'<div class="toggler" ng-transclude></div>'+
				'<div class="simple-property-editor-mask"></div>'+			
				'<div class="simple-property-editor" style="display:none; position:absolute; background-color:white;">'+
				'<h5 class="editor-title" l="{{editorTitle}}">Edit property</h5>'+
				'<form name="simplePropertyForm" novalidate ng-submit="save()" class="edit-property-form">'+
					'<div class="">'+
					 	'<div class="control-group" ng-class="getFieldInputClass(simplePropertyForm.simpleProperty.$invalid)">'+
					 		'<div class="controls">'+
					 			createFormInput(attrs)+
					 			'<i class="icon-remove icon-black" ng-click="clearInput()"></i>'+
								'<div class="help-inline" ng-show="simplePropertyForm.simpleProperty.$dirty && simplePropertyForm.simpleProperty.$invalid">'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.required">'+ l('propertyeditor.error.required') +'</span>'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.number">'+ l('propertyeditor.error.number') +'</span>'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.pattern" l="{{editorPatternText}}">No valid value.</span>'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.custom" l="{{editorValidateText}}">No valid value.</span>'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.email" >+'+ l('propertyeditor.error.email')+'</span>'+									
								'</div>'+
							'</div>'+
						'</div>'+
						createRepeatInput(attrs)+
					'</div>'+
					'<div class="row-fluid">'+
						'<button type="button" ng-click="closeDialog()" class="btn span6" data-dismiss="modal">'+l('common.cancel')+'</button>'+
						'<button type="submit" class="btn btn-primary span6" ng-disabled="simplePropertyForm.$invalid">'+l('common.save')+'</button>'+
					'</div>'+
					'</form>'+
				'</div>';
			} else {
				html =	'<div class="toggler" ng-transclude></div>'+
				'<div class="simple-property-editor-mask"></div>'+			
				'<div class="simple-property-editor" style="display:none; position:absolute; background-color:white;">'+
				'<h5 class="editor-title" l="{{editorTitle}}">Edit property</h5>'+
				'<form name="simplePropertyForm" novalidate ng-submit="save()" class="edit-property-form">'+
					'<div class="edit-property-form-inputs">'+
						//bind default entity
					 	'<div class="control-group" ng-class="getFieldInputClass(simplePropertyForm.simpleProperty.$invalid)">'+
					 		'<div class="controls">'+
					 			createFormInput(attrs)+
					 			'<i class="icon-remove icon-black" ng-click="clearInput()"></i>'+
								'<div class="help-inline" ng-show="simplePropertyForm.simpleProperty.$dirty && simplePropertyForm.simpleProperty.$invalid">'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.required">'+ l('propertyeditor.error.required') +'</span>'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.number">'+ l('propertyeditor.error.number') +'</span>'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.pattern" l="{{editorPatternText}}">No valid value.</span>'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.custom" l="{{editorValidateText}}">No valid value.</span>'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.email" >+'+ l('propertyeditor.error.email')+'</span>'+									
								'</div>'+
							'</div>'+
						'</div>'+
						'<div ng-repeat="t in editorEntity.translations">'+
							'<div class="control-group" ng-class="getFieldInputClass(simplePropertyForm.simpleProperty{{t.lang}}.$invalid)">'+
								'<div class="controls">'+
									'<label>{{getLanguageTitle(t.lang)}}</label>'+
									createFormInput(attrs, 't.lang')+
									'<i class="icon-remove icon-black" ng-click="clearInput(t.lang)"></i>'+
							// '<input class="property-input" type="' + attrs.editorType + '" '+placeholder+' name="simpleProperty_$index" ng-model="editorValue"></input>';
								'</div>'+
							'</div>'+
						'</div>'+
						//repeat over translations
						// createRepeatedFormInput(editorEntityAttr.translations, attrs) +							
					'</div>'+
					'<div class="row-fluid" style="margin-top: 5px">'+
						'<button type="button" ng-click="closeDialog()" class="btn" data-dismiss="modal" style="margin-right: 5px;">'+l('cancel')+'</button>'+
						'<button type="submit" class="btn btn-primary" ng-disabled="simplePropertyForm.$invalid">'+l('save')+'</button>'+
					'</div>'+
					'</form>'+
				'</div>';
			}

			return html;
		},
		compile: function(element, attrs, transclude) {
			var required = attrs.hasOwnProperty('editorRequired') ? "required='required'" : "",
				pattern = attrs.hasOwnProperty('editorPattern') ? "ng-pattern='"+attrs.editorPattern+"'" : "",
				editorFieldAttr = attrs.hasOwnProperty('editorField') ? attrs.editorField : null,
				editorEntityAttr = attrs.hasOwnProperty('editorEntity') ? attrs.editorEntity : null,
				html;

			return {
		        pre: function preLink(scope, iElement, iAttrs, controller) { 
		        	
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
		        	var dialog = iElement.find('div.simple-property-editor'),
		        		mask = iElement.find('div.simple-property-editor-mask'),
		        		input = iElement.find('input.property-input, textarea.property-input'),
		        		ctrl = scope.simplePropertyForm.simpleProperty,
		        		hasEditorEntity = iAttrs.hasOwnProperty('editorEntity');

		        	if(iAttrs.hasOwnProperty('editorValidate')) {
		        		ctrl.$parsers.push(function(value) {
			        		if(scope.editorValidate) {
			        			if(scope.editorValidate({'value' : value})) {
			        				ctrl.$setValidity('custom', true);
			        				return value;
			        			}
			        			else {
			        				ctrl.$setValidity('custom', false);
			        				return undefined;
			        			}	
			        		}
			        	});	
		        	}
		        	
		        	scope.save = function () {
		        		//only save when form is valid
		        		if(scope.simplePropertyForm.$valid && !scope.saved) {

		        			scope.saved = true;		        			

		        			if(hasEditorEntity) {
		        				// Set default language property
		        				scope.editorEntity[scope.editorField] = scope.editorValue;
		        				angular.forEach(scope.editorEntity.translations, function(translation, key){
		        					// Set value of the field in the translation object
  										translation[scope.editorField] = scope.editorTranslations[key];
										});
		        			}
		        			else {
		        				scope.editorProperty = scope.editorValue;
		        			}		     
		        			// angular.forEach
		        			// Wrap this in a timeout, because the model change is not immediate.
			        		$timeout(scope.editorOnSave);
			        		// dialog.modal('toggle');

			        		mask.hide();
		        			dialog.hide();
		        		}
		        	}

		        	scope.closeDialog = function() {
		        		mask.hide();
		        		dialog.hide();
		        	}

		        	/**
		        	* Convenience method to clear the input field.
		        	*/
		        	scope.clearInput = function(translation) {
		        		if(translation) {
		        			scope['editorTranslations'][translation] = "";
		        			var attributeSelector = '[name="simpleProperty'+translation+'"]';
		        			iElement.find('input'+attributeSelector+'.property-input, textarea'+attributeSelector+'.property-input').trigger("focus");
		        		} else {
		        			scope['editorValue'] = "";
		        			input.trigger("focus");
		        		}
		        		
		        		if(scope['editorRepeat']) {
		        			scope['editorRepeat'] = "";
		        		}
		        		
		        	}

		        	scope.matchInput = function() {
						if(scope.simplePropertyForm.simpleProperty.$viewValue !== scope.simplePropertyForm.repeatProperty.$viewValue) {
							scope.simplePropertyForm.repeatProperty.$setValidity("match", false);
						} else {
							scope.simplePropertyForm.repeatProperty.$setValidity("match", true);
						}
					}

					scope.getLanguageTitle = function(code) {
							if(!code) {
								return;
							}
							if(langcodesMap[code])
								return langcodesMap[code].lang;
							else
								return code;
	        	}
		        	
		        	iElement.find('div.toggler').bind('click', function() {
		        		if(scope.editorEnabled == true || typeof scope.editorEnabled == 'undefined') {
		        			scope.editorRepeat = "";
		        			scope.saved = false;
		        			if(hasEditorEntity) {
		        				scope.editorValue = scope.editorEntity[scope.editorField];
		        				scope.editorTranslations = {};
		        				angular.forEach(scope.editorEntity.translations, function(translation, key){
		        					// Set value of the field in the translation object
  										scope.editorTranslations[key] = translation[scope.editorField];
										});
		        			}
		        			else {
		        				scope.editorValue = scope.editorProperty;
		        			}

		        			scope.$digest();

		        			// dialog.modal('toggle');
		        			var titleHeight,  
		        				offsetTop, 
		        				maskHeight, 
		        				maskWidth,
		        				dataElementValue,
		        				dataElementValueLeft;
		        			
		        			offsetTop = iElement.find('div.toggler').offset().top - iElement.find('div.toggler').offsetParent().offset().top;
		        			titleHeight = iElement.find('h5.editor-title').css('lineHeight');
		        			titleHeight = titleHeight.replace('px','');
		        			dataElementValue = iElement.find('div.value');

		        			maskHeight = $(document).height();
        					maskWidth = $(window).width();
		        			 //Set height and width to mask to fill up the whole screen
        					mask.css({'width':maskWidth,'height':maskHeight}); 
        					mask.show();

        					//if editor is used on a data-element use value div to calculate left!
        					//TODO 14.12.2012 this should be optimized to avoid dependencies to html
        					//maybe make it configurable.
        					try {
        						if(dataElementValue && dataElementValue.length == 1) {
        							dataElementValueLeft = dataElementValue.offset().left - dataElementValue.offsetParent().offset().left;
        							dialog.css('left', dataElementValueLeft);
        						}	
        					} catch(e) {
        						$log.error('simplePropertyEditor: failed to calculate left');
        					}
        					

		        			dialog.css('top', offsetTop - titleHeight - 25);
		        			dialog.show();

		        			input.trigger("focus");
		        		}
					});

					mask.bind('click', function() {
						scope.closeDialog();
					});

					dialog.bind('keyup', function(event) {
						//hide dialog on escape
						if(event.which == 27) {
							scope.closeDialog();	
						}						
					});

		        	scope.getFieldInputClass = getFieldInputClass;		        	

		        }
		      }
		}
	};

	function l(key) {
		return langService.translate(key) || key;
	}

	/**
	* Creates a form input control group for repeated input.
	* @param attrs
	*	Attributes object containing configuration.
	*/
	function createRepeatInput(attrs) {
		var required = attrs.hasOwnProperty('editorRequired') ? "required='required'" : "",
			repeat = attrs.hasOwnProperty('editorRepeat'),
			pattern = attrs.hasOwnProperty('editorPattern') ? "ng-pattern='"+attrs.editorPattern+"'" : "",
			type = 	attrs.hasOwnProperty('editorType') ? attrs.editorType : "text",
			inputHtml;
		
		if(!repeat)
			return '';

		if(type == "textarea") {
			inputHtml = '';
		} else {
			if(type != "email" && type != "password" && type != "number") {
				type = "text";
			}

			inputHtml = '<div class="control-group" ng-class="getFieldInputClass(simplePropertyForm.repeatProperty.$invalid)">'+
		 		'<div class="controls">'+
		 			'<input type="'+type+'" name="repeatProperty" ng-model="editorRepeat" l-attribute="placeholder" l="propertyeditor.repeat.placeholder" required ng-change="matchInput()"></input>'+
					'<div class="help-inline" ng-show="simplePropertyForm.repeatProperty.$dirty && simplePropertyForm.repeatProperty.$invalid">'+
						'<span ng-show="simplePropertyForm.repeatProperty.$error.required">'+ l('propertyeditor.error.required') +'</span>'+
						'<span ng-show="simplePropertyForm.repeatProperty.$error.match">'+ l('propertyeditor.error.match') +'</span>'+
					'</div>'+
				'</div>'+
			'</div>';
		}

		return inputHtml;
	}

	/**
	* Creates an html input tag based on the given configuration.
	* @param attrs
	*	Attributes object containing configuration.
	*/
	function createFormInput(attrs, suffix) {
		var required = attrs.hasOwnProperty('editorRequired') && !suffix ? "required='required'" : "",
			pattern = attrs.hasOwnProperty('editorPattern') ? "ng-pattern='"+attrs.editorPattern+"'" : "",
			repeat = attrs.hasOwnProperty('editorRepeat') ? "ng-change='matchInput()'" : "",
			maxLength = attrs.hasOwnProperty('editorMaxLength') ? "maxlength='"+attrs.editorMaxLength+"'" : "",
			placeholder = attrs.hasOwnProperty('editorPlaceholder') ? "placeholder='"+l(attrs.editorPlaceholder)+"'" : "",
			type = 	attrs.hasOwnProperty('editorType') ? attrs.editorType : "text",
			inputName = (suffix) ?  ("{{'simpleProperty'+"+ suffix + "}}") : "simpleProperty",
			modelBinding = (suffix) ? ("editorTranslations["+suffix+"]") : "editorValue",
			inputHtml;

		if(type == "textarea") {
			inputHtml = '<textarea class="property-input" rows="4" cols="100" name="'+ inputName + '" ng-model="' + modelBinding + '" ' + maxLength +' '+required+' '+pattern+' '+placeholder+'></textarea>';
		} else {
			if(type != "email" && type != "password" && type != "number" && type != "url") {
				type = "text";
			}

			inputHtml = '<input class="property-input" type="'+type+'" '+placeholder+' name="'+ inputName + '" ng-model="' + modelBinding + '" '  + maxLength +' '+required+' '+pattern+' '+repeat+'></input>';
		}

		return inputHtml;
	}

	function createRepeatedFormInput(translations, attrs) {
		var html;

		angular.forEach(translations, function(t, index) {
			html = '<div class="control-group"'+
			 		'<div class="controls">'+
			 			createFormInput(attrs, index)+
			 			'<i class="icon-remove icon-black" ng-click="clearInput(' + index + ')"></i>'+
			 			//no validation
			 			//currently no validations for translations
						// '<div class="help-inline" ng-show="simplePropertyForm.simpleProperty.$dirty && simplePropertyForm.simpleProperty.$invalid">'+
						// 	'<span ng-show="simplePropertyForm.simpleProperty.$error.required">'+ l('propertyeditor.error.required') +'</span>'+
						// 	'<span ng-show="simplePropertyForm.simpleProperty.$error.number">'+ l('propertyeditor.error.number') +'</span>'+
						// 	'<span ng-show="simplePropertyForm.simpleProperty.$error.pattern" l="{{editorPatternText}}">No valid value.</span>'+
						// 	'<span ng-show="simplePropertyForm.simpleProperty.$error.custom" l="{{editorValidateText}}">No valid value.</span>'+
						// 	'<span ng-show="simplePropertyForm.simpleProperty.$error.email" >+'+ l('propertyeditor.error.email')+'</span>'+									
						// '</div>'+
					'</div>'+
				'</div>';
		});
	}

	/*
	* Get css class for field highlighting.
	* 
	* @param {boolean}  
	* @returns error if invalid
	*		  success if !invalid
	*         empty string otherwise
	*/
	function getFieldInputClass(invalid) {
		if(invalid) {
			return "error";
		} else if (!invalid) {
			return "success";
		} else {
			return "";
		}
	};

	return config;
}]);