import React from 'react';

import './Hover.scss';

type HoverProps = {
    children: React.ReactChild | React.ReactChild[];
}

const Hover = (props: HoverProps) => {
    const cursor = document.querySelector(".app__cursor") as HTMLElement;
    const handleMouseEnter = () => { cursor.classList.add('cursor-hover'); };
    const handleMouseLeave = () => { cursor.classList.remove('cursor-hover'); };

    return (
        <div
            className="app__hover"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {props.children}
        </div>
    );
}

export default Hover;
