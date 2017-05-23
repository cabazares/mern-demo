var express = require('express');
var router = express.Router();

var base = require('./base');
var models = require('../models');
var Tenant = models.Tenant;
var Lease = models.Lease;

router.get('/', base.getFunc(Tenant));
router.get('/:id', base.getOneFunc(Tenant));
router.delete('/:id', base.deleteFunc(Tenant));

var create = function (req, res, bodyInfo) {
    var leaseId = bodyInfo.leaseId;
    delete bodyInfo.leaseId;

    // find lease
    Lease.findById(leaseId,
     function(err, lease){
        if (err)
          base.sendError(res, err, (!lease)? 404 : 400);

        var tenant = Tenant(bodyInfo);
        tenant.lease = lease._id

        Tenant.create(tenant,
          function(err, obj) {
            if (err)
              base.sendError(res, err);
            res.status(201)
            res.json(obj);
          }
        );
      }
    );
};

router.post('/', function(req, res){
  var bodyInfo = req.body;
  if (!bodyInfo.name || !bodyInfo.leaseId) {
    base.sendError(res, bodyInfo)
  } else {
    create(req, res, bodyInfo);
  }
});

router.put('/:id', function(req, res){
  var bodyInfo = req.body;
  if (!bodyInfo.name || !bodyInfo.leaseId) {
    base.sendError(res, bodyInfo)
  } else {
    Tenant.findByIdAndUpdate(req.params.id, 
      bodyInfo, 
      function(err, response){
        if (err && !response) {
          res.send(err);
        } else {
          if (!response) {
            create(req, res, bodyInfo);
          } else {
            Tenant.findById(req.params.id,
              function(err, response){
                res.json(response);
              }
            );
          }
        }
      }
    );
  }
});

module.exports = router;
