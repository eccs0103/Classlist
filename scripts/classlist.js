// @ts-ignore
/** @typedef {import("./structure.js")} */
// @ts-ignore
/** @typedef {import("./components/colors.js")} */

"use strict";

try {
	//#region Definition
	const divCurrent = document.querySelector(`div#current`);
	if (!(divCurrent instanceof HTMLDivElement)) {
		throw new TypeError(`Invalid element: ${divCurrent}`);
	}

	const h1CurrentTitle = divCurrent.querySelector(`h1.-title`);
	if (!(h1CurrentTitle instanceof HTMLHeadingElement)) {
		throw new TypeError(`Invalid element: ${h1CurrentTitle}`);
	}

	const h3CurrentDescription = divCurrent.querySelector(`h3.-description`);
	if (!(h3CurrentDescription instanceof HTMLHeadingElement)) {
		throw new TypeError(`Invalid element: ${h3CurrentDescription}`);
	}

	const buttonBefore = document.querySelector(`button#before`);
	if (!(buttonBefore instanceof HTMLButtonElement)) {
		throw new TypeError(`Invalid element: ${buttonBefore}`);
	}

	const buttonAfter = document.querySelector(`button#after`);
	if (!(buttonAfter instanceof HTMLButtonElement)) {
		throw new TypeError(`Invalid element: ${buttonAfter}`);
	}

	const buttonNow = document.querySelector(`button#now`);
	if (!(buttonNow instanceof HTMLButtonElement)) {
		throw new TypeError(`Invalid element: ${buttonNow}`);
	}

	const divNext = document.querySelector(`div#next`);
	if (!(divNext instanceof HTMLDivElement)) {
		throw new TypeError(`Invalid element: ${divNext}`);
	}

	const h1NextTitle = divNext.querySelector(`h1.-title`);
	if (!(h1NextTitle instanceof HTMLHeadingElement)) {
		throw new TypeError(`Invalid element: ${h1NextTitle}`);
	}

	const h3NextDescription = divNext.querySelector(`h3.-description`);
	if (!(h3NextDescription instanceof HTMLHeadingElement)) {
		throw new TypeError(`Invalid element: ${h3NextDescription}`);
	}
	//#endregion
	//#region Initialize
	const workweek = new Workweek(
		new Weekday(`Երկուշաբթի`,
			new Pair(`Ռուսերեն`, `Լսարան 206`, Timespan.parse(`09:30:00`)),
			new Pair(`ԷՀՄ և ծրագրավորում (գործ.)`, `Լսարան 217`, Timespan.parse(`11:05:00`)),
			new Pair(`ԷՀՄ և ծրագրավորում (դասախ.)`, `Լսարան 315`, Timespan.parse(`12:50:00`)),
			new Pair(`Անգլերեն`, `Լսարան 213`, Timespan.parse(`14:30:00`)),
		),
		new Weekday(`Երեքշաբթի`,
			new Pair(`Մաթեմատիկական անալիզ (դասախ.)`, `Լսարան 114`, Timespan.parse(`09:30:00`)),
			new Pair(`Դիսկրետ մաթեմատիկա (գործ.)`, `Լսարան 207`, Timespan.parse(`11:05:00`)),
			new Pair(`Անգլերեն`, `Լսարան 209`, Timespan.parse(`12:50:00`)),
		),
		new Weekday(`Չորեքշաբթի`,
			new Pair(`Ֆիզկուլտուրա`, `Մարզադահլիճ`, Timespan.parse(`09:30:00`)),
			new Pair(`Հայոց պատմություն`, `Լսարան 108`, Timespan.parse(`11:05:00`)),
			new Pair(`Հայոց լեզու`, `Լսարան 305`, Timespan.parse(`14:30:00`)),
		),
		new Weekday(`Հինգշաբթի`,
			new Pair(`Մաթեմատիկական անալիզ (դասախ.)`, `Լսարան 114`, Timespan.parse(`11:05:00`)),
			new Pair(`Մաթեմատիկական անալիզ (գործ.)`, `Լսարան 101`, Timespan.parse(`12:50:00`)),
			new Pair(`Ռուսերեն`, `Լսարան 209`, Timespan.parse(`14:30:00`)),
		),
		new Weekday(`Ուրբաթ`,
			new Pair(`Հանրահաշիվ`, `Լսարան 108`, Timespan.parse(`09:30:00`)),
			new Pair(`ԷՀՄ և ծրագրավորում (գործ.)`, `Լսարան 216`, Timespan.parse(`11:05:00`)),
			new Pair(`Դիսկրետ մաթեմատիկա (դասախ.)`, `Լսարան 108`, Timespan.parse(`12:50:00`)),
		),
		new Weekday(`Շաբաթ`),
		new Weekday(`Կիրակի`),
	);
	const timespans = workweek.toTimespans();

	/**
	 * @param {Number} offset 
	 */
	function render(offset) {
		let moment = (() => {
			const date = new Date();
			return date.valueOf() - date.getTimezoneOffset() * 60 * 1000;
		})();
		moment %= workweek.weekdays.length * Weekday.max;

		let integer = Math.floor(moment / Weekday.max) - 4;
		if (integer < 0) {
			integer += workweek.weekdays.length;
		}
		const fractional = moment % Weekday.max;
		moment = integer * Weekday.max + fractional;

		const index = (() => {
			let index = timespans.findIndex(timespan => timespan.start <= moment && moment < timespan.end);
			if (index == -1) {
				throw new ReferenceError(`Can't reach the timespan for current moment: '${moment}'.`);
			}
			index += offset;
			if (index < 0) {
				index += timespans.length;
			} else if (index >= timespans.length) {
				index -= timespans.length;
			}
			return index;
		})();

		const current = timespans[index];
		[h1CurrentTitle.innerText, h3CurrentDescription.innerText] = (() => {
			if (current instanceof Freedom) {
				return [`Դասեր չկան`, `Դասերը դեռ չեն սկսվել`];
			} else if (current instanceof Task) {
				return [current.title, current.description];
			} else if (current instanceof Recess) {
				return [`Դասամիջոց`, `Հանգտացեք`];
			} else throw new Error(`Invalid timespan type: '${current}'.`);
		})();
		const currentPercent = (moment - current.start) / current.duration;
		divCurrent.style.setProperty(`--precent-filled-part`, `${currentPercent * 100}%`);
		const [hours, minutes, seconds] = Timespan.toTime(current.end - moment);
		h3CurrentDescription.innerText += `\nԴեռ կա ${hours} ժամ, ${minutes} րոպե և ${seconds} վայրկյան`;

		const next = timespans[index + 1] ?? timespans[0];
		[h1NextTitle.innerText, h3NextDescription.innerText] = (() => {
			if (next instanceof Freedom) {
				return [`Դասեր չկան`, `Դասերը դեռ չեն սկսվել`];
			} else if (next instanceof Task) {
				return [next.title, next.description];
			} else if (next instanceof Recess) {
				return [`Դասամիջոց`, `Հանգտացեք`];
			} else throw new Error(`Invalid timespan type: '${next}'.`);
		})();
		const nextPercent = (moment - next.start) / next.duration;
		divNext.style.setProperty(`--precent-filled-part`, `${nextPercent * 100}%`);
	}

	buttonNow.addEventListener(`click`, (event) => {
		offset = 0;
		configure();
	});

	buttonBefore.addEventListener(`click`, (event) => {
		offset--;
		configure();
	});

	buttonAfter.addEventListener(`click`, (event) => {
		offset++;
		configure();
	});

	let offset = 0;

	function configure() {
		render(offset);
	}

	configure();
	setInterval(configure, 1 * 1000);
	//#endregion
} catch (error) {
	Manager.prevent(error);
}
