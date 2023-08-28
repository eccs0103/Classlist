// @ts-ignore
/** @typedef {import("./structure.js")} */

"use strict";

void async function () {
	try {
		//#region Definition
		/** @type {Array<[HTMLDivElement, HTMLHeadingElement, HTMLHeadingElement, HTMLHeadingElement]>} */
		const groups = Array.from(document.querySelectorAll(`div.-container`)).map((divContainer) => {
			if (!(divContainer instanceof HTMLDivElement)) {
				throw new TypeError(`Invalid element: ${divContainer}`);
			}
			const h4Subtitle = divContainer.appendChild(document.createElement(`h4`));
			const h2Title = divContainer.appendChild(document.createElement(`h2`));
			const h4Description = divContainer.appendChild(document.createElement(`h4`));
			return [divContainer, h4Subtitle, h2Title, h4Description];
		});

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
		//#endregion
		//#region Initialize
		const datalist = search.get(`datalist`);
		if (datalist !== undefined) {
			await Manager.load(new Promise(async (resolve, reject) => {
				try {
					const response = await fetch(`../database/${datalist}.json`);
					const object = await response.json();
					const workweek = Workweek.import(object);
					const notation = Workweek.export(workweek);
					archivePreview.data = notation;
					resolve(undefined);
				} catch (error) {
					reject(error);
				}
			}), 200, 800);
		}

		if (archivePreview.data === null) {
			throw new ReferenceError(`Classlist data not detected`);
		}
		/** @type {Workweek?} */ const workweek = Workweek.import(archivePreview.data);
		const classlist = new Classlist(...workweek.toTimeline());

		/**
		 * @param {Number} moment 
		 */
		function fix(moment) {
			const date = new Date(moment);
			date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
			date.setDate(date.getDate() - 4);
			return date.valueOf();
		};

		/**
		 * @param {Number} moment 
		 */
		function unfix(moment) {
			const date = new Date(moment);
			date.setDate(date.getDate() + 4);
			date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
			return date.valueOf();
		};

		let offset = 0;
		const render = function () {
			const now = fix(Date.now());
			const current = classlist.find(now) + offset;

			for (let index = 0; index < groups.length; index++) {
				const [divContainer, h4Subtitle, h2Title, h4Description] = groups[index];
				const activity = classlist.get(current + index);

				h4Subtitle.innerText = new Date(unfix(activity.begin)).toLocaleDateString();
				h4Description.innerText = ``;
				if (activity instanceof Freedom) {
					h2Title.innerText = `Դասեր չկան`;
				} else if (activity instanceof Recess) {
					h2Title.innerText = `Դասամիջոց`;
				} else if (activity instanceof Task) {
					h2Title.innerText = activity.title;
					h4Description.innerText += activity.description;
				} else throw new TypeError(`Invalid type for ${activity}`);
				divContainer.style.setProperty(`--filled-ratio`, `${Math.min(Math.max(0, (now - activity.begin) / activity.duration), 1) * 100}%`);

				if (index === 0) {
					const { negativity, hours, minutes, seconds } = Timespan.viaDuration(activity.end - now);
					if (h4Description.innerText && !h4Description.innerText.endsWith(`\n`)) {
						h4Description.innerText += `\n`;
					}
					h4Description.innerText += (negativity ? `Անցել է` : `Դեռ կա`);
					h4Description.innerText += ` ${hours} ժամ, ${minutes} րոպե և ${seconds} վայրկյան`;
				}

				divContainer.parentElement?.classList.toggle(`-now`, activity.begin <= now && now < activity.end);
			}
		};

		render();
		setInterval(render, 1000);

		buttonNow.addEventListener(`click`, (event) => {
			offset = 0;
			render();
		});

		buttonBefore.addEventListener(`click`, (event) => {
			offset--;
			render();
		});

		buttonAfter.addEventListener(`click`, (event) => {
			offset++;
			render();
		});
		//#endregion
	} catch (error) {
		Manager.prevent(error);
	}
}();
