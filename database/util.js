'use strict';

exports.removeSpecialChar = removeSpecialChar;
exports.normalizeString = normalizeString;

function isNumber (text) {
  var reg = new RegExp('[0-9]+$');
  if(text) {
    return reg.test(text);
  }
  return false;
}

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

        return normalized.toLowerCase();
    }

    return '';
    
}