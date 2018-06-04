var db = require('../db');
var config = require('config');
var dbConfig = config.get('dbConfig');

/***********************************************
TABLA ASIGNACION
************************************************
create table costos.asignacion
(
id serial,
cuenta_area varchar(100),
observaciones varchar(100),
centro_costos varchar(100),
tipo varchar(100),
asignacion_id integer,
porcentaje integer,
fecha date);
*************************************************/
/*___________________GET______________________*/
function getAllAsignacionVacio(req, res){
  db.many('select asig.*, p.piso, p.puesto, p.asignado_id,empA.nombre as asignado_nombre,empA.apellido as asignado_apellido,empA.Usuario as asignado_usuario,p.responsable_id, empR.nombre as responsable_nombre, empR.apellido as responsable_apellido,empR.usuario as responsable_usuario from  '
  +dbConfig.schema + '.asignacion as asig inner join '
  +dbConfig.schema+'.puesto as p on asig.puesto_id = p.id left join '
  +dbConfig.schema+'.empleados as empA on p.asignado_id = empA.id left join '
  +dbConfig.schema+'.empleados as empR on p.responsable_id = empR.id')
    .then(function (data) {
          res.send(data);
        })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message: 'No se han encontrado puestos'});
      }else{
        res.status(500).send({message:'Error en el servidor '+err});
      }
    });
}

function getAllAsignacion(req, res) {
  db.many('select asig.*, p.piso, p.puesto, p.asignado_id,empA.nombre as asignado_nombre,empA.apellido as asignado_apellido,empA.Usuario as asignado_usuario,p.responsable_id, empR.nombre as responsable_nombre, empR.apellido as responsable_apellido,empR.usuario as responsable_usuario from  '
  +dbConfig.schema + '.asignacion as asig inner join '
  +dbConfig.schema+'.puesto as p on asig.puesto_id = p.id inner join '
  +dbConfig.schema+'.empleados as empA on p.asignado_id = empA.id inner join '
  +dbConfig.schema+'.empleados as empR on p.responsable_id = empR.id')
    .then(function (data) {
          res.send(data);
        })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message: 'No se han encontrado puestos'});
      }else{
        res.status(500).send({message:'Error en el servidor '+err});
      }
    });
}

function getPuestoAsignacionAux(puesto,callback){
  db.one('select asig.*, p.piso, p.puesto, p.asignado_id,empA.nombre as asignado_nombre,empA.apellido as asignado_apellido,empA.Usuario as asignado_usuario,p.responsable_id, empR.nombre as responsable_nombre, empR.apellido as responsable_apellido,empR.usuario as responsable_usuario from '
  +dbConfig.schema + '.asignacion as asig inner join '
  +dbConfig.schema+'.puesto as p on asig.puesto_id = p.id inner join '
  +dbConfig.schema+'.empleados as empA on p.asignado_id = empA.id inner join '
  +dbConfig.schema+'.empleados as empR on p.responsable_id = empR.id where asig.puesto_id = $1', puesto)
    .then(function (data) {
      callback(data);
    })
    .catch(function (err) {
      if(err.recived == 0){
      console.log('No se han encontrado puestos');
      callback(err);
    }else{
        console.log('Error en el servidor: '+ err);
        callback(err);
      }
    });
}

function getPuestoAsignacion(req,res,next){
  getPuestoAsignacionAux(parseInt(req.params.puesto),function(data){
    res.send(data);
  })
}

