"use strict";

import {
	Classlist,
	Freedom,
	Recess,
	Task,
	Timespan,
	Workweek,
	archivePreview,
	search,
	settings
} from "./structure.js";

void async function () {
	try {
		//#region Definition
		/** @type {Array<[HTMLDivElement, HTMLHeadingElement, HTMLHeadingElement, HTMLHeadingElement]>} */
		const groups = Array.from(document.querySelectorAll(`div.-container`)).map((divContainer) => {
			if (!(divContainer instanceof HTMLDivElement)) {
				throw new TypeError(`Invalid element: ${divContainer}`);
			}
			const h4Subtitle = divContainer.appendChild(document.createElement(`h4`));
			h4Subtitle.hidden = !settings.dates;
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
		const schedule = search.get(`schedule`);
		switch (schedule) {
			case undefined: break;
			case `210`:
			case `2.3`: {
				await window.load(new Promise(async (resolve, reject) => {
					try {
						const name = `${schedule}.json`;
						const response = await fetch(`../database/${name}`);
						const object = await response.json();
						const workweek = Workweek.import(object);
						archivePreview.data = { title: name, date: Date.now(), notation: Workweek.export(workweek) };;
						resolve(undefined);
					} catch (error) {
						reject(error);
					}
				}), 200, 800);
			} break;
			default: throw new ReferenceError(`Schedule '${schedule}' not found`);
		}

		if (archivePreview.data === null) {
			await window.alertAsync(`Schedule not detected. Upload it in settings to continue`);
			location.assign(`./settings.html`);
			return;
		}
		const workweek = Workweek.import(archivePreview.data.notation);
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
					if (settings.descriptions) {
						h4Description.innerText += activity.description;
					}
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
		document.prevent(document.analysis(error));
	}
}();
