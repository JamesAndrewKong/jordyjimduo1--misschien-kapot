module.exports = function (page = 0, perPage = 10) {
  return this.find().skip(page * perPage).limit(perPage);
};
