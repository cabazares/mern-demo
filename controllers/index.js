var express = require('express')
  , router = express.Router()

router.use('/properties', require('./properties'))
router.use('/tenants', require('./tenants'))
router.use('/leases', require('./leases'))

module.exports = router
