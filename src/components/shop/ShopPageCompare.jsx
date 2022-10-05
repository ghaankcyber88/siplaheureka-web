// react
import React, { useEffect, useRef, useState } from "react";

// third-party
import { connect } from "react-redux";
import classNames from "classnames";
import { Helmet } from "react-helmet-async";
import queryString from "query-string";

// application
import { cartAddItem } from "../../store/cart";
import { compareRemoveItem } from "../../store/compare";

// data stubs
import theme from "../../data/theme";
import StroykaSlick from "../shared/StroykaSlick";
import IconTrash from "../icons/IconTrash";
import ModalProducts from "../shared/ModalProducts";
import customerApi from "../../api/customer";
import BlockLoader from "../blocks/BlockLoader";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";

const slickSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 400,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1199,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 575,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
};

function ShopPageCompare(props) {
    const { customer } = props;
    const location = useLocation();
    const history = useHistory();
    const [fetchTotal, setFetchTotal] = useState(false);
    const [ongkir, setOngkir] = useState([{ shippingCost: 0 }]);
    const [compareNumber, setCompareNumber] = useState(0);

    let slickRef = useRef();
    const [state, setState] = useState({ isLoading: true, compareList: null });
    const [showProducts, setShowProducts] = useState(false),
        [productCompare, setProductCompare] = useState(null);
    useEffect(() => {
        doHandleFetchCompareList();
        return () => {};
        // eslint-disable-next-line
    }, []);

    const doHandleFetchCompareList = () => {
        setState({ ...state, isLoading: true });
        setTimeout(() => {
            customerApi
                .getCompareListOnGoing(customer.token)
                .then((res) => {
                    const { status } = res;
                    if (status.code === 200) {
                        if (res.data.isMoveToCart) {
                            Swal.fire({
                                icon: "info",
                                html: "Barang tidak memerlukan perbandingan<br> silahkan pergi ke keranjang untuk melanjutkan pesanan",
                                allowOutsideClick: false,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    props.history.push("/shop/cart");
                                }
                            });
                        } else {
                            setState({ ...state, isLoading: false, compareList: res.data });
                            setCompareNumber(
                                Number(res.data.compare[res.data.compare.length - 1]["compareNumber"]) + 1
                            );

                            setOngkir(
                                res.data.compare.map(({ shippingCost, compareNumber }) => ({
                                    compareNumber,
                                    shippingCost,
                                }))
                            );
                        }
                    } else {
                        setState({ ...state, isLoading: false, compareList: null });
                    }
                })
                .catch((err) =>
                    Swal.fire({
                        title: "Gagal Memuat...",
                        imageUrl: `${process.env.PUBLIC_URL}/images/error.jpg`,
                        imageWidth: 250,
                        imageHeight: 250,
                        allowOutsideClick: false,
                        confirmButtonText: "Refresh Halaman",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload(true);
                        }
                    })
                );
        }, 300);
    };

    const handleNextClick = () => {
        if (slickRef.current) {
            slickRef.current.slickNext();
        }
    };

    const handlePrevClick = () => {
        if (slickRef.current) {
            slickRef.current.slickPrev();
        }
    };

    const setSlickRef = (ref) => {
        slickRef.current = ref;
    };

    const doHandleShowProducts = (data, compareNumber = 0) => {
        resetUrl();
        if (data !== null) {
            const params = {
                from: "compare",
                fromProductId: data.productId,
            };
            const query = queryString.stringify(params, { encode: false });
            const location = `${window.location.pathname}${query ? "?" : ""}${query}`;
            window.history.replaceState(null, "", location);
        }
        setCompareNumber(compareNumber);
        setProductCompare(data);
        setShowProducts(!showProducts);
    };

    const resetUrl = (data) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.forEach((value, key) => {
            queryParams.delete(key);
        });
        history.replace({
            search: queryParams.toString(),
        });
    };

    const doHandleChooseProduct = (product, dispatch) => {
        const { id, mall } = product;
        const { qty, id: compareParentId, storeSlug } = productCompare;
        const req = { productId: id, qty, compareParentId, compareIndex: compareNumber };

        if (Number(product.stock) < Number(qty)) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    toast.error(`Stok produk ${product.name} tidak mencukupi`, { toastId: product.id });
                    resolve();
                }, 300);
            });
        }
        if (storeSlug !== undefined) {
            if (mall.slug !== storeSlug) {
                req.compareIndex = compareNumber + 1;
            }
        }
        return new Promise((resolve) => {
            if (id === productCompare.productId) {
                resolve();
                return toast.error("Tidak bisa membandingkan dengan barang yang sama disatu toko");
            }
            dispatch({ type: "FETCH_PRODUCTS_LIST" });
            customerApi
                .addProductToCompare(req, customer.token)
                .then((res) => {
                    const { status } = res;
                    if (status.code === 200) {
                        toast.success(`barang ${product.name} berhasil ditambahkan ke perbandingan`);
                        doHandleFetchCompareList();
                    } else {
                        toast.error(status.message);
                    }
                    resetUrl();
                    setShowProducts(false);
                    resolve();
                })
                .catch((err) => {
                    alert(err);
                });
        });
    };

    const doHandleDeleteStoreCompare = ({ storeId, compareNumber }) => {
        customerApi.deleteStoreCompare(storeId, compareNumber, customer.token).then((res) => {
            const { status } = res;
            if (status.code === 200) {
                toast.success(status.message);
                doHandleFetchCompareList();
            } else {
                toast.error(status.message);
            }
        });
    };

    const doHandleChangeShipping = ({ storeId, compareNumber, shippingCode }) => {
        const req = { compareIndex: compareNumber, storeId, shippingCode: shippingCode.split("-")[0] };

        setFetchTotal(true);
        const findShipping = ongkir.find((o) => o.compareNumber === compareNumber);
        if (findShipping !== undefined) {
            findShipping.shippingCost = shippingCode.split("-")[1];
        }
        customerApi.changeShippingCompare(req, customer.token).then((res) => {
            setFetchTotal(false);
            // setOngkir(Number(shippingCode.split("-")[1]));
            setOngkir([...ongkir, findShipping]);
            // doHandleFetchCompareList();
        });
    };

    const doHandleChangeWrapping = (e, storeId) => {
        const { value } = e.target;

        customerApi.changeCompareWrapping({ compareIndex: storeId, wrapping: value }, customer.token).then((res) => {
            doHandleFetchCompareList();
        });
    };

    const doHandleDeleteProductCompare = ({ productId }) => {
        customerApi.deleteProductCompare(productId, customer.token).then((res) => {
            doHandleFetchCompareList();
        });
    };

    const doHandleCheckout = (item) => {
        props.history.push(`/shop/checkout/${item.id}?from=compare`);
    };

    if (state.isLoading) {
        return <BlockLoader />;
    }

    if (state.compareList == null) {
        return (
            <div className="block block-empty ">
                <div className="container">
                    <div className="block-empty__body">
                        <div className="block-empty__message">Tidak ada data perbandingan</div>
                    </div>
                </div>
            </div>
        );
    }

    const viewTotal = (compareNumber, subTotal, ppn) => {
        if (fetchTotal) {
            return "Loading...";
        } else {
            if (ongkir.find((o) => o.compareNumber === compareNumber)) {
                return Math.ceil(
                    Number(ongkir.find((o) => o.compareNumber === compareNumber)["shippingCost"]) +
                        Number(ppn) +
                        Number(subTotal)
                );
            }
            return Math.ceil(Number(subTotal));
        }
    };

    function rupiah(number) {
        if (typeof number === "number") {
            let reverse = number.toString().split("").reverse().join("");
            let ribuan = reverse.match(/\d{1,3}/g);
            ribuan = ribuan.join(".").split("").reverse().join("");
            return "Rp" + ribuan;
        }
        return number;
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Perbandingan Produk — ${theme.name}`}</title>
            </Helmet>
            <div className="block block-brands">
                <div className="card p-3">
                    {state.compareList.alert && (
                        <div className="alert alert-warning" role="alert">
                            <strong>{state.compareList.alert}</strong>
                        </div>
                    )}
                    <div
                        style={{
                            position: "absolute",
                            left: "10px",
                            top: "50%",
                            fontSize: "40px",
                            zIndex: 1,
                            cursor: "pointer",
                        }}
                        onClick={handlePrevClick}
                    >
                        <i class="fas fa-arrow-circle-left"></i>
                    </div>
                    <StroykaSlick ref={setSlickRef} {...slickSettings}>
                        {state.compareList.compare.map((item, indexCompare) => (
                            <div className="p-3">
                                <div class="card w-100">
                                    <div class="card-header">
                                        <div className="d-flex justify-content-between">
                                            <div
                                                style={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    wordBreak: "break-all",
                                                    whiteSpace: "nowrap",
                                                    maxWidth: "80%",
                                                }}
                                            >
                                                <h6 className="text-primary">
                                                    <Link to={`/store/${item.storeSlug}`}>{item.storeName}</Link>
                                                </h6>
                                                <small>{item.storeAddress}</small>
                                            </div>
                                            {item.isHasDelete && (
                                                <div class="group">
                                                    <input className="custom-input" type="checkbox" id="xd" checked />
                                                    <label
                                                        className="custom-label-cancel"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => doHandleDeleteStoreCompare(item)}
                                                        for="xd"
                                                    ></label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="card-divider" />
                                    <div style={{ minHeight: "10vh" }}>
                                        {item.products.map((product, index) => {
                                            let content = (
                                                <>
                                                    {index !== 0 && <div className="card-divider my-2" />}
                                                    <div className="card-body">
                                                        <div className="row justify-content-center align-items-center  py-1">
                                                            <div className="col-md-4 col-sm-6">
                                                                <button
                                                                    className="btn btn-secondary btn-block"
                                                                    // disabled={item}
                                                                    onClick={() =>
                                                                        doHandleShowProducts(
                                                                            {
                                                                                storeSlug: item.storeSlug,
                                                                                storeName: item.storeName,
                                                                                ...state.compareList.compare[0]
                                                                                    .products[index],
                                                                            },
                                                                            item.compareNumber
                                                                        )
                                                                    }
                                                                >
                                                                    Cari Barang
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                            if (product != null) {
                                                content = (
                                                    <>
                                                        {index !== 0 && <div className="card-divider my-2" />}
                                                        <div className="container">
                                                            <div className="row p-1">
                                                                <div className="col-3">
                                                                    <img
                                                                        src={product.image}
                                                                        alt=""
                                                                        className="img-contain"
                                                                    />
                                                                </div>
                                                                <div className="col-7">
                                                                    <p
                                                                        style={{
                                                                            overflow: "hidden",
                                                                            textOverflow: "ellipsis",
                                                                            wordBreak: "break-all",
                                                                            whiteSpace: "nowrap",
                                                                            marginBottom: "0",
                                                                        }}
                                                                    >
                                                                        {product.name}
                                                                    </p>
                                                                    <small
                                                                        style={{
                                                                            overflow: "hidden",
                                                                            textOverflow: "ellipsis",
                                                                            wordBreak: "break-all",
                                                                            whiteSpace: "nowrap",
                                                                            marginBottom: "0",
                                                                            display: "block",
                                                                            fontSize: "12px",
                                                                        }}
                                                                    >
                                                                        {product.category.name}
                                                                    </small>
                                                                    <p>
                                                                        {product.isCrossPrice && (
                                                                            <small
                                                                                style={{
                                                                                    textDecoration: "line-through",
                                                                                }}
                                                                                className="text-secondary mr-2"
                                                                            >
                                                                                {product.crossPrice}
                                                                            </small>
                                                                        )}
                                                                        <strong> {product.priceCurrencyFormat}</strong>
                                                                        &nbsp;x{product.qty}
                                                                    </p>
                                                                    {product.badges.map((item) => (
                                                                        <div>
                                                                            {(item.toLowerCase() === "grosir" ||
                                                                                item.toLowerCase() === "nego") && (
                                                                                <div
                                                                                    key={item}
                                                                                    className={classNames(
                                                                                        "w-sm-50 d-block",
                                                                                        {
                                                                                            "product-card__badge product-card__badge--sale":
                                                                                                item.toLowerCase() ===
                                                                                                "grosir",
                                                                                            "product-card__badge product-card__badge--hot":
                                                                                                item.toLowerCase() ===
                                                                                                "nego",
                                                                                            "product-card__badge product-card__badge--new":
                                                                                                item.toLowerCase() ===
                                                                                                "het",
                                                                                        }
                                                                                    )}
                                                                                >
                                                                                    {item}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div className="col-2">
                                                                    {item.isHasDelete && indexCompare !== 0 && (
                                                                        <div
                                                                            style={{ cursor: "pointer" }}
                                                                            onClick={() =>
                                                                                doHandleDeleteProductCompare(product)
                                                                            }
                                                                        >
                                                                            <IconTrash
                                                                                style={{
                                                                                    width: "50%",
                                                                                    margin: "auto",
                                                                                }}
                                                                            />
                                                                            <small className="text-danger text-center d-block">
                                                                                hapus
                                                                            </small>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                );
                                            }

                                            return content;
                                        })}
                                    </div>

                                    <div className="card-divider" />
                                    <div className="card-footer">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <h6>Sub Total</h6>
                                            <h6>{item.subTotalCurrencyFormat}</h6>
                                        </div>
                                        <div className="d-md-flex flex-md-row flex-sm-column justify-content-md-between align-items-md-center">
                                            <h6>Biaya Kirim({item.weightText})</h6>
                                            <div class="form-group" style={{ marginBottom: "0" }}>
                                                <select
                                                    class="form-control"
                                                    onChange={(e) =>
                                                        doHandleChangeShipping({
                                                            ...item,
                                                            shippingCode: e.target.value,
                                                        })
                                                    }
                                                >
                                                    {item.shipping.map((ship) => (
                                                        <option
                                                            selected={ship.isSelected}
                                                            value={`${ship.value}-${ship.cost}`}
                                                        >{`${ship.name} - ${ship.costCurrencyFormat}`}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="d-md-flex flex-md-row flex-sm-column justify-content-md-between align-items-md-center my-1">
                                            <h6>Pembungkus</h6>
                                            <div class="form-group" style={{ marginBottom: "0" }}>
                                                <select
                                                    class="form-control"
                                                    onChange={(e) => doHandleChangeWrapping(e, item.compareNumber)}
                                                >
                                                    {item.wrapping.map((wr) => (
                                                        <option selected={wr.isSelected} value={wr.value}>
                                                            {wr.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center my-2">
                                            <h6>Ppn</h6>
                                            <h6>{item.ppnCurrencyFormat}</h6>
                                        </div>
                                        <div className="card-divider my-2"></div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h6>Total</h6>
                                            {/* <h6> {item.totalCurrencyFormat}</h6> */}
                                            <h6>{rupiah(viewTotal(item.compareNumber, item.subTotal, item.ppn))}</h6>
                                        </div>
                                        {!customer.position.toLowerCase().includes("bendahara") && (
                                            <button
                                                // to={`/shop/checkout/${item.id}?from=compare`}
                                                onClick={() => doHandleCheckout(item)}
                                                className={classNames("btn btn-primary btn-block mt-2")}
                                                disabled={!item.isCheckout}
                                            >
                                                Checkout
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="p-3">
                            <div class="card w-100">
                                <div class="card-header p-5"></div>
                                <div className="card-divider"></div>
                                {state.compareList.compare[0].products.map((product, index) => (
                                    <>
                                        <div className="card-body">
                                            <div className="row justify-content-center align-items-center py-1">
                                                <div className="col-md-4 col-sm-6">
                                                    <button
                                                        className="btn btn-secondary btn-block"
                                                        onClick={() =>
                                                            doHandleShowProducts(
                                                                state.compareList.compare[0].products[index],
                                                                Number(
                                                                    state.compareList.compare[
                                                                        state.compareList.compare.length - 1
                                                                    ]["compareNumber"]
                                                                ) + 1
                                                            )
                                                        }
                                                    >
                                                        Cari Barang
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {state.compareList.compare[0].products.length - 1 > index && (
                                            <div className="card-divider" />
                                        )}
                                    </>
                                ))}

                                <div className="card-divider" />
                                <div className="card-footer"></div>
                            </div>
                        </div>
                    </StroykaSlick>
                    <div
                        onClick={handleNextClick}
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            fontSize: "40px",
                            zIndex: 1,
                            cursor: "pointer",
                        }}
                    >
                        <i class="fas fa-arrow-circle-right"></i>
                    </div>
                </div>
            </div>
            {productCompare !== null && (
                <ModalProducts
                    doHandleFetchCompareList={doHandleFetchCompareList}
                    forAct="compare"
                    doHandleChooseProduct={doHandleChooseProduct}
                    isOpen={showProducts}
                    productCompare={productCompare}
                    toggle={doHandleShowProducts}
                />
            )}
        </React.Fragment>
    );
}

const mapStateToProps = (state) => ({
    products: state.compare,
    customer: state.customer,
});

const mapDispatchToProps = {
    cartAddItem,
    compareRemoveItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCompare);
