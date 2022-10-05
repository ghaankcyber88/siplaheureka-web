// react
import React from "react";

// third-party
import { Link } from "react-router-dom";

function Topbar() {
    return (
        <div className="site-header__topbar topbar">
            <div className="topbar__container container">
                <div className="topbar__row">
                    <div className="topbar__spring" />
                    <div className="topbar__item topbar__item--link">
                        <Link to="/site/technical-support" className="topbar-button btn btn-secondary">
                           <i class="fas fa-question-circle    "></i> Bantuan
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Topbar;
