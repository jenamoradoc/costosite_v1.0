var db = require('../db');
var config = require('config');
var dbConfig = config.get('dbConfig');
var ldap = require('ldapjs');
var ActiveDirectory = require('activedirectory');
/***********************************************
TABLA EMPLEADOS
************************************************
create table costos.empleados
(id serial,
nombre varchar(100),
apellido varchar(100),
usuario,
rol_id
);
*************************************************/

/* GET users listing. */
function getAllUsers(req, res) {
  db.many('select * from  ' + dbConfig.schema + '.empleados')
    .then(function (data) {
      res.status(200).send({
          data: data
        });
    })
    .catch(function (err) {
      if(err.received == 0){
        res.status(404).send({message: 'No se han encontrado usuarios'});
        console.log(err);
      }else{
        res.status(500).send({message:'Error en el servidor'});
      }
    });
}

function getSingleUser(req,res,next){
  var empID = req.params.id;
  db.one('select * from '+ dbConfig.schema + '.empleados where id = $1', empID)
    .then(function (data)
    {
      res.status(200)
        .send({
          data: data
        });
    })
    .catch(function (err)
    {
      if(err.received == 0)
      {
        res.status(404).send({message: 'No se ha encontrado el usuario'});
        console.log(err);
      }else{
        res.status(500).send({message:'Error en el servidor'+err});
      }
    });
}

/*************NUEVAS*************/

function getRol(req, res, next){
    db.one('select * from '+ dbConfig.schema + '.empleados where id=$1',parseInt(req.params.id))
    .then(function(user){
      if (user.rol_id){
        db.one('select * from '+ dbConfig.schema + '.rol where id=$1',user.rol_id)
        .then(function(rol){
          res.status(200).send({
            user:user,
            rol:rol})
        })
        .catch(function(errRol){
          if(err.received == 0)
          {
            res.status(404).send({message: 'No se ha encontrado rol'});
          }else{
            res.status(500).send({message: 'Error en el servidor: ' +errRol})
          }
        })
      }else{
        res.status(200).send({
          user:user,
          rol:null
        })
      }
    })
    .catch(function(err){
      if(err.received == 0)
      {
        res.status(404).send({message: 'No se ha encontrado el usuario'});
        console.log(err);
      }else{
        res.status(500).send({message:'Error en el servidor'+err});
      }
    })
}


function getSingleUserName(req,res,next){
  var usuario = req.params.usuario;
  var cadena = usuario.split(" ");
  var query = "select * from "+ dbConfig.schema + ".empleados where ";
  for (var i = 0; i < cadena.length; i++) {
    query += "concat(nombre,'',apellido) ilike '%"+cadena[i]+"%'"
    if (i< cadena.length -1)
    query += " and ";
  }
  db.any(query)
    .then(function (data)
    {
      res.status(200)
        .send({
          data: data
        });
    })
    .catch(function (err)
    {
      if(err.received == 0)
      {
        res.status(404).send({message: 'No se ha encontrado el usuario'});
        console.log(err);
      }else{
        res.status(500).send({message:'Error en el servidor'+err});
      }
    });

}

/********************************/

//cambiar rol
function updateRol(req,res, next){
  db.none('update '+ dbConfig.schema + '.empleados set rol_id=$1 where id=$2',
    [ parseInt(req.body.rol_id), parseInt(req.params.id)])
    .then(function () {
      res.status(200)
        .send({
          message: 'Rol actualizado'
        });
    })
    .catch(function (err)
    {
        res.status(500).send({message:'Error en el servidor '+err});
    });
}


function createUser(req, res, next) {
  var user={
    nombre:req.body.nombre,
    apellido:req.body.apellido,
    usuario:req.body.usuario,
    rol_id:req.body.rol_id
  };
  insertar(user,function(data){
    res.send({data: data});
  });

}

function insertar(user,callback){
    db.none('insert into '+ dbConfig.schema + '.empleados(nombre, apellido, usuario, rol_id) ' +
        'values($1, $2, $3, $4)',
      [user.nombre, user.apellido, user.usuario, user.rol_id])
      .then(function () {
        var data='Inserción exitosa';
        callback(data);
          })
      .catch(function (err)
      {
        if(err.received == 0)
        {
          var data= 'No se ha creado el usuario: '+err;
          callback(data);
        }else{
          var data='Error en el servidor: '+err;
          callback(data);
        }
      })
}

