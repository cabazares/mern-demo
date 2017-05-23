var express = require('express');
var router = express.Router();

var base = require('./base');
var models = require('../models');
var Lease = models.Lease;
var Property = models.Property;

router.get('/', base.getFunc(Lease));
router.get('/:id', base.getOneFunc(Lease));
router.delete('/:id', base.deleteFunc(Lease));


var create = function (req, res, leaseId) {
  // find property
  Property.findById(leaseId,
    function(err, property){
      if (err)
        base.sendError(res, err, (!property)? 404 : 400);

      var lease = Lease({
        property: property._id
      });

      Lease.create(lease,
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
  if (!bodyInfo.propertyId) {
    console.log(bodyInfo);
    base.sendError(res, bodyInfo)
  } else {
    create(req, res, bodyInfo.propertyId, bodyInfo.leaseId);
  }
});

router.put('/:id', function(req, res){
  var bodyInfo = req.body;
  if (!bodyInfo.propertyID) {
    base.sendError(res, bodyInfo)
  } else {
    Lease.findByIdAndUpdate(req.params.id, 
      bodyInfo,
      function(err, response){
        if (err && !response) {
          res.send(err);
        } else {
          if (!response) {
            create(req, res, bodyInfo.propertyID);
          } else {
            Lease.findById(req.params.id,
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
