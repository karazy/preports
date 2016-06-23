'use strict';

/**
 * Utility methods mainly for use with the database.
 */

exports.removeSpecialChar = removeSpecialChar;
exports.normalizeString = normalizeString;

function isNumber (text) {
  var reg = new RegExp('[0-9]+$');
  if(text) {
    return reg.test(text);
  }
  return false;
}

/**
 * Removes special characters from a string.
 * Inspired by: http://stackoverflow.com/questions/6555182/remove-all-special-characters-except-space-from-a-string-using-javascript/26482650#26482650
 */
function removeSpecialChar(text) {
  if(text) {
    var lower = text.toLowerCase();
    var upper = text.toUpperCase();
    var result = "";
    for(var i=0; i<lower.length; ++i) {
      if(isNumber(text[i]) || (lower[i] != upper[i]) || (lower[i].trim() === '')) {
        result += text[i];
      }
    }
    return result;
  }
  return '';
}

function normalizeString(text) {
    var normalized = '';

    if(text) {
        normalized = removeSpecialChar(text);

        return normalized.toLowerCase().trim();
    }

    return '';
    
}