// @ts-ignore
/** @typedef {import("./structure.js")} */

"use strict";

void async function () {
	try {
		//#region Definition
		const divCurrentContainer = document.querySelector(`div#current > *.-container`);
		if (!(divCurrentContainer instanceof HTMLDivElement)) {
			throw new TypeError(`Invalid element: ${divCurrentContainer}`);
		}

		const h6CurrentSubtitle = divCurrentContainer.appendChild(document.createElement(`h5`));
		const h1CurrentTitle = divCurrentContainer.appendChild(document.createElement(`h1`));
		const h3CurrentDescription = divCurrentContainer.appendChild(document.createElement(`h3`));

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

		const divNextContainer = document.querySelector(`div#next > *.-container`);
		if (!(divNextContainer instanceof HTMLDivElement)) {
			throw new TypeError(`Invalid element: ${divNextContainer}`);
		}

		const h6NextSubtitle = divNextContainer.appendChild(document.createElement(`h5`));
		const h1NextTitle = divNextContainer.appendChild(document.createElement(`h1`));
		const h3NextDescription = divNextContainer.appendChild(document.createElement(`h3`));
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

			const index = classlist.find(moment) + offset;

			/// Current
			const current = classlist.get(index);
			h6CurrentSubtitle.innerText = new Date(unfix(current.begin)).toLocaleDateString();
			h3CurrentDescription.innerText = ``;
			if (current instanceof Freedom) {
				h1CurrentTitle.innerText = `Դասեր չկան`;
			} else if (current instanceof Recess) {
				h1CurrentTitle.innerText = `Դասամիջոց`;
			} else if (current instanceof Task) {
				h1CurrentTitle.innerText = current.title;
				h3CurrentDescription.innerText += current.description;
			} else throw new TypeError(`Invalid type for ${current}`);
			divCurrentContainer.style.setProperty(`--filled-ratio`, `${Math.min(Math.max(0, (moment - current.begin) / current.duration), 1) * 100}%`);
			const { negativity, hours, minutes, seconds } = Timespan.viaDuration(current.end - moment);
			if (h3CurrentDescription.innerText && !h3CurrentDescription.innerText.endsWith(`\n`)) {
				h3CurrentDescription.innerText += `\n`;
			}
			h3CurrentDescription.innerText += (negativity ? `Անցել է` : `Դեռ կա`);
			h3CurrentDescription.innerText += ` ${hours} ժամ, ${minutes} րոպե և ${seconds} վայրկյան`;

			/// Next
			const next = classlist.get(index + 1);
			h6NextSubtitle.innerText = new Date(unfix(next.begin)).toLocaleDateString();
			h3NextDescription.innerText = ``;
			if (next instanceof Freedom) {
				h1NextTitle.innerText = `Դասեր չկան`;
			} else if (next instanceof Recess) {
				h1NextTitle.innerText = `Դասամիջոց`;
			} else if (next instanceof Task) {
				h1NextTitle.innerText = next.title;
				h3NextDescription.innerText += next.description;
			} else throw new TypeError(`Invalid type for ${next}`);
			divNextContainer.style.setProperty(`--filled-ratio`, `${Math.min(Math.max(0, (moment - next.begin) / next.duration), 1) * 100}%`);
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
