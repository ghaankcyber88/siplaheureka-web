// react
import React from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

// application
import AsyncAction from "../shared/AsyncAction";
import { ArrowRoundedRight6x9Svg, Cart16Svg } from "../../svg";
import { cartAddItem } from "../../store/cart";
import { url } from "../../services/utils";
import BlockLoader from "../blocks/BlockLoader";

const Suggestions = React.memo((props) => {
    const { context, className, products, cartAddItem, isLoading, customer, query } = props;
    const rootClasses = classNames(`suggestions suggestions--location--${context}`, className);

    const handleAddCart = (product) => {
        if (customer.token !== undefined && customer.token !== "") {
            return cartAddItem(product, customer.token);
        } else {
            return new Promise((resolve) => {
                // window.open("https://sso.datadik.kemdikbud.go.id/app/3D1C4271-7C02-487E-B330-7294B7EB4564", "_self");
                props.history.push("/login");
                resolve();
            });
        }
    };

    const list =
        products &&
        products.map((product) => (
            <li key={product.id} className="suggestions__item">
                {product.images && product.images.length > 0 && (
                    <div className="suggestions__item-image product-image">
                        <div className="product-image__body">
                            <img className="product-image__img" src={product.images[0]} alt="" />
                        </div>
                    </div>
                )}
                <div className="suggestions__item-info">
                    <Link className="suggestions__item-name" to={url.product(product)}>
                        {product.name}
                    </Link>
                    <div className="suggestions__item-meta">SKU: {product.sku || "-"}</div>
                </div>
                <div className="suggestions__item-price">{product.price.primaryCurrencyFormat}</div>
                {context === "header" && (
                    <div className="suggestions__item-actions">
                        <AsyncAction
                            action={() => handleAddCart(product)}
                            render={({ run, loading }) => (
                                <button
                                    type="button"
                                    onClick={run}
                                    title="Add to cart"
                                    className={classNames("btn btn-primary btn-sm btn-svg-icon", {
                                        "btn-loading": loading,
                                    })}
                                >
                                    <Cart16Svg />
                                </button>
                            )}
                        />
                    </div>
                )}
            </li>
        ));

    return (
        <div className={rootClasses}>
            {isLoading ? (
                <BlockLoader />
            ) : (
                <ul className="suggestions__list">
                    {list.length > 0 ? (
                        <>
                            {list}
                            <li className="suggestions__item d-flex justify-content-center">
                                <Link to={`/products/search?keyword=${query}`} className="suggestions__item-name">
                                    Lihat Produk Lainnya
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li className=" d-flex justify-content-center py-3">Produk tidak ditemukan</li>
                    )}
                    <li className="suggestions__item">
                        <Link
                            to={`/store?keyword=${query}`}
                            className="suggestions__item-name d-flex justify-content-between align-items-center w-100"
                        >
                            <div>Lihat Pencarian Toko "{query}"</div>
                            <ArrowRoundedRight6x9Svg />
                        </Link>
                    </li>
                </ul>
            )}
        </div>
    );
});

const mapStateToProps = (state) => ({ customer: state.customer });

const mapDispatchToProps = {
    cartAddItem,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Suggestions));