function getAsignacionPiso(req, res) {
  var piso = parseInt(req.params.piso);
  db.one('select asig.*, p.piso, p.puesto, p.asignado_id,empA.nombre as asignado_nombre,empA.apellido as asignado_apellido,empA.Usuario as asignado_usuario,p.responsable_id, empR.nombre as responsable_nombre, empR.apellido as responsable_apellido,empR.usuario as responsable_usuario from '
  +dbConfig.schema + '.asignacion as asig inner join '
  +dbConfig.schema+'.puesto as p on asig.puesto_id = p.id inner join '
  +dbConfig.schema+'.empleados as empA on p.asignado_id = empA.id inner join '
  +dbConfig.schema+'.empleados as empR on p.responsable_id = empR.id where p.piso = $1',piso)
    .then(function (data) {
      res.status(200).send({
          puesto: data
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message: 'No se han encontrado puestos'});
      }else{
        res.status(500).send({message:'Error en el servidor: '+err});
      }
    });
}

function getAsignacionCC(req, res) {
  var cc = req.params.cc;
  db.many('select * from  ' + dbConfig.schema + '.asignacion where centro_costos = $1', cc)
    .then(function (data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message: 'No se han encontrado puestos'});
      }else{
        res.status(500).send({message:'Error en el servidor: '+err});
      }
    });
}

function getSingleAsignacion(req, res, next){
  var puestoID = parseInt(req.params.id);
  db.one('select asig.*, p.piso, p.puesto, p.asignado_id,empA.nombre as asignado_nombre,empA.apellido as asignado_apellido,empA.Usuario as asignado_usuario,p.responsable_id, empR.nombre as responsable_nombre, empR.apellido as responsable_apellido,empR.usuario as responsable_usuario from '
  +dbConfig.schema + '.asignacion as asig inner join '
  +dbConfig.schema+'.puesto as p on asig.puesto_id = p.id inner join '
  +dbConfig.schema+'.empleados as empA on p.asignado_id = empA.id inner join '
  +dbConfig.schema+'.empleados as empR on p.responsable_id = empR.id where asig.id = $1', puestoID)
    .then(function (data){
      res.status(200)
        .send({
          data: data
        });
    })
    .catch(function (err){
      if(err.received == 0){
        res.status(404).send({message: 'No se ha encontrado el puesto '+err});
        console.log(err);
      }else{
        res.status(500).send({message:'Error en el servidor: '+err});
      }
    });
}

//Funcion auxiliar para obtener puesto de empleado_id
function getAsignacionAux(asignacion_id,callback){
  db.many('select * from '+ dbConfig.schema + '.asignacion where puesto_id = $1', empleado_id)
    .then(function (data){
      callback(data);
    })
    .catch(function (err){
      callback(data);
    });
}

function getAsignacion(req, res, next){
  var asignacion_id = parseInt(req.params.asignacion_id);
  getAsignacionAux(asignacion_id,function(data){
    res.send({
        data: data
      });
  });
}

function getAsignacionAsignado(req, res, next){
  var nombre = '%'+req.params.nombre+'%';
  db.many('select asig.*, p.piso, p.puesto, p.asignado_id,empA.nombre as asignado_nombre,empA.apellido as asignado_apellido,empA.Usuario as asignado_usuario,p.responsable_id, empR.nombre as responsable_nombre, empR.apellido as responsable_apellido,empR.usuario as responsable_usuario from '
  +dbConfig.schema + '.asignacion as asig inner join '
  +dbConfig.schema+'.puesto as p on asig.puesto_id = p.id inner join '
  +dbConfig.schema+'.empleados as empA on p.asignado_id = empA.id inner join '
  +dbConfig.schema+'.empleados as empR on p.responsable_id = empR.id where (upper(empA.nombre) like upper($1) or upper(empA.apellido) like upper($1) or upper(empA.usuario) like upper($1))' , nombre)
    .then(function (empleado){
      res.send({data: empleado});
    })
    .catch(function (err){
      if(err.received == 0){
        res.status(404).send({message: 'No se ha encontrado el empleado: ' + nombre});
      }else{
        res.status(500).send({message:'Error en el servidor '+err});
      }
    });
}

