'use strict'

var ldap = require('ldapjs');

var ActiveDirectory = require('activedirectory');
var jwt = require('../services/jwt');
var db = require('../db');
var config = require('config');
var dbConfig = config.get('dbConfig');

//========log USer from Data base =============

function logdb(users){
  return new Promise((resolve, reject) => {
    db.one('select * from '+ dbConfig.schema + '.empleados where usuario = $1', users)
    .then(function (data){
        resolve(data);
    })
    .catch(function(err){
        reject(err);
    });
  });
}

//========== function ldap login ========================

function loginUser(req, res){

  var params = req.body;

  var username = params.user+'@grupoassa';
  var password = params.pass;
  var config = { url: 'ldap://assa02.grupoassa'};


  var ad = new ActiveDirectory(config);

  ad.authenticate(username, password, function(err, auth) {
    if (err) {
      res.status(500).send({message:'ERROR: '+JSON.stringify(err)});
      return;
    }

    if (auth) {
      logdb(params.user)
        .then(function(data){
          res.status(200).send({
            message: 'Authenticated!',
            token: jwt.createToken(data),
            user: data
          });
        }).catch((error) =>{
          if(error.recived==0){
          res.status(404).send({message: 'Not found Data'})
        }else{
        res.status(404).send({message: 'Error de sistema: '+err})}
        });
    }else {
      res.status(400).send({message:'Authentication failed!'});
    }
    })
}

/*
  var username = 'srvagentesdc@grupoassa';
  var password = 'vY5wU6IWahgzBX3xNMw8';
  var config = { url: 'ldap://assa02.grupoassa',
                 baseDN: 'dc=grupoassa',
                 username: username,
                 password: password
               }*/



module.exports = {
  loginUser,
};
