// @ts-ignore
/** @typedef {import("./structure.js")} */

"use strict";

try {
	//#region Definition
	const divSchedulePanel = document.querySelector(`div#schedule-panel`);
	if (!(divSchedulePanel instanceof HTMLDivElement)) {
		throw new TypeError(`Invalid element: ${divSchedulePanel}`);
	}

	const inputUploadSchedule = document.querySelector(`input#upload-schedule`);
	if (!(inputUploadSchedule instanceof HTMLInputElement)) {
		throw new TypeError(`Invalid element: ${inputUploadSchedule}`);
	}

	const spanScheduleInformation = document.querySelector(`span#schedule-information`);
	if (!(spanScheduleInformation instanceof HTMLSpanElement)) {
		throw new TypeError(`Invalid element: ${spanScheduleInformation}`);
	}

	const buttonDownloadSchedule = document.querySelector(`button#download-schedule`);
	if (!(buttonDownloadSchedule instanceof HTMLButtonElement)) {
		throw new TypeError(`Invalid element: ${buttonDownloadSchedule}`);
	}

	const buttonRemoveSchedule = document.querySelector(`button#remove-schedule`);
	if (!(buttonRemoveSchedule instanceof HTMLButtonElement)) {
		throw new TypeError(`Invalid element: ${buttonRemoveSchedule}`);
	}

	const configure = function () {
		divSchedulePanel.toggleAttribute(`data-connected`, archivePreview.data !== null);
		spanScheduleInformation.innerText = (archivePreview.data === null ?
			`Upload` :
			`${archivePreview.data.title} • ${new Date(archivePreview.data.date).toLocaleDateString()}`
		);
	};

	const selectTheme = document.querySelector(`select#theme`);
	if (!(selectTheme instanceof HTMLSelectElement)) {
		throw new TypeError(`Invalid element: ${selectTheme}`);
	}

	const inputToggleDates = document.querySelector(`input#toggle-dates`);
	if (!(inputToggleDates instanceof HTMLInputElement)) {
		throw new TypeError(`Invalid element: ${inputToggleDates}`);
	}

	const inputToggleDescriptions = document.querySelector(`input#toggle-descriptions`);
	if (!(inputToggleDescriptions instanceof HTMLInputElement)) {
		throw new TypeError(`Invalid element: ${inputToggleDescriptions}`);
	}

	const buttonResetSettings = document.querySelector(`button#reset-settings`);
	if (!(buttonResetSettings instanceof HTMLButtonElement)) {
		throw new TypeError(`Invalid element: ${buttonResetSettings}`);
	}
	//#endregion
	//#region Initialize
	window.addEventListener(`beforeunload`, (event) => {
		archiveSettings.data = Settings.export(settings);
	});

	configure();

	inputUploadSchedule.addEventListener(`change`, async (event) => {
		await Manager.load(new Promise(async (resolve, reject) => {
			try {
				const files = inputUploadSchedule.files;
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

	buttonDownloadSchedule.addEventListener(`click`, (event) => {
		const schedule = archivePreview.data;
		if (schedule !== null) {
			Manager.download(new File([JSON.stringify(schedule.notation)], schedule.title));
		}
	});

	buttonRemoveSchedule.addEventListener(`click`, async (event) => {
		if (await Manager.confirm(`Schedule will be removed from memory forever. Are you sure?`, `Warning`)) {
			archivePreview.data = null;
			configure();
		}
	});

	for (const theme of Settings.themes) {
		const option = selectTheme.appendChild(document.createElement(`option`));
		option.value = theme;
		option.innerText = theme.replace(/\b\w/, (match) => match.toUpperCase());
	}
	selectTheme.value = settings.theme;
	selectTheme.addEventListener(`change`, (event) => {
		settings.theme = selectTheme.value;
		document.documentElement.dataset[`theme`] = settings.theme;
	});

	inputToggleDates.checked = settings.dates;
	inputToggleDates.addEventListener(`change`, (event) => {
		settings.dates = inputToggleDates.checked;
	});

	inputToggleDescriptions.checked = settings.descriptions;
	inputToggleDescriptions.addEventListener(`change`, (event) => {
		settings.descriptions = inputToggleDescriptions.checked;
	});

	buttonResetSettings.addEventListener(`click`, async (event) => {
		if (await Manager.confirm(`The settings will be reset to factory defaults. Are you sure?`)) {
			settings.reset();
			selectTheme.value = settings.theme;
			document.documentElement.dataset[`theme`] = settings.theme;
			inputToggleDates.checked = settings.dates;
			inputToggleDescriptions.checked = settings.descriptions;
		}
	});
	//#endregion
} catch (error) {
	Manager.prevent(error);
}