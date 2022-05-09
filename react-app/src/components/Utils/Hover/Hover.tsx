import React, { useEffect, useState } from 'react';

import './Hover.scss';

type HoverChildren = {
    state?: boolean;
    className?: string;
    children: React.ReactChild | React.ReactChild[];
}

const Hover: React.FunctionComponent<HoverChildren> = (props) => {
    const [state, setState] = useState(false);
    const [className, setClassName] = useState('');
    const [children, setChildren] = useState(props.children);

    useEffect(() => {
        props.state === undefined ? setState(true) : setState(props.state);
        props.className === undefined ? setClassName('') : setClassName(' ' + props.className);
        props.children && setChildren(props.children);
    }, [props.state, props.className, props.children]);

    const cursor = document.querySelector(".app__cursor") as HTMLElement;
    const handleMouseEnter = () => { cursor.classList.add('cursor-hover'); };
    const handleMouseLeave = () => { cursor.classList.remove('cursor-hover'); };
    let res;
    
    state ? (res = (
        <span
            className={"app__hover" + className}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </span>
    )) : res = (
        <span className={"app__hover" + className} >
            {children}
        </span>
    );

    return ( res );
}

export default Hover;