function actualizar(user,id,callback){
  db.none('update '+ dbConfig.schema + '.empleados set nombre=$1, apellido=$2, usuario=$3, rol_id=$4 where id=$5',
    [user.nombre, user.apellido, user.usuario, user.rol_id,
     id])
    .then(function () {
      var data = 'actualizacion exitosa';
      callback(data);
    })
    .catch(function (err)
    {
      if(err.received == 0)
      {
        var data= 'No se ha actualizado el usuario';
        callback(data);
      }else{
        var data= 'Error en el servidor';
        callback(data);
      }
    });
}

function updateUser(req, res, next) {
  actualizar(req.body,parseInt(req.params.id),function(data){
      res.send({data: data});
  })
}

function removeUser(req, res, next) {
  var empID = parseInt(req.params.id);
  db.result('delete from '+ dbConfig.schema + '.empleados where id = $1', empID)
    .then(function (result) {
      res.status(200)
        .send({
          status: 'success',
          message: `Removed ${result.rowCount} user`
        });
    })
    .catch(function (err)
    {
      if(err.received == 0)
      {
        res.status(404).send({message: 'No se ha borrado el usuario'});
        console.log(err);
      }else{
        res.status(500).send({message:'Error en el servidor'+err});
      }
    });
}

function removeAll(req, res, next) {
  var ini=parseInt(req.params.ini);
  var fin=parseInt(req.params.fin);
  var text;
    if (ini > fin){
      ini=fin;
      fin=parseInt(req.params.ini);
    }
    for (var paso = ini; paso >= fin; paso++) {

      db.result('delete from '+ dbConfig.schema + '.empleados where id = $1', paso)
        .then(function (result) {
          console.log({
              status: 'success',
              message: `Removed ${result.rowCount} user`
            });
        })
        .catch(function (err){
          if(err.received == 0)
          {
            console.log({
              message: 'No se ha borrado el usuario',
              err:err
            });
          }else{
            console.log('Error en el servidor');
          }
        });
    };
    res.send({text});
}
function existe(user,callback){
  db.one('select * from '+ dbConfig.schema + '.empleados where nombre = $1 and apellido = $2', [user.nombre,user.apellido])
    .then(function (data)
    {
      callback(parseInt(data.id),parseInt(data.rol_id));
    })
    .catch(function (err)
    {
      callback(null);
    });
}
//cargar base de datos

function loadDB(req,res){
  var ActiveDirectory = require('activedirectory');
  var config = { url: 'ldap://assa02.grupoassa',
                 baseDN: 'ou=AR,dc=grupoassa',
                 username: 'srvagentesdc@grupoassa',
                 password: 'vY5wU6IWahgzBX3xNMw8'}

  var _ = require('underscore');
  // var query = 'cn=*,*';
  var opts = {
    filter: '(cn=*,*)',
    // paged: true,
    sizeLimit: 10000
  };
  var i=0;
  var users;
  var ad = new ActiveDirectory(config);
  ad.find(opts, function(err, results) {
    if ((err) || (! results)) {
      console.log('ERROR: ' + JSON.stringify(err));
      return;
    }
    users = results.users;
    results.users.forEach(function(user) {
          i=i+1;
          var user2 ={
              nombre:user.givenName,
              apellido:user.sn,
              usuario:user.sAMAccountName,
              rol_id:null
          };
          existe(user2,function(id,rol_id){
            if(id){
              user2.rol_id=rol_id;
              actualizar(user2,id,function(resp){});
            }else{
              insertar(user2,function(data2){});
            }
          });

      });

    res.send({//message: 'Success, Inserted '+i+' users',
              data: users});
  });
}

module.exports = {
  getAllUsers,
  getRol,
  getSingleUserName,
  getSingleUser,
  createUser,
  updateUser,
  updateRol,
  removeUser,
  //loadDB,
  //removeAll
}
