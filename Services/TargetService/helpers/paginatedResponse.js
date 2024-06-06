module.exports = function (data, totalItems = 0, request) {
  let page = +request.query.page || 0;
  let perPage = +request.query.perPage || 10;

  if (page < 0) page = 0;
  if (perPage <= 0) perPage = 1;

  const lastPage = Math.max(Math.ceil(totalItems / perPage) - 1, 0) || 0;

  return {
      total: totalItems,
      perPage,
      page,
      lastPage,
      data,
  };
};
