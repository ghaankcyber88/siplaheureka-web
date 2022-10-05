// react
import React from "react";

// third-party
import Skeleton from "react-loading-skeleton";

// application
import FooterContacts from "./FooterContacts";
import FooterLinks from "./FooterLinks";
import ToTop from "./ToTop";

// data stubs
import FooterMethod from "./FooterMethod";
import { connect } from "react-redux";

function Footer(props) {
    const { images } = props.config;
    const informationLinks = [
        { title: "Tentang SIPLah", url: "/site/about" },
        { title: "Kebijakan Privasi", url: "/site/privacy-policy" },
        { title: "Kebijakan Produk", url: "/site/kebijakan-produk-siplah-eurekabookhouse-kemendikbud" },
        { title: "Syarat dan Ketentuan", url: "/site/terms-and-conditions" },
        { title: "FAQ", url: "/site/faq" },
        { title: "Cara Pembayaran", url: "/site/how-to-pay" },
        { title: "Tutorial", url: "/site/tutorial" },
    ];

    return (
        <div className="site-footer">
            <div className="container">
                <div className="site-footer__widgets">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                            <FooterContacts />
                        </div>
                        <div className="col-6 col-md-3 col-lg-2">
                            <FooterLinks title="Informasi" items={informationLinks} />
                        </div>
                        <div className="col-6 col-md-3 col-lg-3">
                            {!images ? <Skeleton /> : <FooterMethod images={images.payment} title="Pembayaran" />}
                        </div>
                        <div className="col-6 col-md-3 col-lg-3">
                            {!images ? <Skeleton /> : <FooterMethod images={images.shipping} title="Kerja sama" />}
                        </div>
                    </div>
                </div>

            </div>
                <div className="site-footer__bottom d-flex justify-content-center" style={{ background: 'rgb(112,113,118)' }}>
                    <div className="site-footer__copyright text-white text-center">
                        Copyright &copy; 2021 Kementerian Pendidikan dan Kebudayaan. Hak cipta dilindungi undang-undang
                        <br />
                        Dikembangkan oleh Eurekabookhouse.co.id.
                    </div>
                </div>
            <ToTop />
        </div>
    );
}
const mapStateToProps = (state) => ({ config: state.config });
export default connect(mapStateToProps, () => ({}))(Footer);
