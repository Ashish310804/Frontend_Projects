let data = {
  pressure: 50,
  usage: []
};

exports.getData = (req, res) => {
  res.json(data);
};

exports.updateData = (req, res) => {
  data.pressure = req.body.pressure;
  data.usage.push({ value: req.body.pressure, time: new Date() });
  res.send("Updated");
};