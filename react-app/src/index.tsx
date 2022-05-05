import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import './index.scss';

// Main app
ReactDOM.render(<App />, document.getElementById('root'));

if (!navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
	// Custom cursor on DOM load
	document.addEventListener('DOMContentLoaded', () => {
		// Defind consts + vars
		const cursor = document.querySelector(".app__cursor") as HTMLElement;
		cursor.style.display = "none";
		// const handleMouseEnter = () => { cursor.classList.add('cursor-hover'); };
		// const handleMouseLeave = () => { cursor.classList.remove('cursor-hover'); };
		let xp = 0, yp = 0;
		let mouseX = 0, mouseY = 0;
		// let a = document.querySelectorAll(".app__cursor-link");
		// a.forEach(e => e.addEventListener('mouseenter', handleMouseEnter));
		// a.forEach(e => e.addEventListener('mouseleave', handleMouseLeave));
		// Event listeners
		const cursorMove = () => { cursor.style.display = "block"; document.removeEventListener("mousemove", cursorMove); };
		document.addEventListener("mousemove", cursorMove);
		document.addEventListener("dragstart", (e) => { e.preventDefault(); }, false);
		document.addEventListener("dragover", (e) => { e.preventDefault(); }, false);
		document.addEventListener("contextmenu", (e) => { e.preventDefault(); }, false);
		document.addEventListener("mouseout", () => { cursor.style.display = "none"; });
		document.addEventListener("mouseover", () => { cursor.style.display = "block"; });
		document.addEventListener("mousedown", () => { cursor.classList.add('cursor-click'); });
		document.addEventListener("mouseup", () => { cursor.classList.remove('cursor-click'); });
		document.addEventListener("mousemove", (e) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		});
		// Update loop
		setInterval(e => {
			xp += ((mouseX - xp)/6);
			yp += ((mouseY - yp)/6);
			cursor.style.left = xp + "px";
			cursor.style.top = yp + "px";
		}, 6);
	});
}
