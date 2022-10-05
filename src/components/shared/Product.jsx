// react
import React, { Component } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

// application
import AsyncAction from "./AsyncAction";
import InputNumber from "./InputNumber";
import ProductGallery from "./ProductGallery";
import Rating from "./Rating";
import { cartAddItem } from "../../store/cart";
import ModalNego from "./ModalNego";

class Product extends Component {
    constructor(props) {
        super(props);

        this.state = {
            quantity: 1,
            openNego: false,
        };
    }

    handleChangeQuantity = (quantity) => {
        this.setState({ quantity });
    };

    handleOpenNego = (openNego) => {
        this.setState({ openNego });
    };

    handleAddCart = (quantity) => {
        const { product, cartAddItem, customer } = this.props;

        if (customer.token !== undefined && customer.token !== "") {
            return cartAddItem(product, customer.token, quantity);
        } else {
            return new Promise((resolve) => {
                this.props.history.push("/login");
                // window.open("https://sso.datadik.kemdikbud.go.id/app/3D1C4271-7C02-487E-B330-7294B7EB4564", "_self");
                resolve();
            });
        }
    };

    render() {
        const { layout, customer, product, auth } = this.props;
        let zone = "";
        if (Object.keys(customer).length > 0) {
            zone = customer?.school?.location?.zone;
        }
        const { quantity } = this.state;
        let prices;
        if (product.price.zone.length > 0) {
            prices = (
                <>
                    <h6 className="mt-3 text-center">
                        {Object.keys(customer).length > 0
                            ? ` Sekolah anda berada di zona ${zone}`
                            : "Silahkan login untuk melihat zona sekolah anda"}
                    </h6>

                    <table className="table table-responsive text-center">
                        <thead>
                            <tr>
                                {product.price.zone.map((item, index) => (
                                    <td className={`${Number(zone) === index + 1 && "text-success font-weight-bold"}`}>
                                        Zona {index + 1}
                                    </td>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {product.price.zone.map((item, index) => (
                                    <td className={`${Number(zone) === index + 1 && "text-success font-weight-bold"}`}>
                                        {item.priceCurrencyFormat}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                    {product.price.grosir.length > 0 && (
                        <div className="row">
                            <div className="col-md-12" style={{ marginBottom: "-17px" }}>
                                <p>Harga Grosir : </p>
                            </div>
                            {product.price.grosir.map((item) => (
                                <div className="col-md-4 col-sm-6 my-2">
                                    <div style={{ backgroundColor: "whitesmoke", padding: "10px" }}>
                                        <p style={{ marginBottom: "-2px" }}>{item.priceCurrencyFormat}</p>
                                        <small>min. {item.min} Pcs</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            );
        } else if (product.price.grosir.length > 0) {
            prices = (
                <div className="row">
                    <div className="col-md-12">
                        <div className="product__prices">{product.price.primaryCurrencyFormat}</div>
                    </div>
                    <div className="col-md-12" style={{ marginBottom: "-17px" }}>
                        <p>Harga Grosir : </p>
                    </div>
                    {product.price.grosir.map((item) => (
                        <div className="col-md-4 col-sm-6 my-2">
                            <div style={{ backgroundColor: "whitesmoke", padding: "10px" }}>
                                <p style={{ marginBottom: "-2px" }}>{item.priceCurrencyFormat}</p>
                                <small>min. {item.min} Pcs</small>
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else {
            prices = <div className="product__prices text-danger">{product.price.primaryCurrencyFormat}</div>;
        }

        let badges = product?.badges?.map((item) => (
            <div className="mr-1 d-inline-block">
                <div className="py-1 px-2 bg-info text-light rounded">{item}</div>
            </div>
        ));

        return (
            <div className={`product product--layout--${layout}`}>
                <div className="product__content">
                    <ProductGallery layout={layout} images={product.images} />

                    <div className="product__info">
                        <h1 className="product__name">{product.name}</h1>
                        <div className="product__rating">
                            <div className="product__rating-stars">
                                <Rating value={product.rating} />
                            </div>
                            <div className="product__rating-legend">
                                <span>{`${product.review.total} Reviews`}</span>
                            </div>
                        </div>
                        <ul className="product__meta d-block">
                            {!product.category[product.category.length - 1].title.toLowerCase().includes("jasa") && (
                                <li className="product__meta-availability">
                                    <dl className="d-flex mb-0">
                                        <dt style={{ width: '100px' }}>
                                            Stok
                                        </dt>
                                        <dd className="mb-0">
                                            :
                                        </dd>
                                        <dd className="mb-0 ml-1">
                                            <span
                                                className={classNames("font-weight-bold", {
                                                    "text-danger": product.stock === 0,
                                                    "text-success": product.stock > 0,
                                                })}
                                            >
                                                {product.stock}
                                            </span>
                                        </dd>
                                    </dl>
                                </li>
                            )}

                            {product.workDuration !== null && Number(product.workDuration) !== 0 && (
                                <li className="product__meta-availability">
                                    <dl className="d-flex mb-0">
                                        <dt style={{ width: '100px' }}>
                                            Lama Sewa/Pengerjaan
                                        </dt>
                                        <dd className="mb-0">
                                            :
                                        </dd>
                                        <dd className="mb-0 ml-1">
                                            <span className={classNames("font-weight-bold")}>{product.workDuration} Hari</span>
                                        </dd>
                                    </dl>
                                </li>
                            )}
                            <li>
                                <dl className="d-flex mb-0">
                                    <dt style={{ width: '100px' }}>Brand</dt>
                                    <dd className="mb-0">:</dd>
                                    <dd className="mb-0 ml-1">
                                        {product.manufacturer.name || "-"}
                                    </dd>
                                </dl>

                            </li>
                            <li>
                                <dl className="d-flex mb-0">
                                    <dt style={{ width: '100px' }}>
                                        Penjual
                                    </dt>
                                    <dd className="mb-0">
                                        :
                                    </dd>
                                    <dd className="mb-0 ml-1">
                                        <Link className="font-weight-bold" to={`/store/${product.mall.slug}`}>{product.mall.name}</Link>
                                    </dd>
                                </dl>

                            </li>
                            <li>
                                <dl className="d-flex mb-0">
                                    <dt style={{ width: '100px' }}>Jenis Usaha</dt>
                                    <dd className="mb-0">:</dd>
                                    <dd className="mb-0 ml-1">{product.mall.type}</dd>
                                </dl>
                            </li>


                        </ul>
                        <div className="mt-2">{badges}</div>
                    </div>

                    <div className="product__sidebar">
                        {prices}
                        <ul className="product__meta mb-4 d-block" style={{
                            marginTop:'-23px'
                        }}>
                            <li>
                                <dl className="d-flex mb-0">
                                    <dt style={{ width: '100px' }}>Dpp</dt>
                                    <dd className="mb-0">:</dd>
                                    <dd className="mb-0 ml-1">Rp{Number(product?.ppn?.dpp).toLocaleString().replaceAll(',', '.') || 0}</dd>
                                </dl>
                            </li>
                            <li>
                                <dl className="d-flex mb-0">
                                    <dt style={{ width: '100px' }}>Ppn</dt>
                                    <dd className="mb-0">:</dd>
                                    <dd className="mb-0 ml-1">Rp{Number(product?.ppn?.ppnPrice).toLocaleString().replaceAll(',', '.') || 0}</dd>
                                </dl>
                            </li>
                        </ul>
                        <form className="product__options">
                            <div className="form-group product__option">
                                <label htmlFor="product-quantity" className="product__option-label">
                                    Kuantitas
                                </label>
                                <div className="product__actions">
                                    <div className="product__actions-item">
                                        <InputNumber
                                            id="product-quantity"
                                            aria-label="Quantity"
                                            className="product__quantity"
                                            size="lg"
                                            min={1}
                                            max={product.stock}
                                            value={quantity}
                                            onChange={this.handleChangeQuantity}
                                        />
                                    </div>
                                    <div className="product__actions-item product__actions-item--addtocart">
                                        <AsyncAction
                                            action={() => this.handleAddCart(quantity)}
                                            render={({ run, loading }) => (
                                                <button
                                                    type="button"
                                                    style={{ backgroundColor: 'rgb(255, 98, 33)', borderColor: 'rgb(255, 98, 33)' }}
                                                    onClick={run}
                                                    disabled={!quantity || quantity > product.stock || quantity < 0}
                                                    className={classNames("btn btn-primary custome btn-lg", {
                                                        "btn-loading": loading,
                                                    })}
                                                >
                                                    Tambah ke keranjang
                                                </button>
                                            )}
                                        />
                                    </div>
                                    {auth && (
                                        <div className="product__actions-item product__actions-item--compare">
                                            <AsyncAction
                                                render={({ run, loading }) => (
                                                    <button
                                                        type="button"
                                                        data-toggle="tooltip"
                                                        disabled={!quantity || quantity > product.stock}
                                                        title="Nego"
                                                        onClick={() => this.handleOpenNego(true)}
                                                        className={classNames("btn btn-danger custome btn-lg")}
                                                    >
                                                        Nego
                                                    </button>
                                                )}
                                            />

                                            <ModalNego
                                                token={customer.token}
                                                open={this.state.openNego}
                                                product={product}
                                                zone={zone}
                                                toggle={this.handleOpenNego}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

Product.propTypes = {
    /** product object */
    product: PropTypes.object.isRequired,
    /** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
    layout: PropTypes.oneOf(["standard", "sidebar", "columnar", "quickview"]),
};

Product.defaultProps = {
    layout: "standard",
};

const mapStateToProps = (state) => {
    return {
        customer: state.customer,
        auth: state.auth,
    };
};

const mapDispatchToProps = {
    cartAddItem,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Product));
