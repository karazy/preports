'use strict';

/**
* Encapsulates command handling for do and undo of commands.
*
* TODO add command interface description
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
			pending = [],

			/**
			* List of undos waiting for execution.
			*/
			undosPending = [];

		var _service = {
			/**
			 * Stores command in queue and executes it.
			 * @param {Function} command
			 *   Object with execute and undo function.
			 */
			storeAndExecuteCmd: function(command) {
				var undoFn = true,
					oldCmd;

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

				//if command supports undo add it to commands list
				if (undoFn) {
					if (commands.length == COMMAND_QUEUE_SIZE) {
						//only store last COMMAND_QUEUE_SIZE commands
						//commands = commands.slice(1);
						oldCmd = commands.shift();
						oldCmd = null;
						commands.push(command);
					} else {
						commands.push(command);
					}
				}

				if(command.promise) {
					//if command is promise execute one after another (queue)
					if(pending.length === 0) {
						//$log.log('No pending command found. Execute directly.');
						pending.push(command);
						executeNextCmd();
					} else {
						$log.log(pending.length + ' pending commands. Put command in queue.');
						pending.push(command);
					}
				} else {
					try {
						command.execute();
					} catch (e) {
						$log.log('storeAndExecuteCmd: failed to execute command. ' + e);
						commands.pop(command);
						alert('commmand execution failed!');
					}
				}
			},
			/**
			* Undo last command. 
			* See this.undosPending array.
			*
			*/
			undo: function() {
				var undoCommand;

			      if(commands.length > 0) {
						undoCommand = commands.pop();
			        if(undoCommand.undoPromise) {
			        	if(undosPending.length === 0) {
			        		undosPending.push(undoCommand);
			        		undoPrevCmd();	
			        	} else {
			        		$log.log(undosPending.length + ' pending undos. Put command in queue.');
			        		undosPending.push(undoCommand);
			        	}
			        } else {
			        	undoCommand.undo();
			        }
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
				undosPending = [];
			}
		}

		function undoPrevCmd() {
			var command = undosPending[0];
			
			if(command !== 'undefined' && command != null) {
				if(command.undoPromise) {
					command.undoPromise.then(function() {
						//promise resolved
						undosPending.shift();
						undoPrevCmd();
					}, function() {
						//promise rejected
						//clear remaining tasks and log error
						//needed to keep consistency of object
						undosPending = [];
						$log.log('commandService: failed to undo command. Clear pending undos.');
					});
					//call actual undo action
					command.undo();
				}
			}
		}

		function executeNextCmd() {
			var command = pending[0];
			
			if(command !== 'undefined' && command != null) {
				//try {
					if(command.promise) {
						command.promise.then(function() {
							//promise resolved
							pending.shift();
							executeNextCmd();
						}, function() {
							//promise rejected
							//clear remaining tasks and log error
							//needed to keep consistency of object
							pending = [];
							$log.log('commandService: failed to execute command clear pending commands.');
						});
						//call actual command action
						command.execute();
					}
			}
		}

		return _service;
	}
]);