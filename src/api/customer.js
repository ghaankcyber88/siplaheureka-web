import qs from "query-string";

const customerApi = {
    login: (req) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}user/login/customer`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req),
        }).then((res) => res.json());
    },
    getOauth: () => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}user/oauth`).then((res) => res.json());
    },
    getCustomer: (token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}user/profile/customer`, {
            headers: { Authorization: token },
        }).then((res) => res.json())
    },
    getNotification: (options = {}, filters = {}, token) => {
        const params = { ...options };

        Object.keys(filters).forEach((slug) => {
            if (slug === 'date') {
                if (filters[slug].startDate && filters[slug].endDate) {
                    params[`filter_${slug}`] = `${filters[slug].startDate.toLocaleDateString().replaceAll('/', '-')}_${filters[slug].endDate.toLocaleDateString().replaceAll('/', '-')}`
                } else {
                    params[`filter_${slug}`] = '';
                }
            } else {
                params[`filter_${slug}`] = filters[slug];
            }
        });

        return fetch(`${process.env.REACT_APP_URL_SIPLAH}user/notification/customer?${qs.stringify(params)}`, {
            headers: { Authorization: token },
        }).then((res) => res.json());
    },
    getLog: (options = {}, filters = {}, token) => {
        const params = { ...options };

        Object.keys(filters).forEach((slug) => {
            if (slug === 'date') {
                if (filters[slug].startDate && filters[slug].endDate) {
                    params[`filter_${slug}`] = `${filters[slug].startDate.toLocaleDateString().replaceAll('/', '-')}_${filters[slug].endDate.toLocaleDateString().replaceAll('/', '-')}`
                } else {
                    params[`filter_${slug}`] = ''
                }
            } else {
                params[`filter_${slug}`] = filters[slug];
            }
        });
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}user/log/customer?${qs.stringify(params)}`, {
            headers: { Authorization: token },
        }).then((res) => res.json());
    },
    getOrders: (options = {}, token) => {
        const params = { ...options };
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}order?${qs.stringify(params)}`, {
            headers: { Authorization: token },
        }).then((res) => res.json());
    },
    getOrder: (id, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}order/${id}`, {
            headers: { Authorization: token },
        }).then((res) => res.json());
    },
    getNegotiationList: (options = {}, token) => {
        const params = { ...options };
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}nego?${qs.stringify(params)}`, {
            headers: { Authorization: token },
        }).then((res) => res.json());
    }, getDashboard: (token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}dashboard`, { headers: { Authorization: token } }).then(res => res.json())
    },
    getNegotiationDetail: (id, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}nego/${id}`, {
            headers: { Authorization: token },
        }).then((res) => res.json());
    },
    getCompareList: (options = {}, token) => {
        const params = { ...options };
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}compare?${qs.stringify(params)}`, {
            headers: { Authorization: token },
        }).then((res) => res.json());
    },
    getCompareDetail: (id, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}compare/${id}?type=group`, {
            headers: { Authorization: token },
        }).then((res) => res.json());
    },
    getCompareReport: (id, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}compare/${id}`, {
            headers: { Authorization: token },
        }).then((res) => res.json());
    },
    getComplaintList: (options = {}, token) => {
        const params = { ...options };
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}complaint?${qs.stringify(params)}`, {
            headers: { Authorization: token },
        }).then((res) => res.json());
    },
    getComplaintDetail: (id, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}complaint/${id}`, {
            headers: { Authorization: token },
        }).then((res) => res.json());
    },
    getCartList: (options = {}, token) => {
        const params = { ...options };
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}cart?${qs.stringify(params)}`, {
            headers: { Authorization: token },
        }).then((res) => res.json());
    },
    getMiniCart: (token) => {
        const params = { page: 1, limit: 3 };
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}cart/mini?${qs.stringify(params)}`, {
            headers: { Authorization: token },
        }).then((res) => res.json());
    },
    addCart: (product, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}cart`, {
            headers: { Authorization: token, "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(product),
        }).then((res) => res.json());
    }, deleteStoreCompare: (id, index, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}compare/mall/${id}?index=${index}`, {
            method: 'delete',
            headers: { Authorization: token, 'Content-Type': 'application/json' }
        }).then(res => res.json())
    }, deleteProductCompare: (id, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}compare/${id}`, {
            method: 'delete',
            headers: { Authorization: token, 'Content-Type': 'application/json' }
        }).then(res => res.json())
    }, changeShippingCompare: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}compare/shipping`, {
            method: 'put',
            headers: { Authorization: token, 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(res => res.json())
    },
    deleteCart: (id, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}cart/${id}`, {
            headers: { Authorization: token, "Content-Type": "application/json" },
            method: "delete",
        }).then((res) => res.json());
    },
    changeQuantity: (product, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}cart/qty?action=change`, {
            method: "put",
            headers: { Authorization: token, "Content-Type": "application/json" },
            body: JSON.stringify(product),
        }).then((res) => res.json());
    },
    addNegotiation: (negotiation, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}nego`, {
            headers: { Authorization: token, "Content-Type": "application/json" },
            method: "post",
            body: JSON.stringify(negotiation),
        }).then((res) => res.json());
    },
    sendNegotiationResponse: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}nego/respond`, {
            headers: { Authorization: token, "Content-Type": "application/json" },
            method: "post",
            body: JSON.stringify(req),
        }).then((res) => res.json());
    },
    cancelOrder: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}order/cancel`, {
            headers: { Authorization: token, "Content-Type": "application/json" },
            method: "put",
            body: JSON.stringify(req),
        }).then((res) => res.json());
    },
    logout: (token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}user/logout/customer`, {
            headers: { Authorization: token, "Content-Type": "application/json" },
            method: "post",
        }).then((res) => res.json());
    },
    getCheckout: (token, id, options) => {
        const params = { ...options };
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}checkout/${id}?${qs.stringify(params)}`, {
            headers: { Authorization: token },
        }).then((res) => res.json());
    },
    createOrder: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}checkout`, {
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
            method: "post",
            body: JSON.stringify(req),
        }).then((res) => res.json());
    },
    acceptOrder: (token, req) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}order/accept`, {
            method: "put",
            headers: { Authorization: token, "Content-Type": "application/json" },
            body: JSON.stringify(req),
        }).then((res) => res.json());
    },
    penaltyOrder: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}order/penalty`, {
            method: "put",
            headers: { Authorization: token, "Content-Type": "application/json" },
            body: JSON.stringify(req),
        }).then((res) => res.json());
    }, uploadMultipleImage: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}order/uploadMultipleImageBast`, {
            method: 'post',
            headers: { Authorization: token },
            body: req
        }).then(res => res.json())
    },
    refuseOrder: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}order/refuse`, {
            method: "put",
            headers: { Authorization: token, "Content-Type": "application/json" },
            body: JSON.stringify(req),
        }).then((res) => res.json());
    },

    complaintOrder: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}order/complaint`, {
            method: "post",
            headers: { Authorization: token, "Content-Type": "application/json" },
            body: JSON.stringify(req),
        }).then((res) => res.json());

    }, complaintCreate: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}complaint/create`, {
            method: "post",
            headers: { Authorization: token, "Content-Type": "application/json" },
            body: JSON.stringify(req),
        }).then((res) => res.json());

    },
    uploadImage: (data, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}master/upload`, {
            method: "post",
            headers: { Authorization: token },
            body: data,
        }).then((res) => res.json());
    },
    uploadImageTax: (data, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}order/uploadTax`, {
            method: "post",
            headers: { Authorization: token },
            body: data,
        }).then((res) => res.json());
    },
    createCompare: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}compare/create`, {
            method: 'post',
            headers: { Authorization: token, 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(res => res.json())
    },
    confirmPayment: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}order/confirmPayment`, {
            method: "put",
            headers: { "Content-Type": "application/json", Authorization: token },
            body: JSON.stringify(req),
        }).then((res) => res.json());
    },
    getCompareListOnGoing: (token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}compare/onGoing`, {
            headers: { Authorization: token },
        }).then((res) => res.json());
    },
    addProductToCompare: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}compare`, {
            method: "post",
            headers: { "Content-Type": "application/json", Authorization: token },
            body: JSON.stringify(req),
        }).then((res) => res.json());
    }, sendMessageComplaint: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}complaint`, {
            method: "post",
            headers: { "Content-Type": "application/json", Authorization: token },
            body: JSON.stringify(req),
        }).then((res) => res.json());

    }, uploadImageBast: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}order/uploadImageBast`, {
            method: 'put',
            headers: { Authorization: token, 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(res => res.json())
    }, sendEbast: (data, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}order/sendEbast`, {
            method: 'post',
            headers: { Authorization: token },
            body: data
        }).then(res => res.json())

    }, processToPayment: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}order/proceedToPayment`, {
            method: 'put',
            headers: { Authorization: token, 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(res => res.json())
    }, getTracking: (orderId, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}order/tracking/${orderId}`, {
            headers: { Authorization: token, 'Content-Type': 'application/json' }
        }).then(res => res.json())

    }, applyChangeQtyOrder: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}order/applyChange`, {
            headers: { Authorization: token, 'Content-Type': 'application/json' },
            method: 'put',
            body: JSON.stringify(req)
        }).then(res => res.json())

    }, applyCancellation: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}order/applyCancel`, {
            headers: { Authorization: token, 'Content-Type': 'application/json' },
            method: 'put',
            body: JSON.stringify(req)
        }).then(res => res.json())

    }, changeCompareWrapping: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}compare/wrapping`, {
            headers: { Authorization: token, 'Content-Type': 'application/json' },
            method: 'put',
            body: JSON.stringify(req)
        }).then(res => res.json())

    },
    rejectNego: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}nego/reject`, {
            headers: { Authorization: token, 'Content-Type': 'application/json' },
            method: 'put',
            body: JSON.stringify(req)
        }).then(res => res.json())

    },
    dealNego: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}nego/deal`, {
            headers: { Authorization: token, 'Content-Type': 'application/json' },
            method: 'put',
            body: JSON.stringify(req)
        }).then(res => res.json())

    }, generateEbast: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}order/generateEbast`, {
            headers: { Authorization: token, 'Content-Type': 'application/json' },
            method: 'put',
            body: JSON.stringify(req)
        }).then(res => res.json())

    }, complaintResolve: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}complaint/resolve`, {
            headers: { Authorization: token, 'Content-Type': 'application/json' },
            method: 'put',
            body: JSON.stringify(req)
        }).then(res => res.json())

    }, readNotification: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}user/readNotif/customer`, {
            headers: { Authorization: token, 'Content-Type': 'application/json' },
            method: 'post',
            body: JSON.stringify(req)
        }).then(res => res.json())
        
    },readAllNotification:(token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}user/readAllNotif/customer?isNotifReminder=0`, {
            headers: { Authorization: token, 'Content-Type': 'application/json' },
            method: 'post',
        }).then(res => res.json())

    }
};

export default customerApi;
