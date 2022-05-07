import React, { useEffect, useState } from 'react';

import './Footer.scss';
const Footer: React.FunctionComponent<any> = ({ view }) => {
    const [footerView, setFooterView] = useState(view);

    useEffect(() => {
        setFooterView(view);
    }, [view]);

    const setFooterPos = () => {
        switch (footerView) {
            case 'fixed':
                return ' footer__fixed';
            case 'relative':
            default:
                return ' footer__relative';
        }
    }

    const getCurrentYear = () => {
        return new Date().getFullYear();
    }

    return (
        <div className={"app__no-select app__footer" + setFooterPos()}>
            <span>&copy; 2019-{getCurrentYear()} KIOSION | RIGHTS RESERVED</span>
        </div>
    );
}

export default Footer;
