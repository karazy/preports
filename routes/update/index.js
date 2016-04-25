'use strict';
/**
 *  This class provides methods to upgrade the model data if none compatible changes occur.
 * 
 */

var mongo = require('../../database/mongo'),
    logger = require('../../components/logger'),
    reportsRoute = require('../reports');
    

exports.migrateCostTypesV1toV2 = migrateCostTypesV1toV2;

/**
 * Migrates to new cost structure introduced with version 1.7
 */
function migrateCostTypesV1toV2(req, res) {
    var reportsCol,
        updatedItems = 0;
    
    reportsCol = mongo.getReportsCollectionPromise().then(migrate);
    
    function migrate(result) {
        logger.info('Starting to migrate reports with cost type v1 to v2.');
        
        if(result.error) {
            logger.error('Failed to load reports collection.', result.error);
            res.status(500).send();
            return;
        }                
        
        result.reports.find({}, {})		
            .toArray(function(err, items) {
                logger.info('Loaded %s reports', items.length);
                if(items) {
                    items.forEach(function(report) {
                        if(isReportCostTypeV1(report)) {
                            logger.info('Migrate report %s', report._id.toString())
                            migrateCostTypesV1toV2ForReport(report);
                            updateReport(result.reports, report);
                            updatedItems++;
                        }
                    });	
                }
                res.status(200).send({'modified' : updatedItems});
        });      
    }
}


function isReportCostTypeV1(report) {
    
    if(report.hoursExternal || report.hoursInternal || report.hoursNearshore) {
        return true;
    }
    
    return false;
}

function migrateCostTypesV1toV2ForReport(report) {
    
    logger.info('Report before migration.', report);
    
    report.costs = [];
    
    report.costs.push( {
            'name' : 'Extern',
            'costsPerUnit' : 85,
            'unit' : 'h',
            'quantity' : report.hoursExternal || 0
    });
    
    delete report.hoursExternal;
    
   report.costs.push( {
            'name' : 'Intern',
            'costsPerUnit' : 68,
            'unit' : 'h',
            'quantity' : report.hoursInternal || 0
    });
    
    delete report.hoursInternal;
    
    report.costs.push( {
            'name' : 'Nearshore',
            'costsPerUnit' : 45,
            'unit' : 'h',
            'quantity' : report.hoursNearshoring || 0
    });
    
    delete report.hoursNearshoring;
    
    logger.info('Report after migration.', report);
}

function updateReport(reportsCol, report) {
    
    var _id = report._id;
    
     logger.info('Updating report %s', _id.toString());
    
    reportsCol.updateOne({'_id': _id}, report, function(err, numberOfUpdatedDocs) {
        if(err) {
            logger.error(err);
            return;
        }               
        
        reportsRoute.updateReportVersion(_id.toString(), report, reportsCol, function(success, reportWIncreasedVersion) {

            if(!success) {
                logger.info('Updated report %s', _id.toString());	
            } else {
                logger.error('Failed update report %s', _id.toString())
            }
            
        });
        
    });
}