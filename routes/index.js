var express = require('express');
var router = express.Router();
var middleware = require('../middleware/authentication'); // middleware por donde pasa la autenticacion antes de hacer un servicio

/******************************************************
 * GET home page. 
 *******************************************************/

router.get('/', function(req, res, next) {
  res.render('index', { title: 'El Servidor Web  está ejecutándose...' });
});

//======================= Login ================================

var log = require('../controllers/user');

router.post('/costo/loguear', log.loginUser);

/*****************************************************
 * A partir de aqui se implementa un middleware 
 * el cual solicita un token de autenticacion
*****************************************************/

//======================= CRUD Empleados ==========================

var empleados = require('../controllers/empleados');

router.get('/costo/getallempleados',middleware.ensureAuthenticated, empleados.getAllUsers);//Devuelve todos los empleados de la tabla empleados
router.get('/costo/getusername/:usuario',middleware.ensureAuthenticated, empleados.getSingleUserName);
router.get('/costo/getuserid/:id', middleware.ensureAuthenticated, empleados.getSingleUser);//Devuelve el empleado con el id dado
router.post('/costo/createnewuser', middleware.ensureAuthenticated, empleados.createUser);//Crea un empleado
router.put('/costo/updateuser/:id', middleware.ensureAuthenticated, empleados.updateUser);//Actualiza el empleado correspondiente al id dado 
router.put('/costo/updaterol/:id', middleware.ensureAuthenticated, empleados.updateRol);//Actualiza solo el rol del usuario
router.delete('/costo/removeuser/:id',middleware.ensureAuthenticated, empleados.removeUser);//Elimina el empleado correspondiente al id dado
router.get('/costo/rolempleado/:id',middleware.ensureAuthenticated, empleados.getRol);// <-----------------------------No anda

//router.delete('/costo/empleados/:ini/:fin', empleados.removeAll);//Elimina todos los empleado
//router.post('/costo/empleados/load',empleados.loadDB);//Carga la tabla de empleados con los usuarios de ldap

//======================= CRUD Asignacion ==========================

var asignacion = require('../controllers/Asignacion');

router.get('/costo/asignacion',  middleware.ensureAuthenticated, asignacion.getAllAsignacionVacio);
router.get('/costo/asignacion/asignados', middleware.ensureAuthenticated, asignacion.getAllAsignacion);//Devuelve todos los puestos de la tabla puestos
router.get('/costo/asignacion/cc/:cc', middleware.ensureAuthenticated, asignacion.getAsignacionCC);//Devuelve todo los puestos con el centro de costos dado
router.get('/costo/asignacion/puesto/:puesto', middleware.ensureAuthenticated, asignacion.getPuestoAsignacion);//Busca puesto por asignacion
router.get('/costo/asignacion/piso/:piso', middleware.ensureAuthenticated, asignacion.getAsignacionPiso);//Devuelve todo los puestos del piso dado
router.get('/costo/asignacion/id/:id', middleware.ensureAuthenticated, asignacion.getSingleAsignacion);//Devuelve el puesto correspondiente al id dado
router.get('/costo/asignacion/:fecha1/:fecha2', middleware.ensureAuthenticated, asignacion.getAsignacionFecha);//Devuelve los puestos vigentes entre las fechas indicadas <----- no se utilizar el metodo
router.get('/costo/asignacion/nombre/:nombre', middleware.ensureAuthenticated, asignacion.getAsignacionAsignado);//<----- no se utilizar el metodo
router.get('/costo/asignacion/:fecha1/:fecha2/:gerente', middleware.ensureAuthenticated, asignacion.getAsignacionFechaResponsable);//<----- no se utilizar el metodo
router.get('/costo/asignacion/piso/:fecha1/:fecha2/:piso', middleware.ensureAuthenticated, asignacion.getPuestosFechaPiso);//<----- no se utilizar el metodo
router.get('/costo/asignacion/cc/:fecha1/:fecha2/:cc', middleware.ensureAuthenticated, asignacion.getAsignacionFechaCC);//<----- no se utilizar el metodo
router.get('/costo/asignacion/vacio/', middleware.ensureAuthenticated, asignacion.getAsignacionVacia);

//=================================================

router.post('/costo/asignacion/create', middleware.ensureAuthenticated, asignacion.createAsignacion);//Crea un puesto nuevo <----Validar como se hace la solicitud al momento de mandar los datos
router.put('/costo/asignacion/:id', middleware.ensureAuthenticated, asignacion.updateAsignacion);//Actualiza el puesto indicado
router.delete('/costo/asignacion/:id', middleware.ensureAuthenticated, asignacion.removeAsignacion);//Elimina el puesto indicado

//======================= ROL =================================

var rol = require('../controllers/rol');
//router.post('/costo/rol', rol.createRoll);
router.get('/costo/rol', middleware.ensureAuthenticated, rol.getAllRoll);

//======================= Puesto ================================

var puesto = require('../controllers/puesto');

router.get('/costo/puesto', middleware.ensureAuthenticated, puesto.getAll);
router.post('/costo/puesto', middleware.ensureAuthenticated, puesto.setPuesto);
router.put('/costo/puesto/:id', middleware.ensureAuthenticated, puesto.updatePuesto);
router.delete('/costo/puesto/:id', middleware.ensureAuthenticated, puesto.remove);

//======================= Router ================================

module.exports = router;

/**************************************************************
 * Comentarios aqui ------>
 **************************************************************/

