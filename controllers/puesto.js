  var db = require('../db');
  var config = require('config');
  var dbConfig = config.get('dbConfig');
  /***********************************************
  TABLA PUESTOS
  ************************************************
  create table costos.asignacion
  (id serial,
  piso integer,
  puesto integer,
  responsable_id integer,
  asignado_id integer
  );
  *************************************************/
  function getAll(req, res) {
    db.many('select p.piso, p.puesto, p.asignado_id,empA.nombre as asignado_nombre,empA.apellido as asignado_apellido,empA.Usuario as asignado_usuario,p.responsable_id, empR.nombre as responsable_nombre, empR.apellido as responsable_apellido,empR.usuario as responsable_usuario from '
    +dbConfig.schema+'.puesto as p left join '
    +dbConfig.schema+'.empleados as empA on p.asignado_id = empA.id left join '
    +dbConfig.schema+'.empleados as empR on p.responsable_id = empR.id')
      .then(function (data) {
        res.status(200).send({
            data: data
          });
      })
      .catch(function (err) {
        if(err.received == 0){
          res.status(404).send({message: 'No se han encontrado puesto'});
          console.log(err);
        }else{
          res.status(500).send({message:'Error en el servidor'});
        }
      });
  }

  function setPuesto(req, res) {
    db.one('select resp.id as resp_id, asig.id as asig_id from '+ dbConfig.schema + '.empleados as resp inner join '
    +dbConfig.schema + '.empleados as asig on resp.usuario = $1 where asig.usuario = $2',[req.body.responsable,req.body.asignado])
    .then(function(usuarios){
      db.none('insert into '+ dbConfig.schema +'.puesto(piso,puesto,asignado_id,responsable_id) '+ 'values($1,$2,$3,$4)',
    [parseInt(req.body.piso), parseInt(req.body.puesto), parseInt(usuarios.asig_id), parseInt(usuarios.resp_id)])
      .then(function () {
        res.send({message: 'Inserción exitosa'});
          })
      .catch(function (err){
        if(err.received == 0){
          res.send({message: 'No se ha creado el puesto '+ err});
        }else{
          res.send({message: 'Error en el servidor: '+err});
        }
      })
    })
    .catch(function(errUser){
      if(errUser.received == 0){
        db.none('insert into '+ dbConfig.schema +'.puesto(piso,puesto,asignado_id,responsable_id) '+ 'values($1,$2,$3,$4)',
      [parseInt(req.body.piso), parseInt(req.body.puesto), null, null])
        .then(function () {
          res.send({message: 'Inserción exitosa'});
            })
        .catch(function (err){
          if(err.received == 0){
            res.send({message: 'No se ha creado el puesto '+ err});
          }else{
            res.send({message: 'Error en el servidor: '+err});
          }
        })
        //res.send({message: 'No se ha encontrado el usuario '+ errUser});
      }else{
        res.send({message: 'Error en el servidor: '+errUser});
      }
    })
  }

  function getAsignacionPisoAux(piso, callback){
    db.many('select * from  ' + dbConfig.schema + '.puesto where piso = $1', piso)
      .then(function (data) {
        callback(data);
          })
      .catch(function (err) {
        if(err.received == 0){
          var message = 'No se han encontrado asignaciones';
          callback(message);
        }else{
          var message ='Error en el servidor';
          callback(message);
        }
      });
  }

  function getAsignacionPiso(req, res) {
      getAsignacionPisoAux(req.params.piso,function(data){
        res.send({data: data});
      })
  }


  function updatePuesto(req, res, next) {
    db.one('select resp.id as resp_id, asig.id as asig_id from '+ dbConfig.schema + '.empleados as resp inner join '
    +dbConfig.schema + '.empleados as asig on resp.usuario = $1 where asig.usuario = $2',[req.body.usuario_responsable,req.body.usuario_asignado])
    .then(function(usuarios){
      db.none('update '+ dbConfig.schema +'.puesto(piso,puesto,asignado_id,responsable_id,id) '+ 'values($1,$2,$3,$4,$5)',
    [parseInt(req.body.piso), parseInt(req.body.puesto), parseInt(usuarios.asig_id), parseInt(usuarios.resp_id),parseInt(req.body.id)])
      .then(function () {
        res.send({message: 'Actualización exitosa'});
          })
      .catch(function (err){
        if(err.received == 0){
          res.send({message: 'No se ha actualizado el puesto '+ err});
        }else{
          res.send({message: 'Error en el servidor: '+err});
        }
      })
    })
    .catch(function(errUser){
      if(errUser.received == 0){
        res.send({message: 'No se ha encontrado el usuario '+ errUser});
      }else{
        res.send({message: 'Error en el servidor: '+errUser});
      }
    })
  }

  function remove(req,res,next){
    db.result('delete from '+dbConfig.schema + '.puesto where id = $1',parseInt(req.params.id))
    .then(function (result) {
      res.status(200)
        .send({
          status: 'success',
          message: `Removed ${result.rowCount} puesto`
        });
    })
    .catch(function (err){
        res.status(500).send({message:'Error en el servidor'});
    });
  }

  module.exports = {
    getAll,
    setPuesto,
    updatePuesto,
    remove
  }
