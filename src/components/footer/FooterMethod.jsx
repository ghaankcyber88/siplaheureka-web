import React from "react";
import PropTypes from "prop-types";

import { LazyLoadImage } from "react-lazy-load-image-component";

const FooterMethod = (props) => {
    return (
        <div className="site-footer__widget footer-newsletter">
            <h5 className="footer-links__title">{props.title}</h5>
            <div className="row">
                {props.images.map((item, index) => (
                    <div key={index} className="col-4 d-flex" style={{
                        marginTop: 'auto', marginBottom: 'auto'
                    }}>
                        <LazyLoadImage
                            src={item}
                            effect="opacity"
                            alt={item}
                            style={{
                                width: "100%",
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

FooterMethod.propTypes = {
    title: PropTypes.string.isRequired,
    images: PropTypes.array.isRequired,
};

export default FooterMethod;
