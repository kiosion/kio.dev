import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { images } from '../../constants';
import FilterItem from './FilterItem/FilterItem';
import Hover from '../Hover/Hover';

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
					whileInView={{ x: [-25, 0], opacity: [0, 1] }}
					transition={{ duration: 1, ease: 'easeInOut' }}
					className="app__header-col"
				>
					<Hover>
						<Link to="/">
							<div className="app__header-logo">
								<img src={ images.logo_black } alt="logo" />
							</div>
						</Link>
					</Hover>
				</motion.div>

				<motion.div
					whileInView={{ x: [25, 0], opacity: [0, 1] }}
					transition={{ duration: 1, ease: 'easeInOut' }}
					className="app__header-col"
				>
					<div className="app__header-list">
						<FilterItem props={{ text: 'design' }} />
						<FilterItem props={{ text: 'development' }} />
						<FilterItem props={{ text: 'all work' }} />
					</div>
				</motion.div>

				<motion.div
					whileInView={{ x: [25, 0], opacity: [0, 1] }}
					transition={{ duration: 1, ease: 'easeInOut' }}
					className="app__header-col"
				>
					<div className="app__header-list">
						<Hover>
							<Link to="/about">
								<div className="header__linkitem">about</div>
							</Link>
						</Hover>
						<Hover>
							<Link to="/socials">
								<div className="header__linkitem">social</div>
							</Link>
						</Hover>
						<Hover>
							<Link to="/blog">
								<div className="header__linkitem">blog</div>
							</Link>
						</Hover>
					</div>
				</motion.div>

			</motion.div>

		<div className="app__header-divider"></div>

	</div>
	);
}

export default Header;
