// Order routes

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

// Route: /order
router.get('/', ensureAuthenticated, function(req, res) {
	res.render('order', {user: req.user});
});

// Route /order/:order
// Mostrar pedidos registrados
router.get('/:order', ensureAuthenticated, function(req, res) {
	Order.findOne({_id: req.params.order})
	.populate('customer')
	.exec(function(err, order) {
		if (err) throw err;
		res.render('ordered', {order: order})
	})
});

// Recibimos los datos del formulario y creamos el pedido en la base de datos.
router.post("/submit", ensureAuthenticated, function(req, res) {
  var form = req.body
  // Cogemos el usuario logeado
  var user = req.user;
  // Asignamos el usuario logeado para que no nos falsifiquen
  form.customer = user;

  console.log("Form!:", form);
  if (form.customer && form.pizza) {
  	Order.create(form, function(err, created) {
      // Hack para incorporar todo el user en el campo customer
      // El campo created solo dispone el ID ya que no hace populate
      var order = _.extend(created.toJSON(), {customer: user});
      if (!err && created) return res.redirect('/order/'+order._id);
  		//if (!err && created) return res.render('ordered', {order: order});
  		console.error("Error creating order:", err, err.stack);
  		res.redirect('/');
  	});
  }
  else {
  	res.json(req.body);
  }

});

module.exports = router;

