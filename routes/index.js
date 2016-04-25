var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var _ = require('lodash');
var Order = require('../models/order.model.js');

function ensureAuthenticated(req, res, next) {
  console.log("isAuth:", req.isAuthenticated());
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/user/login');
}

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('index', { user: req.user });
});

router.get('/order', ensureAuthenticated, function(req, res) {
	res.render('order', {user: req.user});
});

// router.get('/admin', ensureAuthenticated, function(req, res) {
// 	return res.render('admin');
// });




// // Recibimos los datos del formulario y creamos el pedido en la base de datos.
// router.post("/order/submit", ensureAuthenticated, function(req, res) {
//   var form = req.body
//   // Cogemos el usuario logeado
//   var user = req.user;
//   // Asignamos el usuario logeado para que no nos falsifiquen
//   form.customer = user;

//   console.log("Form:", form);
//   if (form.customer && form.pizza) {
//   	Order.create(form, function(err, created) {
//       // Hack para incorporar todo el user en el campo customer
//       // El campo created solo dispone el ID ya que no hace populate
//       var order = _.extend(created.toJSON(), {customer: user});

//   		if (!err && created) return res.render('ordered', {order: order});
//   		console.error("Error creating order:", err, err.stack);
//   		res.redirect('/');
//   	});
//   }
//   else {
//   	res.json(req.body);
//   }

// });

module.exports = router;
