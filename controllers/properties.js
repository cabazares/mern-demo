var express = require('express');
var router = express.Router();

var base = require('./base');
var models = require('../models');
var Property = models.Property;

router.get('/', base.getFunc(Property));
router.get('/:id', base.getOneFunc(Property));
router.delete('/:id', base.deleteFunc(Property));

router.post('/', function(req, res){
  var bodyInfo = req.body;
  if (!bodyInfo.street || !bodyInfo.city || !bodyInfo.rent) {
    base.sendError(bodyInfo)
  } else {
    var create = base.createFunc(Property);
    create(req, res);
  }
});

router.put('/:id', function(req, res){
  var bodyInfo = req.body;
  if (!bodyInfo.street || !bodyInfo.city || !bodyInfo.rent) {
    base.sendError(bodyInfo)
  } else {
    Property.findByIdAndUpdate(req.params.id, 
      bodyInfo, 
      function(err, response){
        if (err && !response) {
          res.send(err);
        } else {
          if (!response) {
            var create = base.createFunc(Property);
            create(req, res);
          } else {
            Property.findById(req.params.id,
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
