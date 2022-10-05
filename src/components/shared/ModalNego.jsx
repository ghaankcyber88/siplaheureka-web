import React, { useEffect, useState } from "react";

// third-party
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import configApi from "../../api/config";
import customerApi from "../../api/customer";
import { toast } from "react-toastify";
import AsyncAction from "./AsyncAction";
import classNames from "classnames";
import RequestPostLoader from "./RequestPostLoader";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

const ModalNego = (props) => {
    const { open, toggle, product, zone, token, forAct, doHandleFetchCompareList, agree } = props;
    const [state, setState] = useState({ qty: product.qty ?? 0 });
    const [priceNego, setPriceNego] = useState({ floatValue: 0 });
    const [config, setConfig] = useState([]),
        [sendRequest, setSendRequest] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newVal = value;
        if (name === "qty") {
            newVal = newVal.replaceAll(/[//A-Za-z.,-]/g, "");
            newVal = newVal.replaceAll(/^0+/g, "");
        }
        setState({ ...state, [name]: newVal });
    };

    useEffect(() => {
        configApi.getConfigNego(product.mall.slug, token).then((res) => {
            setConfig(res.data);
        });
    }, [product.mall.slug, token]);

    const doHandleSend = () => {
        let productId = product.id;
        let req = { ...state, productId, priceNego: priceNego.floatValue, mallId: product.mall.id };
        if (forAct === "compare") {
            req.productId = product.productId;
            req.isCompare = agree;
            req.qty = product.qty;
        }
        setSendRequest(true);
        if (isValid(req)) {
            return new Promise((resolve) => {
                customerApi.addNegotiation(req, token).then((res) => {
                    const { data } = res;
                    if (forAct === "compare") {
                        customerApi.deleteProductCompare(product.productId, token).then((res) => {
                            doHandleFetchCompareList();
                        });
                    }
                    if (Number(res.status.code) === 200) {
                        toast.success(`Negosiasi telah dikirim`);
                        props.history.push(`/account/negotiation/${data}`);
                        setSendRequest(false);
                        toggle();
                        resolve();
                    } else {
                        toast.error(res.status.message);
                        setSendRequest(false);
                        toggle();
                        resolve();
                    }
                });
            });
        } else {
            return new Promise((resolve) =>
                setTimeout(() => {
                    setSendRequest(false);
                    toast.error(`Negosiasi gagal dikirim, Silahkan isi semua data`);
                    resolve();
                }, 500)
            );
        }
    };

    const isValid = (req) => {
        const reqValid = Object.keys({
            productId: 913133,
            mallId: 1579,
            qty: 2,
            priceNego: 50000,
            courier: "jne",
            wrapping: "Kardus dan Plastik",
        });

        if (reqValid.every((arr) => Object.keys(req).includes(arr))) {
            return (
                req.qty !== 0 &&
                req.priceNego !== 0 &&
                req.courier !== "" &&
                req.wrapping !== "" &&
                req.insurance !== ""
            );
        }
        return false;
    };

    if (sendRequest) {
        return <RequestPostLoader />;
    }

    return (
        <>
            <Modal isOpen={open} toggle={() => toggle(false)} centered size="xl">
                <ModalHeader toggle={() => toggle(false)}>Negosiasi</ModalHeader>
                <ModalBody>
                    <div className="row justify-content-center align-items-center mb-3">
                        <div className="col-md-2">
                            <img
                                src={product.images === undefined ? product.image : product.images[0]}
                                alt=""
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                        <div className="col-md-6">
                            <h5
                                style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    wordBreak: "break-all",
                                    whiteSpace: "nowrap",
                                    marginBottom: "0",
                                }}
                            >
                                {product.name}
                            </h5>
                            {product.price.zone !== undefined ? (
                                <h6 className="text-muted">
                                    {product.price.zone.length > 0 && zone !== ""
                                        ? product.price.zone[zone - 1].priceCurrencyFormat
                                        : product.price.primaryCurrencyFormat}
                                    / {product.specification.unitType || "Pcs"}
                                </h6>
                            ) : (
                                <h6 className="text-muted">{product.priceCurrencyFormat}</h6>
                            )}
                        </div>
                    </div>
                    <form>
                        <div class="row">
                            <div className="col-md-6">
                                <label>Masukan Harga Nego</label>
                                <div class="input-group">
                                    <NumberFormat
                                        name="negoPrice"
                                        value={priceNego.floatValue}
                                        onValueChange={(value) =>
                                            value.floatValue > 0 ? setPriceNego(value) : setPriceNego(priceNego)
                                        }
                                        prefix={"Rp"}
                                        thousandSeparator
                                        className="form-control"
                                    />
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="inputGroupPrepend3">
                                            1 Pcs
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div class="form-group">
                                    <label for="">Masukkan Jumlah Barang:</label>
                                    <input
                                        type="text"
                                        name="qty"
                                        value={state.qty}
                                        class="form-control"
                                        placeholder=""
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            {config.map((item) => (
                                <div className="col-md-6">
                                    <div class="form-group">
                                        <label for="">{item.name}</label>
                                        <select
                                            required
                                            class="form-control"
                                            onChange={handleChange}
                                            name={item.value}
                                            id=""
                                        >
                                            <option value="" selected>
                                                Pilih {item.name}
                                            </option>
                                            {item.items.map((item) => (
                                                <option value={item.value}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))}
                            <div className="col-12">
                                <div class="form-group">
                                    <label for="">Masukan Spesifikasi Lainnya</label>
                                    <textarea
                                        className="form-control"
                                        name="otherSpec"
                                        onChange={handleChange}
                                        id=""
                                        rows="3"
                                        placeholder="Masukan spesifikasi tambahan"
                                    ></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="">Total Harga Nego:</label>
                                    <NumberFormat
                                        disabled
                                        thousandSeparator
                                        prefix={"Rp"}
                                        value={priceNego.floatValue * state.qty}
                                        class="form-control"
                                    />
                                </div>
                                <div class="form-group">
                                    <AsyncAction
                                        action={doHandleSend}
                                        render={({ run, loading }) => (
                                            <button
                                                type="button"
                                                onClick={run}
                                                className={classNames("btn btn-primary btn-block btn-lg", {
                                                    "btn-loading": loading,
                                                })}
                                            >
                                                Kirim Negosiasi
                                            </button>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </>
    );
};

ModalNego.propTypes = {
    /** product object */
    open: PropTypes.bool.isRequired,
    /** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
    toggle: PropTypes.func.isRequired,
    product: PropTypes.object.isRequired,
    token: PropTypes.string,
};

ModalNego.defaultProps = {
    open: false,
};

const mapStateToProps = (state) => ({ customer: state.customer });

export default withRouter(connect(mapStateToProps, null)(ModalNego));
