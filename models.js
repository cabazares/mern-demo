var db = require('./db')

var Schema = db.mongoose.Schema;

exports.Property = db.mongoose.model("Property", Schema({
  street: String,
  city: String,
  state: String,
  zip: String,
  rent: Number
}));

exports.Tenant = db.mongoose.model("Tenant", Schema({
  lease: { type: Schema.Types.ObjectId, ref: 'Lease' },
  name: String,
  email: String,
  phone: String
}));

exports.Lease = db.mongoose.model("Lease", Schema({
  lease: { type: Schema.Types.ObjectId, ref: 'Lease' },
  property: { type: Schema.Types.ObjectId, ref: 'Property' },
}));

