/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var http = require('http');


exports.getCrucible = function(req, res) {
    var _reviewId = req.params.id;

    debugObject(req.params, 'getCrucible: params');
    var str = '';
    
    callback = function(response) {        
        response.on('data', function(chunk) {
            str += chunk;
            console.log("add " + chunk);
        });

        response.on('end', function() {
            console.log(str);           
        });
    };

    var path = '/rest-service/reviews-v1/' + _reviewId + '/comments';
    var innerReq = http.request({
        host: 'fisheye-appl-01',
        path: '/rest-service/reviews-v1/Monitoring-1/comments',
        port: '8060',
        method: 'GET',
        headers: {'Accept': 'application/json'}
    }, callback);
    innerReq.end();    
    
    
};
