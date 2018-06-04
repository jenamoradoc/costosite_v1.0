var db = require('../db');
var config = require('config');
var dbConfig = config.get('dbConfig');
/***********************************************
TABLA ROL
************************************************
create table costos.rol
(id serial,
descripcion varchar(100)
);
*************************************************/
function getAllRoll(req, res) {
  db.many('select * from  ' + dbConfig.schema + '.rol')
    .then(function (data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message: 'No se han encontrado roles'});
        console.log(err);
      }else{
        res.status(500).send({message:'Error en el servidor'});
      }
    });
}
/*
function createRoll(req, res, next) {
    db.none('insert into '+ dbConfig.schema + '.rol(descripcion) ' +
        'values($1)', [req.body.descripcion])
      .then(function () {
        res.status(200)
          .send({
            status: 'success',
            message: 'Inserted one rol'
          });
      })
      .catch(function (err)
      {
        if(err.received == 0)
        {
          res.status(404).send({message: 'No se ha creado el rol'});
          console.log(err);
        }else{
          res.status(500).send({message:'Error en el servidor '+err});
        }
      })
}*/
module.exports = {
  //createRoll,
  getAllRoll
}
