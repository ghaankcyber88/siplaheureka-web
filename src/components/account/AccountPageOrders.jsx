// react
import React, { useCallback, useEffect, useReducer, useState } from "react";

// third-party
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import classNames from "classnames";
import queryString from "query-string";

// application
import Pagination from "../shared/Pagination";
import BlockLoader from "../blocks/BlockLoader";

// data stubs
import theme from "../../data/theme";
import { FETCH_ORDER_LIST, FETCH_ORDER_LIST_SUCCESS, SET_FILTER_VALUE, SET_OPTION_VALUE } from "../../data/constant";
import customerApi from "../../api/customer";
import { connect } from "react-redux";
// import DateRangePicker from "react-bootstrap-daterangepicker";

const initialState = {
    orderList: null,
    orderListIsLoading: true,
    filters: { type: "all", date: `${new Date().toLocaleDateString()}-${new Date().toLocaleDateString()}` },
    options: {},
};

function parseQueryOptions(location) {
    const query = queryString.parse(location);

    const optionValues = {
        page: 1,
        limit: 5,
        status: 0,
    };

    if (typeof query.page === "string") {
        optionValues.page = parseFloat(query.page);
    }

    if (query.status) {
        optionValues.status = query.status;
    }

    return optionValues;
}

function parseQueryFilters(location) {
    const query = queryString.parse(location);
    const filterValues = {};

    Object.keys(query).forEach((param) => {
        const mr = param.match(/^filter_([-_A-Za-z0-9]+)$/);

        if (!mr) {
            return;
        }

        const filterSlug = mr[1];

        filterValues[filterSlug] = query[param];
    });

    return filterValues;
}

function parseQuery(location) {
    return [parseQueryOptions(location), parseQueryFilters(location)];
}

function buildQuery(options, filters) {
    const params = {};

    if (options.page !== 1) {
        params.page = options.page;
    }

    if (options.status !== 0) {
        params.status = options.status;
    }
    if (options.keyword !== "") {
        params.keyword = options.keyword;
    }

    Object.keys(filters)
        .filter((x) => x !== "category" && !!filters[x])
        .forEach((filterSlug) => {
            params[`filter_${filterSlug}`] = filters[filterSlug];
        });

    return queryString.stringify(params, { encode: false });
}

function reducer(state, action) {
    switch (action.type) {
        case FETCH_ORDER_LIST:
            return {
                ...state,
                orderListIsLoading: true,
            };
        case FETCH_ORDER_LIST_SUCCESS:
            return {
                ...state,
                orderListIsLoading: false,
                orderList: action.orderList,
            };

        case SET_FILTER_VALUE:
            return {
                ...state,
                options: { ...state.options, page: 1 },
                filters: { ...state.filters, [action.filter]: action.value },
            };
        case SET_OPTION_VALUE:
            return {
                ...state,
                options: { ...state.options, page: 1, [action.option]: action.value },
            };

        default:
            throw new Error();
    }
}

function init(state) {
    const [options, filters] = parseQuery(window.location.search);

    return { ...state, options, filters };
}

