// react
import React, { useCallback, useEffect, useRef, useState } from "react";

// third-party
import classNames from "classnames";
import { withRouter } from "react-router-dom";

// application
import shopApi from "../../api/shop";
import Suggestions from "./Suggestions";
import { Cross20Svg, Search20Svg } from "../../svg";
import { connect } from "react-redux";

const Search = React.memo((props) => {
    const { context, className, inputRef, onClose, location, customer } = props;
    const [cancelFn, setCancelFn] = useState(() => () => { });
    const [suggestionsOpen, setSuggestionsOpen] = useState(false);
    const [hasSuggestions, setHasSuggestions] = useState(false);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
    const [query, setQuery] = useState("");

    const wrapper = useRef(null);
    const close = useCallback(() => {
        if (onClose) {
            onClose();
        }

        setSuggestionsOpen(false);
    }, [onClose]);

    // Close suggestions when the location has been changed.
    useEffect(() => close(), [close, location]);

    // Close suggestions when a click has been made outside component.
    useEffect(() => {
        const onGlobalClick = (event) => {
            if (wrapper.current && !wrapper.current.contains(event.target)) {
                close();
            }
        };

        document.addEventListener("mousedown", onGlobalClick);

        return () => document.removeEventListener("mousedown", onGlobalClick);
    }, [close]);

    // Cancel previous typing.
    useEffect(() => () => cancelFn(), [cancelFn]);

    const handleFocus = () => {
        setSuggestionsOpen(true);
    };

    const handleChangeQuery = (event) => {
        let canceled = false;
        let timer;
        setIsLoadingSuggestions(true);

        const newCancelFn = () => {
            canceled = true;
            clearTimeout(timer);
        };

        const query = event.target.value;

        setQuery(query);

        if (query === "") {
            setHasSuggestions(false);
        } else {
            timer = setTimeout(() => {
                const options = { limit: 5, page: 1 };
                setSuggestionsOpen(true);
                setHasSuggestions(true);
                shopApi.getSuggestions(query, options, customer.token).then((products) => {
                    if (canceled) {
                        return;
                    }

                    setIsLoadingSuggestions(false);

                    setSuggestedProducts(products.data.items);
                });
            }, 100);
        }

        setCancelFn(() => newCancelFn);
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (!document.activeElement || document.activeElement === document.body) {
                return;
            }

            // Close suggestions if the focus received an external element.
            if (wrapper.current && !wrapper.current.contains(document.activeElement)) {
                close();
            }
        }, 10);
    };

    // Close suggestions when the Escape key has been pressed.
    const handleKeyDown = (event) => {
        // Escape.
        if (event.which === 27) {
            close();
        }
    };

    const rootClasses = classNames(`search search--location--${context}`, className, {
        "search--suggestions-open": suggestionsOpen,
        "search--has-suggestions": hasSuggestions,
    });

    const closeButton =
        context !== "mobile-header" ? (
            ""
        ) : (
            <button className="search__button search__button--type--close" type="button" onClick={close}>
                <Cross20Svg />
            </button>
        );

    return (
        <div className={rootClasses} ref={wrapper} onBlur={handleBlur}>
            <div className="search__body">
                <form style={{ borderRadius: '10px' }} className="search__form" action={`${process.env.PUBLIC_URL}/products/search`}>
                    <input
                    style={{borderTopLeftRadius:'10px',borderBottomLeftRadius:'10px'}}
                        ref={inputRef}
                        onChange={handleChangeQuery}
                        onFocus={handleFocus}
                        onKeyDown={handleKeyDown}
                        value={query}
                        className="search__input"
                        name="keyword"
                        placeholder="Cari produk ..."
                        aria-label="Site search"
                        type="text"
                        autoComplete="off"
                    />
                    <button className="search__button search__button--type--submit" type="submit" style={{borderTopRightRadius:'10px',borderBottomRightRadius:'10px'}}>
                        <Search20Svg />
                    </button>
                    {closeButton}
                    {/* <div className="search__border" /> */}
                </form>

                <Suggestions
                    className="search__suggestions"
                    context={context}
                    products={suggestedProducts}
                    isLoading={isLoadingSuggestions}
                    query={query}
                />
            </div>
        </div>
    );
});

const mapStateToProps = (state) => ({ customer: state.customer });

export default withRouter(connect(mapStateToProps, null)(Search));
