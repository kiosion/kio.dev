import React from 'react';
import { motion } from 'framer-motion';
// import { ArrowForward, Code, Language } from '@mui/icons-material';

import { images } from '../../constants';
import FilterItem from './FilterItem/FilterItem';

import './Header.scss';
const Header = () => {
	return (
	<div id="home" className="app__header">

			<motion.div
				whileInView={{ y: [0, 0], opacity: [0, 1] }}
				transition={{ duration: 1, ease: 'easeInOut' }}
				className="app__header-row app__no-select"
			>
				<motion.div
					whileInView={{ x: [25, 0], opacity: [0, 1] }}
					transition={{ duration: 1, ease: 'easeInOut' }}
					className="app__header-col"
				>
					<div className="app__header-logo">
						<img src={ images.logo_black } alt="logo" />
					</div>
				</motion.div>

				<motion.div
					whileInView={{ x: [25, 0], opacity: [0, 1] }}
					transition={{ duration: 1, ease: 'easeInOut' }}
					className="app__header-col"
				>
					<div className="app__header-list">
						<FilterItem props={{ text: 'DESIGN' }} />
						<FilterItem props={{ text: 'DEVELOPMENT' }} />
						<FilterItem props={{ text: 'ALL WORK' }} />
					</div>
				</motion.div>

				<motion.div
					whileInView={{ x: [25, 0], opacity: [0, 1] }}
					transition={{ duration: 1, ease: 'easeInOut' }}
					className="app__header-col"
				>
					<div className="app__header-list">
						<div className="linkitem linkitem-secondary">ABOUT</div>
						<div className="linkitem linkitem-secondary">SOCIALS</div>
						<div className="linkitem linkitem-secondary">BLOG</div>
					</div>
				</motion.div>

			</motion.div>

		<div className="app__header-divider"></div>

	</div>
	);
}

export default Header;