function getAsignacionFechaAux(fecha1,fecha2,callback){
  db.many('select asig.*, p.piso, p.puesto, p.asignado_id,empA.nombre as asignado_nombre,empA.apellido as asignado_apellido,empA.Usuario as asignado_usuario,p.responsable_id, empR.nombre as responsable_nombre, empR.apellido as responsable_apellido,empR.usuario as responsable_usuario from '
  +dbConfig.schema + '.asignacion as asig inner join '
  +dbConfig.schema+'.puesto as p on asig.puesto_id = p.id inner join '
  +dbConfig.schema+'.empleados as empA on p.asignado_id = empA.id inner join '
  +dbConfig.schema+'.empleados as empR on p.responsable_id = empR.id where asig.fecha between $1 and $2', [fecha1,fecha2])
    .then(function (data){
      callback(data);
    })
    .catch(function (err){
      callback(err);
    });
}

function getAsignacionFecha(req,res,next){
  var fecha1 = req.params.fecha1;
  var fecha2 = req.params.fecha2;
  getAsignacionFechaAux(fecha1, fecha2, function(data){
    res.send(data);
  });
}

function getAsignacionFechaResponsable(req,res,next){
  var fecha1 = req.params.fecha1;
  var fecha2 = req.params.fecha2;
  var nombre = '%'+req.params.gerente+'%';
  db.many('select asig.*, p.piso, p.puesto, p.asignado_id,empA.nombre as asignado_nombre,empA.apellido as asignado_apellido,empA.Usuario as asignado_usuario,p.responsable_id, empR.nombre as responsable_nombre, empR.apellido as responsable_apellido,empR.usuario as responsable_usuario from '
  +dbConfig.schema + '.asignacion as asig inner join '
  +dbConfig.schema+'.puesto as p on asig.puesto_id = p.id inner join '
  +dbConfig.schema+'.empleados as empA on p.asignado_id = empA.id inner join '
  +dbConfig.schema+'.empleados as empR on p.responsable_id = empR.id where (asig.fecha between $2 and $3) and (upper(empR.nombre) like upper($1) or upper(empR.apellido) like upper($1) or upper(empR.usuario) like upper($1))' , [nombre,fecha1,fecha2])
    .then(function (data) {
      res.status(200).send({
          puesto: data
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message: 'No se han encontrado puestos'});
      }else{
        res.status(500).send({message:'Error en el servidor '+err});
      }
    });
}

function getPuestosFechaPiso(req,res,next){
  var fecha1 = req.params.fecha1;
  var fecha2 = req.params.fecha2;
  var piso = req.params.piso;
  db.many('select asig.*, p.piso, p.puesto, p.asignado_id,empA.nombre as asignado_nombre,empA.apellido as asignado_apellido,empA.Usuario as asignado_usuario,p.responsable_id, empR.nombre as responsable_nombre, empR.apellido as responsable_apellido,empR.usuario as responsable_usuario from '
  +dbConfig.schema + '.asignacion as asig inner join '
  +dbConfig.schema+'.puesto as p on asig.puesto_id = p.id inner join '
  +dbConfig.schema+'.empleados as empA on p.asignado_id = empA.id inner join '
  +dbConfig.schema+'.empleados as empR on p.responsable_id = empR.id where (asig.fecha between $1 and $2) and p.piso = $3', [fecha1,fecha2,piso])
    .then(function (data) {
          res.send(data);
        })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message: 'No se han encontrado puestos'});
      }else{
        res.status(500).send({message:'Error en el servidor '+err});
      }
    });
}

