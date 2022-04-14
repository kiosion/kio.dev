// on DOM ready
document.addEventListener('DOMContentLoaded', () => {
	const cursor = document.querySelector(".app__cursor");
	// const bindToQuerySelector = (querySelector) => {
	// 	let a = document.querySelectorAll(".app__cursor-link");
	// 	console.log('Found links:')
	// 	a.forEach(link => {console.log(link);})
	// 	a.forEach(e => e.addEventListener('mouseenter', handleMouseEnter));
	// 	a.forEach(e => e.addEventListener('mouseleave', handleMouseLeave));
	// };

	// Event: mouse enter on link
	const handleMouseEnter = () => {
		cursor.classList.add('hovered');
	};

	// Event: mouse leave on link
	const handleMouseLeave = () => {
		cursor.classList.remove('hovered');
	};

	let a = document.querySelectorAll(".app__cursor-link");
	console.log('Found links:');
	a.forEach(link => {console.log(link);});
	a.forEach(e => e.addEventListener('mouseenter', handleMouseEnter));
	a.forEach(e => e.addEventListener('mouseleave', handleMouseLeave));

	cursor.style.display = "none";

	// Prevent drag
	document.addEventListener("dragstart", (e) => {
		e.preventDefault();
	}, false);

	// Prevent drop
	document.addEventListener("dragover", (e) => {
		e.preventDefault();
	}, false);

	// Prevent right click
	document.addEventListener("contextmenu", (e) => {
		e.preventDefault();
	}, false);

	// Define pos vars
	let xp = 0, yp = 0;
	let mouseX = 0, mouseY = 0;

	// On mouse move
	document.addEventListener("mousemove", (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;
	});

	// Loop
	setInterval(e => {
		xp += ((mouseX - xp)/6);
		yp += ((mouseY - yp)/6);
		cursor.style.left = xp + "px";
		cursor.style.top = yp + "px";
		// $('#cursor').css({
		//     left: xp,
		//     top: yp,
		// });
	}, 6);

	// Show on first movement
	const cursorMove = () => {
		cursor.style.display = "block";
		document.removeEventListener("mousemove", cursorMove);
	};
	document.addEventListener("mousemove", cursorMove);

	// Event: mouseout
	document.addEventListener("mouseout", () => {
		cursor.style.display = "none";
	});

	// Event: mouseover
	document.addEventListener("mouseover", () => {
		cursor.style.display = "block";
	});

	// Event: mousedown
	document.addEventListener("mousedown", () => {
		cursor.classList.add('click');
	});

	// Event: mouseup
	document.addEventListener("mouseup", () => {
		cursor.classList.remove('click');
	});
});
