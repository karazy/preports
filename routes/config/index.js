'use strict';

var fs = require('fs-extra'),
    logger = require('../../components/logger');
    
const LOGO_PATH = 'resources/logo.png';

/**
 * Get Logo
 * @return 
 *  logo.png is placed in /resources.
 *  404 if none exists 
 * 
 */
exports.getLogo = function(req, res) {
    var img,
        imgPath = LOGO_PATH;
 
    if(isFile(imgPath)) {
        img = fs.readFileSync(imgPath);
        res.contentLength = img.size;
        res.contentType = 'image/png';
        res.set('Cache-Control', 'public, max-age=86400');
        res.status(200).end(img, 'binary');
    } else {
        logger.error('getLogo: no logo found');
        //no logo configured. That's ok!
        res.sendStatus(204);
        res.end();
        return;
    }
}

/**
* Checks if given path is a file.
* @return 
*	true if it is a file.
* 	false if it is not a file or does not exists at all
*/
function isFile(file) {
	var stats;

	try {
		stats = fs.statSync(file);
	} catch(e) {
		logger.info("isFile: file "+file+" does not exist");
		return false;
	}

	return stats.isFile();
}