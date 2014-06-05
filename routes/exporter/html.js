var j2h = require('node-json2html');

//TODO add pagination

/**
* Transform object for report lists
*/
var listTransform = {	
	'tag' : 'div',
	'html' : '<h1>List of reports</h1>'+
		'<p style="margin-bottom:20px;"><a href="/" target="_self">&lt; root</a></p>',
	'children': [
		{
			'tag' : 'div',
			'children': function(obj){
			    return(json2html.transform(obj.reports,listReportTransform));
			}
		},
		{
			'tag' : 'div',
			'children': function(obj){
				var html = '';
				if(obj._links) {
					if(obj._links.prev) {
						html += '<a href="'+obj._links.prev.href+'" target="_self">&lt; prev</a><span> </span>'
					}
					if(obj._links.next) {
						html += '<a href="'+obj._links.next.href+'" target="_self">next &gt;</a>'
					}					
				}
				html += '<br/><br/>Page ' + obj.currentPage + '/' + obj.totalPages + '<br/>Total reports ' + obj.totalCount;

			    return html;
			}
		}
	]
}

/**
* Transform object for report list items
*/
var listReportTransform = {
	'tag' : 'div',
	'html' : '<a target="_self" href="${_links.self.href}">${name}</a> - CW ${week}|${year}'
}

/**
* Transform object for asingle report
*/
var reportTransform = {
	'tag' : 'div',
	'html' : 
		'<p><a target="_self" href="${_links.collection.href}">&lt; All Reports</a></p>'+
		'<h1>${name}</h1>'+
		'<p>CW ${week}</p>'+
		'<p>Year ${year}</p>'+
		'<p>Start ${start}</p>'+
		'<p>Go live ${goLive}</p>'+
		'<p>Lead developers ${leadDevelopers}</p>'+
		'<p>Project managers ${projectManagers}</p>'+
		'<p>Last week tasks ${lastWeekTasks}</p>'+
		'<p>Next week tasks ${nextWeekTasks}</p>',
	'children':[
		{
			'tag' : 'div',
			'html' : 'Milestones',
			'children': function(obj){
			    return(json2html.transform(obj.milestones, {
			    	'tag' : 'ul',
			    	'html' : '<li>Name: ${name} | Start: ${start} | End: ${End}</li>'
			    }));
			}	
		},
		{
			'tag' : 'div',
			'html' : 'Code reviews',
			'children': function(obj){
			    return(json2html.transform(obj.codeReviews, {
			    	'tag' : 'ul',
			    	'html' : '<li>Topic: ${underReview} | Reviewer: ${authors} | Content: ${result}</li>'
			    }));
			}	
		},
		{
			'tag' : 'div',
			'html' : 'Systems',
			'children': function(obj){
			    return(json2html.transform(obj.systems, {
			    	'tag' : 'ul',
			    	'html' : '<li>Name: ${name} | Url: ${url} | Remarks: ${remarks}</li>'
			    }));
			}	
		},
		{
			'tag' : 'div',
			'html' : 'Images',
			'children': function(obj){
			    return(json2html.transform(obj.images, {
			    	'tag' : 'ul',
			    	'html' : '<li>Filename: ${filename} | Name: ${name} | Link: <a href="${_links.self.href}" target="_blank">Self</a></li>'
			    }));
			}	
		}
			
		]	
}

function getHtmlHeader() {
	var header;
	//xmlns="http://www.w3.org/1999/xhtml"
	header = '<!DOCTYPE html><html><body>';

	return header;
}

function getHtmlFooter() {
	var header;

	header = "</body></html>";

	return header;
}


/**
* Transforms json reports into an html representation.
* @param reports
*	Reports to transform. Including metadata.
* @return 
*	HTML representation or false if no reports given
*/
exports.transformReportList = function(reports) {
	if(!reports) {
		console.log('transformReportList: no reports given');
		return false;
	}

	var transform = j2h.transform(reports, listTransform);
	
	//build valid html document
	transform = getHtmlHeader().concat(transform);
	transform = transform.concat(getHtmlFooter());

	return transform;
}

/**
* Transforms json report into an html representation.
* @param report
*	Report to transform. Including metadata.
* @return 
*	HTML representation or false if no reports given
*/
exports.transformReport = function(report) {
	if(!report) {
		console.log('transformReportList: no report given');
		return false;
	}

	var transform = j2h.transform(report, reportTransform);
	
	//build valid html document
	transform = getHtmlHeader().concat(transform);
	transform = transform.concat(getHtmlFooter());

	return transform;
}