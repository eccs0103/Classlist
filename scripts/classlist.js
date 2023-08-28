// @ts-ignore
/** @typedef {import("./structure.js")} */

"use strict";

void async function () {
	try {
		//#region Definition
		const divContainers = document.querySelectorAll(`div.-container`);

		/** @type {Map<HTMLDivElement, [HTMLHeadingElement, HTMLHeadingElement, HTMLHeadingElement]>} */ const groups = new Map();
		for (let index = 0; index < divContainers.length; index++) {
			const divContainer = divContainers[index];
			if (!(divContainer instanceof HTMLDivElement)) {
				throw new TypeError(`Invalid element: ${divContainer}`);
			}

			const h5Subtitle = divContainer.appendChild(document.createElement(`h5`));
			const h1Title = divContainer.appendChild(document.createElement(`h1`));
			const h3Description = divContainer.appendChild(document.createElement(`h3`));

			groups.set(divContainer, [h5Subtitle, h1Title, h3Description]);
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
		//#endregion
		//#region Initialize
		const database = search.get(`database`);
		switch (database) {
			case `210`:
			case `2.3`: {
				await Manager.load(new Promise(async (resolve, reject) => {
					try {
						const response = await fetch(`../database/${database}.json`);
						const object = await response.json();
						const workweek = Workweek.import(object);
						const notation = Workweek.export(workweek);
						archivePreview.data = notation;
						resolve(undefined);
					} catch (error) {
						reject(error);
					}
				}));
			} break;
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
			const moment = fix(Date.now());

			const current = classlist.find(moment) + offset;

			let index = 0;
			for (const [divContainer, [h5Subtitle, h1Title, h3Description]] of groups) {
				if (!(divContainer instanceof HTMLDivElement)) {
					throw new TypeError(`Invalid element: ${divContainer}`);
				}
				const activity = classlist.get(current + index);

				h5Subtitle.innerText = new Date(unfix(activity.begin)).toLocaleDateString();
				h3Description.innerText = ``;
				if (activity instanceof Freedom) {
					h1Title.innerText = `Դասեր չկան`;
				} else if (activity instanceof Recess) {
					h1Title.innerText = `Դասամիջոց`;
				} else if (activity instanceof Task) {
					h1Title.innerText = activity.title;
					h3Description.innerText += activity.description;
				} else throw new TypeError(`Invalid type for ${activity}`);
				divContainer.style.setProperty(`--filled-ratio`, `${Math.min(Math.max(0, (moment - activity.begin) / activity.duration), 1) * 100}%`);

				if (index === 0) {
					const { negativity, hours, minutes, seconds } = Timespan.viaDuration(activity.end - moment);
					if (h3Description.innerText && !h3Description.innerText.endsWith(`\n`)) {
						h3Description.innerText += `\n`;
					}
					h3Description.innerText += (negativity ? `Անցել է` : `Դեռ կա`);
					h3Description.innerText += ` ${hours} ժամ, ${minutes} րոպե և ${seconds} վայրկյան`;
				}

				divContainer.parentElement?.classList.toggle(`-current`, activity.begin <= moment && moment < activity.end);
				index++;
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
