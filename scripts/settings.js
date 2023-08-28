// @ts-ignore
/** @typedef {import("./structure.js")} */

"use strict";

try {
	//#region Definition
	const divDatalistPanel = document.querySelector(`div#datalist-panel`);
	if (!(divDatalistPanel instanceof HTMLDivElement)) {
		throw new TypeError(`Invalid element: ${divDatalistPanel}`);
	}

	const inputUploadDatalist = document.querySelector(`input#upload-datalist`);
	if (!(inputUploadDatalist instanceof HTMLInputElement)) {
		throw new TypeError(`Invalid element: ${inputUploadDatalist}`);
	}

	const spanDatalistInformation = document.querySelector(`span#datalist-information`);
	if (!(spanDatalistInformation instanceof HTMLSpanElement)) {
		throw new TypeError(`Invalid element: ${spanDatalistInformation}`);
	}

	const buttonRemoveDatalist = document.querySelector(`button#remove-datalist`);
	if (!(buttonRemoveDatalist instanceof HTMLButtonElement)) {
		throw new TypeError(`Invalid element: ${buttonRemoveDatalist}`);
	}

	const configure = function () {
		divDatalistPanel.toggleAttribute(`data-connected`, archivePreview.data !== null);
		spanDatalistInformation.innerText = (archivePreview.data === null ?
			`Upload for functionality.` :
			`${archivePreview.data.title} • ${new Date(archivePreview.data.date).toLocaleDateString()}`
		);
	};
	//#endregion
	//#region Initialize
	configure();

	inputUploadDatalist.addEventListener(`change`, async (event) => {
		await Manager.load(new Promise(async (resolve, reject) => {
			try {
				const files = inputUploadDatalist.files;
				if (files === null) {
					throw new TypeError(`File list is empty`);
				}
				const file = files[0];
				const object = JSON.parse(await file.text());
				const workweek = Workweek.import(object);
				archivePreview.data = { title: file.name, date: Date.now(), notation: Workweek.export(workweek) };
				configure();
				resolve(undefined);
				location.assign(`./preview.html`);
			} catch (error) {
				reject(error);
			}
		}));
	});

	buttonRemoveDatalist.addEventListener(`click`, async (event) => {
		if (await Manager.confirm(`Datalist will be removed from memory forever. Are you sure?`, `Warning`)) {
			archivePreview.data = null;
			configure();
		}
	});
	//#endregion
} catch (error) {
	Manager.prevent(error);
}