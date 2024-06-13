const responseValues = {
    total: expect.any(Number),
    perPage: expect.any(Number),
    page: expect.any(Number),
    lastPage: expect.any(Number),
    firstPageUrl: expect.any(String),
    lastPageUrl: expect.any(String),
    nextPageUrl: expect.anyOrNull(String),
    prevPageUrl: expect.anyOrNull(String),
};

module.exports = {responseValues};