function getAsignacionFechaCC(req,res,next){
  var fecha1 = req.params.fecha1;
  var fecha2 = req.params.fecha2;
  var cc = req.params.cc;

  db.many('select asig.*, p.piso, p.puesto, p.asignado_id,empA.nombre as asignado_nombre,empA.apellido as asignado_apellido,empA.Usuario as asignado_usuario,p.responsable_id, empR.nombre as responsable_nombre, empR.apellido as responsable_apellido,empR.usuario as responsable_usuario from '
  +dbConfig.schema + '.asignacion as asig inner join '
  +dbConfig.schema+'.puesto as p on asig.puesto_id = p.id inner join '
  +dbConfig.schema+'.empleados as empA on p.asignado_id = empA.id inner join '
  +dbConfig.schema+'.empleados as empR on p.responsable_id = empR.id where (fecha between $1 and $2) and centro_costos = $3',[fecha1,fecha2,cc])
  .then(function (data){
    res.status(200)
    .send({
      data: data
    });
  })
  .catch(function (err){
    if(err.received == 0){
      re.status(404).send({message: 'No se ha encontrado el puesto'});
    }else{
      res.status(500).send({message: 'Error en el servidor: '+err});
    }
  });
}

function getAsignacionVacia(req, res, next){
  db.any('select asig.*, p.piso, p.puesto, p.asignado_id,p.responsable_id from '
  +dbConfig.schema + '.asignacion as asig inner join '
  +dbConfig.schema+'.puesto as p on asig.puesto_id = p.id where p.asignado_id is NULL')
  .then(function (data){
    res.status(200)
    .send({
      data: data
    });
  })
  .catch(function (err){
    if(err.received == 0){
      re.status(404).send({message: 'No se ha encontrado el puesto'});
    }else{
      res.status(500).send({message: 'Error en el servidor: '+err});
    }
  });
}
/*___________________POST______________________*/

function createAsignacion(req, res, next) {
      db.none('insert into '+ dbConfig.schema +
      '.asignacion(cuenta, observaciones, centro_costos, porcentaje, puesto_id, fecha)'+'values($1,$2,$3,$4,$5,$6)',
      [req.body.cuenta, req.body.observaciones, req.body.centro_costos, parseInt(req.body.porcentaje),
       parseInt(req.body.puesto_id), req.body.fecha])
        .then(function () {
          res.status(200)
            .send({
              message: 'Asignación creada'
            });
        })
        .catch(function (err){
          if(err.received == 0){
            res.status(404).send({message: 'No se ha creado asignación'});
            console.log(err);
          }else{
            res.status(500).send({message:'Error en el servidor '+err});
          }
        });
}
/*___________________PUT______________________*/

function updateAsignacion(req, res, next) {
  db.none('update '+ dbConfig.schema + '.asignacion set cuenta_area=$1, observaciones=$2, centro_costos=$3, tipo=$4, porcentaje=$5, puesto_id=$6, fecha=$7 where id=$8',
    [req.body.cuenta_area, req.body.observaciones, req.body.cc, req.body.tipo, parseInt(req.body.porcentaje),
      parseInt(req.body.puesto_id), req.body.fecha, parseInt(req.params.id)])
    .then(function () {
      res.status(200)
        .send({
          status: 'success',
          message: 'Updated piso'
        });
    })
    .catch(function (err){
        res.status(500).send({message:'Error en el servidor '+err});
    });
}

/*___________________DELETE______________________*/
function removeAsignacion(req, res, next) {
  var puestoID = parseInt(req.params.id);
  db.result('delete from '+ dbConfig.schema + '.asignacion where id = $1', puestoID)
    .then(function (result) {
      res.status(200)
        .send({
          status: 'success',
          message: `Removed ${result.rowCount} asignacion`
        });
    })
    .catch(function (err){
        res.status(500).send({message:'Error en el servidor'});
    });
}

module.exports = {
  getAllAsignacionVacio,
  getAllAsignacion,
  getAsignacionCC,
  getPuestoAsignacion,
  getAsignacionPiso,
  getSingleAsignacion,
  getAsignacion,
  getAsignacionAsignado,
  getAsignacionFecha,
  getAsignacionFechaResponsable,
  getPuestosFechaPiso,
  getAsignacionFechaCC,
  getAsignacionVacia,
  createAsignacion,
  updateAsignacion,
  removeAsignacion
}
