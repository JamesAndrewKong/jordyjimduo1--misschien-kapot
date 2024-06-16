module.exports = function (response, request) {
    const page = response.page;
    const perPage = response.perPage;
    const lastPage = response.lastPage;

    const baseUrl = new URL(`${request.protocol}://${request.get('host')}${request.originalUrl}`);

    const firstPageUrl = () => {
        const url = new URL(baseUrl);
        url.searchParams.set('page', '0');
        url.searchParams.set('perPage', perPage.toString());
        return url;
    };
    const lastPageUrl = () => {
        const url = new URL(baseUrl);
        url.searchParams.set('page', lastPage.toString());
        url.searchParams.set('perPage', perPage.toString());
        return url;
    };
    const nextPageUrl = () => {
        if (page >= lastPage) {
            return null;
        }

        const url = new URL(baseUrl);
        url.searchParams.set('page', (page + 1).toString());
        url.searchParams.set('perPage', perPage.toString());
        return url;
    };
    const prevPageUrl = () => {
        if (page <= 0) {
            return null;
        }

        const url = new URL(baseUrl);
        url.searchParams.set('page', (page - 1).toString());
        url.searchParams.set('perPage', perPage.toString());
        return url;
    };

    response.firstPageUrl = firstPageUrl();
    response.lastPageUrl = lastPageUrl();
    response.nextPageUrl = nextPageUrl();
    response.prevPageUrl = prevPageUrl();

    return response;
};
