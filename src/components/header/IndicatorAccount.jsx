/* eslint-disable no-unused-expressions */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
// react
import React from "react";

// third-party
import { Link, withRouter } from "react-router-dom";

// application
import Indicator from "./Indicator";
import { Person20Svg } from "../../svg";
import { connect } from "react-redux";
import customerApi from "../../api/customer";

import { customerAdd } from "../../store/customer";
import { loginCustomer } from "../../store/auth";
import { resetMiniCart } from "../../store/mini-cart";
import { resetFirstLogin } from "../../store/first-login/firstLoginActions";
import { toast } from "react-toastify";

function IndicatorAccount(props) {
    const { customer } = props;
    const dropdown = (
        <div className="account-menu">
            <div className="account-menu__divider" />
            <Link to="/account/dashboard" className="account-menu__user">
                <div className="account-menu__user-avatar">
                    <img src="https://siplah.eurekabookhouse.co.id/assets/image/logo-kemdikbud.png" alt="" />
                </div>
                <div className="account-menu__user-info">
                    <div className="account-menu__user-name">{customer.name}</div>
                    <div className="account-menu__user-email" style={{ fontSize: "12px" }}>
                        {customer.email}
                    </div>
                </div>
            </Link>
            <div className="account-menu__divider" />
            <ul className="account-menu__links">
                <li>
                    <Link to="/account/detail">Data Sekolah</Link>
                </li>
                <li>
                    <Link to="/account/orders">Riwayat Belanja</Link>
                </li>
                <li>
                    <Link to="/account/notification">Notifikasi</Link>
                </li>
            </ul>
            <div className="account-menu__divider" />
            <ul className="account-menu__links">
                <li>
                    <a
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            customerApi.logout(customer.token).then((res) => {
                                props.history.push("/login");
                                props.loginCustomer(false);
                                props.customerAdd({});
                                props.resetFirstLogin();
                                props.resetMiniCart();
                                toast.success("Berhasil logout");
                            });
                        }}
                    >
                        Logout
                    </a>
                </li>
            </ul>
        </div>
    );

    return <Indicator url="/account" dropdown={dropdown} icon={<Person20Svg />} />;
}

const mapStateToProps = (state) => {
    return { customer: state.customer };
};
const mapDispatchToProps = {
    customerAdd,
    loginCustomer,
    resetMiniCart,resetFirstLogin
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IndicatorAccount));
