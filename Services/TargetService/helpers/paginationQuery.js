module.exports = function(page, perPage) {
    page = parseInt(page) || 1;
    perPage = parseInt(perPage) || 10;
  
    return this.find()
      .skip((page - 1) * perPage)
      .limit(perPage);
  };