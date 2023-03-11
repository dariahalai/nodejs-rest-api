const {
  dataAddContactValidator,
  dataUpdateContactValidator,
} = require("../utils/contactValidator");

exports.toAddContactMiddlware = (req, res, next) => {
  const { error, value } = dataAddContactValidator(req.body);
  if (error) return res.status(400).json({ message: error.message });
  req.value = value;
  next();
};

exports.toUpdateContactMiddlware = (req, res, next) => {
  const { error, value } = dataUpdateContactValidator(req.body);
  if (error) return res.status(400).json({ message: "missing fields" });
  req.value = value;
  next();
};
