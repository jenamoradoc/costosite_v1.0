var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'El Servidor Web  está ejecutándose...' });
});


var empleados = require('../controllers/empleados');
router.get('/costo/empleados', empleados.getAllUsers);//Devuelve todos los empleados de la tabla empleados
router.get('/costo/empleados/:usuario', empleados.getSingleUserName);
router.get('/costo/empleados/id/:id', empleados.getSingleUser);//Devuelve el empleado con el id dado
router.post('/costo/createnew', empleados.createUser);//Crea un empleado
router.put('/costo/update/:id', empleados.updateUser);//Actualiza el empleado correspondiente al id dado 
router.put('/costo/empleados/rol/:id', empleados.updateRol);//Actualiza solo el rol del usuario
router.delete('/costo/empleados/:id', empleados.removeUser);//Elimina el empleado correspondiente al id dado
//router.delete('/costo/empleados/:ini/:fin', empleados.removeAll);//Elimina todos los empleado
//router.post('/costo/empleados/load',empleados.loadDB);//Carga la tabla de empleados con los usuarios de ldap
router.get('/costo/empleados/rol/:id',empleados.getRol);// <-----------------------------No anda

var asignacion = require('../controllers/Asignacion');

router.get('/costo/asignacion', asignacion.getAllAsignacionVacio);
router.get('/costo/asignacion/asignados', asignacion.getAllAsignacion);//Devuelve todos los puestos de la tabla puestos
router.get('/costo/asignacion/cc/:cc', asignacion.getAsignacionCC);//Devuelve todo los puestos con el centro de costos dado
router.get('/costo/asignacion/puesto/:puesto', asignacion.getPuestoAsignacion);//Busca puesto por asignacion
router.get('/costo/asignacion/piso/:piso', asignacion.getAsignacionPiso);//Devuelve todo los puestos del piso dado
router.get('/costo/asignacion/id/:id', asignacion.getSingleAsignacion);//Devuelve el puesto correspondiente al id dado
router.get('/costo/asignacion/:fecha1/:fecha2', asignacion.getAsignacionFecha);//Devuelve los puestos vigentes entre las fechas indicadas <----- no se utilizar el metodo
router.get('/costo/asignacion/nombre/:nombre', asignacion.getAsignacionAsignado);//<----- no se utilizar el metodo
router.get('/costo/asignacion/:fecha1/:fecha2/:gerente', asignacion.getAsignacionFechaResponsable);//<----- no se utilizar el metodo
router.get('/costo/asignacion/piso/:fecha1/:fecha2/:piso', asignacion.getPuestosFechaPiso);//<----- no se utilizar el metodo
router.get('/costo/asignacion/cc/:fecha1/:fecha2/:cc', asignacion.getAsignacionFechaCC);//<----- no se utilizar el metodo
router.get('/costo/asignacion/vacio/', asignacion.getAsignacionVacia);
/**************************/
router.post('/costo/asignacion/create', asignacion.createAsignacion);//Crea un puesto nuevo <----Validar como se hace la solicitud al momento de mandar los datos
router.put('/costo/asignacion/:id', asignacion.updateAsignacion);//Actualiza el puesto indicado
router.delete('/costo/asignacion/:id', asignacion.removeAsignacion);//Elimina el puesto indicado
/***************************/

var rol = require('../controllers/rol');
//router.post('/costo/rol', rol.createRoll);
router.get('/costo/rol', rol.getAllRoll);

var puesto = require('../controllers/puesto');

router.get('/costo/puesto', puesto.getAll);
router.post('/costo/puesto', puesto.setPuesto);
router.put('/costo/puesto/:id', puesto.updatePuesto);
router.delete('/costo/puesto/:id', puesto.remove);

var log = require('../controllers/user');

router.post('/costo/loguear', log.loginUser);

module.exports = router;
