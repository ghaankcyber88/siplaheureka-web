// react
import React, { useEffect, Suspense, lazy, useState } from "react";

// third-party
import PropTypes from "prop-types";
import { Route, Redirect, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { IntlProvider } from "react-intl";
import { ScrollContext } from "react-router-scroll-4";
import { QueryParamProvider } from "use-query-params";

import customerApi from "../api/customer";
import config from "../api/config";
import Swal from "sweetalert2";

import { localeChange } from "../store/locale";
import { loginCustomer } from "../store/auth";
import { customerAdd } from "../store/customer";
import { configChange } from "../store/config";
import { addMiniCart, resetMiniCart } from "../store/mini-cart";
import { newMessageAdd } from "../store/new-message";
import { openNotif } from "../store/notif";
import { resetFirstLogin } from "../store/first-login/firstLoginActions";
import fire from "./../services/fire";
import { toast } from "react-toastify";
import MainLoader from "./shared/MainLoader";
import PaymentSimulation from "./site/PaymentSimulation";
import { handleChangeFirstLogin } from '../store/first-login/firstLoginActions';
import ReactGA from 'react-ga';
// import ErrorBoundary from "./Error";

const Layout = lazy(() => import("./Layout"));
const HomePageOne = lazy(() => import("./home/HomePageOne"));

const Root = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const TRACKING_ID = "UA-141902938-1"; // YOUR_OWN_TRACKING_ID
        ReactGA.initialize(TRACKING_ID);
    }, [])

    useEffect(() => {
        config
            .getConfig()
            .then((res) => {
                const { data } = res;
                props.configChange(data);
            })
            .catch((err) => {
                Swal.fire({
                    title: "Gagal Memuat...",
                    imageUrl: `${process.env.PUBLIC_URL}/images/error.jpg`,
                    imageWidth: 250,
                    imageHeight: 250,
                    allowOutsideClick: false,
                    confirmButtonText: "Refresh Halaman",
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config]);

    // useEffect(() => {
    //     if (props.firstLogin) {
    //         Swal.fire({
    //             icon: "info",
    //             html: `<p>Anda memiliki <strong>${1} notifikasi</strong> yang perlu dibaca</p>`,
    //             confirmButtonText: "Buka Notifikasi",
    //             confirmButtonColor: "#0e336d",
    //             allowOutsideClick: false,
    //             showCancelButton: true,
    //             // cancelButtonText: "Ingatkan Saya Nanti",
    //             // cancelButtonColor: "#E0A800",
    //         }).then((res) => {
    //             if (res.isConfirmed) {
    //                 ReactGA.event({
    //                     category: 'School Notification',
    //                     action: 'Show Notification',
    //                 });
    //                 props.handleChangeFirstLogin()
    //                 props.openNotif()
    //                 window.location.reload()
    //                 // history.push("/account/notification?isNotifReminder=1");
    //             }
    //         });
    //     }
    // }, [])



    useEffect(() => {
        customerApi.getOauth().then((res) => {
            const token = res.data;
            if (res.status.code === 200) {
                setIsLoading(true);
                customerApi.getMiniCart(token).then((res) => {
                    const { data } = res;
                    props.addMiniCart(data);
                });

                customerApi.getCustomer(res.data).then((res) => {
                    const { data } = res;
                    var myHeaders = new Headers();

                    if (data.totalNotifReminder > 0 && props.firstLogin) {
                        Swal.fire({
                            icon: "info",
                            html: `<p>Anda memiliki <strong>${data.totalNotifReminder} notifikasi</strong> yang perlu dibaca</p>`,
                            confirmButtonText: "Buka Notifikasi",
                            confirmButtonColor: "#0e336d",
                            allowOutsideClick: false,
                            showCancelButton: false,
                            // cancelButtonText: "Ingatkan Saya Nanti",
                            // cancelButtonColor: "#E0A800",
                        }).then((res) => {
                            if (res.isConfirmed) {
                                props.handleChangeFirstLogin()
                                props.openNotif()
                                window.location.reload()
                            }
                        });
                    } else if (data.totalNotifReminder < 1) {
                        props.handleChangeFirstLogin()
                    }

                    var formdata = new FormData();
                    formdata.append("customerId", data.id);

                    var requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        body: formdata,
                        redirect: "follow",
                    };

                    fetch(`${process.env.REACT_APP_URL_SIPLAH}/backendseller/Mychat/welcome`, requestOptions).then(
                        (response) => { }
                    );
                    setIsLoading(false);
                    props.loginCustomer(true);
                    props.customerAdd({ ...data, token });
                });
            } else if (res.status.code === 403) {
                props.customerAdd({});
                props.resetMiniCart();
                props.loginCustomer(false);

                toast.error(res.status.message);
            } else {
                props.customerAdd({});
                props.resetMiniCart();
                props.loginCustomer(false);
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.customer) {
            fire.database()
                .ref(`/unread-message/customer/${props.customer.id}`)
                .on("value", (snapshot) => {
                    if (props.customer.id !== undefined) {
                        fetch(`${process.env.REACT_APP_API_CHAT}get-unread-message?from=seller&id=${props.customer.id}`)
                            .then((res) => res.json())
                            .then((res) => {
                                props.newMessageAdd(res.total_unread);
                            });
                    }
                });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect(() => {
    //     // preloader
    //     setTimeout(() => {
    //         const preloader = document.querySelector(".site-preloader");
    //         preloader.addEventListener("transitionend", (event) => {
    //             if (event.propertyName === "opacity") {
    //                 preloader.parentNode.removeChild(preloader);
    //             }
    //         });
    //         preloader.classList.add("site-preloader__fade");
    //     }, 300);
    //     return () => {};
    // }, []);

    const shouldUpdateScroll = (prevRouterProps, { location }) =>
        prevRouterProps && location.pathname !== prevRouterProps.location.pathname;
    if (isLoading) {
        return (
            <div class="full-page-loader">
                <img width="200" src="./images/logo.png" alt="Siplah Eureka Logo" />
            </div>
        );
    }

    return (
        // <ErrorBoundary>
        <IntlProvider locale={"en"} messages={{}}>
            <Suspense fallback={<MainLoader />}>
                <QueryParamProvider ReactRouterRoute={Route}>
                    <HelmetProvider>
                        <Helmet htmlAttributes={{ lang: "en", dir: "ltr" }} />
                        <ScrollContext shouldUpdateScroll={shouldUpdateScroll}>
                            <Switch>
                                <Route path="/payment-simulation" component={PaymentSimulation} />
                                <Route
                                    path="/"
                                    render={(props) => (
                                        <Layout {...props} headerLayout="default" homeComponent={HomePageOne} />
                                    )}
                                />
                                <Redirect to="/" />
                            </Switch>
                        </ScrollContext>
                    </HelmetProvider>
                </QueryParamProvider>
            </Suspense>
        </IntlProvider>
        // </ErrorBoundary>
    );
};

Root.propTypes = {
    /** current locale */
    locale: PropTypes.string,
};

const mapStateToProps = (state) => ({
    locale: state.locale,
    customer: state.customer,
    firstLogin: state.firstLogin
});

const mapDispatchToProps = {
    localeChange,
    loginCustomer,
    customerAdd,
    newMessageAdd,
    configChange,
    addMiniCart,
    resetMiniCart,
    handleChangeFirstLogin,
    openNotif,
    resetFirstLogin
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Root));
