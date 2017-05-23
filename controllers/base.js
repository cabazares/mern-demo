
var sendError = function(res, err, code) {
  code = (code == undefined)? 400 : code;
  res.status(code);
  res.json(err);
};
exports.sendError = sendError;

exports.getFunc = function(model) {
  return function(req, res) {
    model.find(function(err, response){
      res.json(response);
    });
  }
};

exports.getOneFunc = function(model) {
  return function(req, res){
    model.findById(req.params.id,
      function(err, response){
        if (err)
          sendError(res, err, (!response)? 404 : 400);
        res.json(response);
      }
    );
  }
};

exports.createFunc = function(model) {
  return function (req, res) {
    model.create(req.body, function(err, obj) {
      if (err)
        sendError(res, err);
      res.status(201)
      res.json(obj);
    });
  };
};

exports.deleteFunc = function(model) {
  return function(req, res){
    model.findByIdAndRemove(req.params.id, function(err, response){
      if (err) {
        sendError(res, err);
      } else {
        res.status(204)
        res.end()
      }
    });
  }
};
