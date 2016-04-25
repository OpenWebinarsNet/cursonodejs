// Admin routes

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

router.get('/', ensureAuthenticated, function(req, res) {
	Order
	.find()
	.populate('customer')
	.exec(function(err, orders) {
		res.render('admin', {orders: orders });
	})
  
})


router.get('/order/:id/:state', function(req, res) {
	Order.update({_id: req.params.id}, {"$set": {state: req.params.state}})
	.exec(function(err, result) {
		// TODO: Comprobar si el estado es READY y enviar un email si corresponde
		if (err) throw err;
		console.log("Pedido actualizado:", result);
		res.redirect('/admin');
	})
})

module.exports = router;

