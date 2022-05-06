import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { images } from '../../constants';
import Hover from '../Hover/Hover';

import './Header.scss';
const Header: React.FunctionComponent<any> = ({ view, route }) => {
	const [currentView, setCurrentView] = useState(view);
	const [backRoute, setBackRoute] = useState(route);
	const [filterItems, setFilterItems] = useState(new Set<string>(['design']));
	const [hover, setHover] = useState(false);
	const [indicator, setIndicator] = useState(1);

	useEffect(() => {
		setCurrentView(view);
		setBackRoute(route);
	}, [view, route]);

	const isActive = (view: string) => {
		return currentView === view ? ' linkitem__active' : '';
	}

	const isHover = () => {
		return hover ? ' linkitem__placeholder-hover' : '';
	}

	const isFiltered = (item: string) => {
		return filterItems.has(item) ? ' filteritem__active' : '';
	}

	const handleFilterChange = (item: string) => {
		let num: number = 0;

		switch (item) {
			case 'all':
				num = 0;
				break;
			case 'design':
				num = 1;
				break;
			case 'development':
				num = 2;
				break;
		}
		
		item === 'all' ? setFilterItems(new Set(['all'])) : setFilterItems(new Set([item]));
		setIndicator(num);
	}

	const handleIndicator = (num: number) => {
		switch (num) {
			case 0:
				return ' indicator__all';
			case 1:
				return ' indicator__1';
			case 2:
				return ' indicator__2';
		}
	}

	const handleHover = (event: string) => {
		setHover(event === 'enter' ? true : false);
	}

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
					{currentView === 'home' ? (
						<div className="app__header-list">
							<div className={"filterItem__indicator" + handleIndicator(indicator)} />
							<Hover>
								<div 
									className={"header__linkitem linkitem__primary" + isFiltered('design')}
									onClick={() => {
										handleFilterChange('design');
									}}
								>
									design
								</div>
							</Hover>
							<Hover>
								<div 
									className={"header__linkitem linkitem__primary" + isFiltered('development')}
									onClick={() => {
										handleFilterChange('development');
									}}
								>
									development
								</div>
							</Hover>
							<Hover>
								<div 
									className={"header__linkitem linkitem__primary" + isFiltered('all')}
									onClick={() => {
										handleFilterChange('all');
									}}
								>
									all work
								</div>
							</Hover>
						</div>
					) : (
						<div className="app__header-list">
							<div className={"header__linkitem linkitem__placeholder" + isHover()} />
							<Hover>
								<Link to={'/' + backRoute}>
									<div 
										className="header__linkitem linkitem__primary"
										onMouseEnter={() => {
											handleHover('enter');
										}}
										onMouseLeave={() => {
											handleHover('leave');
										}}
									>
										back
									</div>
								</Link>
							</Hover>
						</div>
					)}

				</motion.div>

				<motion.div
					whileInView={{ x: [25, 0], opacity: [0, 1] }}
					transition={{ duration: 1, ease: 'easeInOut' }}
					className="app__header-col"
				>
					<div className="app__header-list">
						<Hover>
							<Link to="/about">
								<div className={"header__linkitem linkitem__secondary" + isActive('about')}>about</div>
							</Link>
						</Hover>
						<Hover>
							<Link to="/socials">
								<div className={"header__linkitem linkitem__secondary" + isActive('social')}>social</div>
							</Link>
						</Hover>
						<Hover>
							<Link to="/blog">
								<div className={"header__linkitem linkitem__secondary" + isActive('blog')}>blog</div>
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
