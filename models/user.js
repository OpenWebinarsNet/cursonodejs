var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: String,
	email: String,
	password: String,
	role: {
		type: String,
		enum: ['admin','customer'],
		default: "customer"
	}
})

// Metodo estático para buscar por username
userSchema.statics.findByUsername = function(username, cb) {
	this.model('user').findOne({username: username}, cb);
}

module.exports = mongoose.model('user', userSchema);