const AccountPageOrders = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    const [searchKeyword, setSearchKeyword] = useState("");
    const { token } = props.customer;
    // const [printDate, setPrintDate] = useState({
    //     startDate: new Date().toLocaleDateString(),
    //     endDate: new Date().toLocaleDateString(),
    // });
    // eslint-disable-next-line no-unused-vars
    let content;

    const handleSearch = useCallback(() => {
        dispatch({ type: "SET_OPTION_VALUE", option: "keyword", value: searchKeyword });
    }, [dispatch, searchKeyword]);

    useEffect(() => {
        const query = buildQuery(state.options, state.filters);

        const location = `${window.location.pathname}${query ? "?" : ""}${query}`;
        window.history.replaceState(null, "", location);
    }, [state.options, state.filters]);

    useEffect(() => {
        dispatch({ type: FETCH_ORDER_LIST });
        customerApi.getOrders(state.options, token).then((res) => {
            const { data } = res;

            dispatch({ type: FETCH_ORDER_LIST_SUCCESS, orderList: data });
        });
    }, [state.options, token]);

    // const handleEvent = (event, picker) => {
    //     setPrintDate({
    //         startDate: new Date(picker.startDate._d).toLocaleDateString(),
    //         endDate: new Date(picker.endDate._d).toLocaleDateString(),
    //     });
    // };

    const doHandleChangeStatus = (id) => {
        dispatch({ type: SET_OPTION_VALUE, option: "status", value: id });
    };

    const handlePageChange = (page) => {
        dispatch({
            type: "SET_OPTION_VALUE",
            option: "page",
            value: page,
        });
    };

    if (state.orderListIsLoading) {
        return <BlockLoader />;
    }

    if (state.orderList.orders.length > 0) {
        content = (
            <>
                <div className="row mt-3">
                    {state.orderList.orders.map((order) => (
                        <div className="col-12 mt-2">
                            <div class="card">
                                <div className="card-header pb-1 mb-0">
                                    <small className="text-muted ">{order.orderDate}</small>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <small className="text-muted">No Invoice</small>
                                            <h6>{order.invoice}</h6>
                                        </div>
                                        <div className="col-md-4">
                                            <small className="text-muted">Pemesan</small>
                                            <h6>{order.customerName}</h6>
                                        </div>
                                        <div className="col-md-4 text-right">
                                            <small className="text-muted">status</small>
                                            <h6 className="text-success">{order.status}</h6>
                                        </div>
                                    </div>
                                    <div className="card-divider mt-3 mb-3"></div>
                                    <div className="row ">
                                        {order.items.map((item) => (
                                            <>
                                                <div className="col-md-2">
                                                    <img
                                                        src={item.image}
                                                        alt=""
                                                        style={{ width: "100%", height: "100px", objectFit: "contain" }}
                                                        srcset=""
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <p
                                                        style={{
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            wordBreak: "break-all",
                                                            whiteSpace: "nowrap",
                                                            marginBottom: "0",
                                                        }}
                                                    >
                                                        {item.name}
                                                    </p>
                                                    <Link
                                                        to={`/store/${order.mall.slug}`}
                                                        className="text-info"
                                                        style={{
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            wordBreak: "break-all",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {order.mall.name}
                                                    </Link>
                                                    {item.badges.map((item) => (
                                                        <div
                                                            // style={{ margin: "0 0 0 74.5px" }}
                                                            key={item}
                                                            className="product-card__badge product-card__badge--hot w-sm-50"
                                                        >
                                                            {item}
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ))}
                                    </div>
                                    <div className="card-divider my-3" />
                                    {order.totalProduct - 1 > 0 && (
                                        <div className="col-md-12">
                                            <Link to={`/account/orders/${order.id}`}>
                                                <p className="text-center">
                                                    Lihat {order.totalProduct - 1} Produk Lainnya
                                                </p>
                                            </Link>
                                        </div>
                                    )}
                                    <div className="row">
                                        <div className="col-12 d-flex justify-content-between align-items-center">
                                            <div>
                                                <small className="text-muted">Total</small>
                                                <h6>{order.totalCurrencyFormat}</h6>
                                            </div>

                                            <Link to={`/account/orders/${order.id}`} className="btn btn-info">
                                                Lihat Detail
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-2">
                    <Pagination
                        current={state.options.page || state.orderList.page}
                        siblings={2}
                        total={state.orderList.pages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </>
        );
    } else {
        content = (
            <div className="block block-empty w-100">
                <div className="container">
                    <div className="block-empty__body">
                        <div className="block-empty__message">Data tidak ditemukan</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{`Riwayat Belanja — ${theme.name}`}</title>
            </Helmet>

            <h5>Riwayat Belanja</h5>

            <div className="container">
                <div className="row justify-content-between align-items-center">
                    <div className="col-md-4">
                        <a
                            href={state.orderList.printOrderReport}
                            target="_blank"
                            className="btn btn-sm btn-info btn-block"
                            rel="noopener noreferrer"
                        >
                            <i class="fa fa-download mr-1" aria-hidden="true"></i>
                            Cetak Riwayat Pesanan
                        </a>
                        {/* <h6>Pilih tanggal untuk mencetak riwayat pesanan</h6>
                        <DateRangePicker
                            initialSettings={{
                                startDate: printDate.startDate,
                                endDate: printDate.enDate,
                            }}
                            onEvent={() => {}}
                            onApply={handleEvent}
                        >
                            <input id="daterangepicker" type="text" class="form-control" placeholder="Pilih tanggal" />
                        </DateRangePicker> */}
                    </div>
                    <div className="col-md-6">
                        <div className="site-header__search">
                            <div className="search search--location--header">
                                <div className="search__body">
                                    <div className="search__form">
                                        <input
                                            className="search__input"
                                            value={searchKeyword}
                                            onChange={(e) => setSearchKeyword(e.target.value)}
                                            placeholder="Cari invoice..."
                                            name="keyword"
                                            aria-label="Site search"
                                            type="text"
                                            autoComplete="off"
                                        />
                                        <button
                                            className="search__button search__button--type--submit text-light"
                                            type="submit"
                                            onClick={handleSearch}
                                        >
                                            Cari
                                            {/* <Search20Svg /> */}
                                        </button>
                                        <div className="search__border" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="nav-negotiation">
                    <div className="nav-content-negotiation">
                        {state.orderList.filters.map((item) => (
                            <div
                                className={classNames("nav-item-negotiation", {
                                    active: item.inActive,
                                    danger: item.type === "danger",
                                })}
                                name={item.id}
                                onClick={(e) => doHandleChangeStatus(item.id)}
                            >
                                {item.title}
                                <span class="badge badge-primary custom ml-2">{item.total}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {content}
            </div>
        </>
    );
};
const mapStateToProps = (state) => ({ customer: state.customer });
export default connect(mapStateToProps, null)(AccountPageOrders);
