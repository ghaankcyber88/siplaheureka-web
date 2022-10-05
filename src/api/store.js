import qs from "query-string";
const storeApi = {
    getStores: (options = {}, filters = {}, keyword, token) => {
        const params = { ...options, keyword };

        Object.keys(filters).forEach((slug) => {
            params[`filter_${slug}`] = filters[slug];
        });
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}mall?${qs.stringify(params)}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token || ''
            }
        }).then((res) => res.json());
    },
    getStore: (slug) => {
        const params = { slug };
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}mall?${qs.stringify(params)}`).then((res) => res.json());
    }, addReviewStore: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}mall/review`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json', Authorization: token },
            body: JSON.stringify(req)
        }).then((res) => res.json());
    }
};

export default storeApi;
