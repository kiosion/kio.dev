import React from 'react';
import { motion } from 'framer-motion';

import { images } from '../../constants';
import { HeaderBlock } from '../../components';

import './Header.scss';
const Header = () => {
	return (
	<div id="home" className="app__header app__flex">

		<div className="app__header-logo app__no-select">
			<motion.img 
				whileInView={{ x: [-25, 0], opacity: [0, 1] }} 
				transition={{ duration: 1, ease: 'easeInOut' }}
				src={ images.logo_bevel } 
				alt="logo" />
		</div>

		<motion.div
			whileInView={{ x: [25, 0], opacity: [0, 1] }}
			transition={{ duration: 1, ease: 'easeInOut' }}
			className="app__header-blocks"
		>

			<HeaderBlock
				props={{
					title: "About",
					body: <>I'm Kio - an artist, musician, and developer from Atlantic Canada. I enjoy UI design, full-stack dev projects, and creating art &amp; music in my free time.</>,
				}}
			/>

			<HeaderBlock
				props={{
					title: "Skills",
					body: <>I have experience with JS, TS, Python, PHP, Java, React, Node, SQL, MongoDB, and Bash / ZSH scripting, to name a few languages &amp; tools.</>,
				}}
			/>

			<HeaderBlock
				props={{
					title: "Contact",
					body: <>You can email <a class="app__cursor-link" href="mailto:hi@kio.dev">hi@kio.dev</a> or view my social links at <a class="app__cursor-link" href="https://kio.social/" target="_blank" rel="noreferrer">https://kio.social</a>.</>,
				}}
			/>
		</motion.div>
	</div>
	);
}

export default Header;
