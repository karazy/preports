'use strict';

/**
* Encapsulates command handling for do and undo of commands.
*
* ATTENTION!
* Each view should call reset to work on a clean state.
* Restoring command states between views is currently not supported.
* Currently only used in report detail view.
*/
angular.module('PReports.services').service('commandService', [
	'$log',
	'errorHandler',
	'$q',
	function($log, errorHandler, $q) {

		/**
		 * Size of the command queue that holds undo events.
		 */
		var COMMAND_QUEUE_SIZE = 20,

			/**
			 * List of executed commands during report editing
			 */
			commands = [],

			/**
			* List of commands waiting for execution.
			*/
			pending = [];

		var _service = {
			/**
			 * Stores command in queue and executes it.
			 * @param {Function} command
			 *   Object with execute and undo function.
			 */
			storeAndExecuteCmd: function(command) {
				var undoFn = true;

				if (!command) {
					$log.log('storeAndExecuteCmd: no command given');
					return;
				}

				if (typeof command != 'object') {
					$log.log('storeAndExecuteCmd: command is not an object');
					return;
				}

				if (!command.hasOwnProperty('execute') || typeof command.execute != 'function') {
					$log.log('storeAndExecuteCmd: no execute method found or not a function');
					return;
				}

				if (!command.hasOwnProperty('undo') || typeof command.undo != 'function') {
					$log.log('storeAndExecuteCmd: no undo method found or not a function. Command not added to queue.');
					undoFn = false;
				}

				if (undoFn) {
					if (commands.length == COMMAND_QUEUE_SIZE) {
						//only store last COMMAND_QUEUE_SIZE commands
						commands = commands.slice(1);
						commands.push(command);
					} else {
						commands.push(command);
					}
				}

				if(pending.length === 0) {
					$log.log('No pending command found. Execute directly.');
					pending.push(command);
					executeNextCmd();						
				} else {
					$log.log('Pending commands found. Put in queue.');
					pending.push(command);
				}
				

				

				/*try {
					command.execute();
				} catch (e) {
					$log.log('storeAndExecuteCmd: failed to execute command. ' + e);
					commands.pop(command);
					alert('commmand execution failed!');
				}*/
			},

			undo: function() {
				var commandToUndo;

				//TODO add promise logic for undo commands as well

			      if (commands.length > 0) {
			        commandToUndo = commands.pop();
			        commandToUndo.undo();
			      } else {
			        $log.log('undo: no commands in queue');
			      }
			},

			/**
			* Get the amount of stored commands.
			*/
			getAmount: function() {
				return commands.length;
			},

			/**
			* Reset commands.
			*/
			reset: function() {
				commands = [];
				pending = [];
			}
		}

		function executeNextCmd() {
			var command = pending.shift();
			
			if(command) {
				if(command.promise) {
					command.execute();
					$log.log('commandService: found promise');
					command.promise.then(function() {
						$log.log('commandService: promise was successful');
						//success
						executeNextCmd();	
					}, function() {
						//error
						//clear remaining tasks and log error
						pending = [];
						$log.log('commandService: failed to execute command clear pending commands.');
					});
				} else {
					command.execute();
					executeNextCmd();
				}
			}
		}

		return _service;
	}
]);