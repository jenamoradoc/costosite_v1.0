'use strict'

var jwt = require('jwt-simple');
var moment = require('moment'); 
var config = require('./config'); 

exports.createToken = function(user){
    console.log('entro a la nueva generacion de token');
    
	var payload = {
		username: user.username,
		mail:user.mail,
		iat: moment().unix(), //fecha de creacion del token
		exp: moment().add(14, 'days').unix //expiracion token
	};
	return jwt.encode(payload, config.TOKEN_SECRET);
}
