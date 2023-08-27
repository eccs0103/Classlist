// @ts-ignore
/** @typedef {import("./components/archive.js")} */
// @ts-ignore
/** @typedef {import("./components/manager.js")} */
// @ts-ignore
/** @typedef {import("./components/timespan.js")} */

"use strict";

//#region Activity
class Activity extends Timespan {
	/**
	 * @param {Number} begin 
	 * @param {Number} duration 
	 */
	constructor(begin, duration) {
		super();
		this.begin = begin;
		this.duration = duration;
	}
	/** @type {Number} */ #begin = 0;
	get begin() {
		return this.#begin;
	}
	set begin(value) {
		this.#begin = value;
	}
	get end() {
		return this.begin + this.duration;
	}
	set end(value) {
		this.begin = value - this.duration;
	}
	toString(full = true) {
		return `${Timespan.viaDuration(this.begin).toString(full)} => ${Timespan.viaDuration(this.end).toString(full)}`;
	}
	clone() {
		const result = new Activity(this.begin, this.duration);
		return result;
	}
}
//#endregion
//#region Freedom
class Freedom extends Activity {
	/**
	 * @param {Number} begin 
	 * @param {Number} duration 
	 */
	constructor(begin, duration) {
		super(begin, duration);
		this.begin = begin;
		this.duration = duration;
	}
	clone() {
		const result = new Freedom(this.begin, this.duration);
		return result;
	}
}
//#endregion
//#region Recess
class Recess extends Activity {
	/**
	 * @param {Number} begin 
	 * @param {Number} duration 
	 */
	constructor(begin, duration) {
		super(begin, duration);
		this.begin = begin;
		this.duration = duration;
	}
	clone() {
		const result = new Recess(this.begin, this.duration);
		return result;
	}
}
//#endregion
//#region Task
class Task extends Activity {
	/**
	 * @param {Number} begin 
	 * @param {Number} duration 
	 * @param {String} title 
	 * @param {String} description 
	 */
	constructor(begin, duration, title, description) {
		super(begin, duration);
		this.begin = begin;
		this.duration = duration;
		this.title = title;
		this.description = description;
	}
	/** @type {String} */ #title = ``;
	get title() {
		return this.#title;
	}
	set title(value) {
		this.#title = value;
	}
	/** @type {String} */ #description = ``;
	get description() {
		return this.#description;
	}
	set description(value) {
		this.#description = value;
	}
	clone() {
		const result = new Task(this.begin, this.duration, this.title, this.description);
		return result;
	}
}
//#endregion

//#region Subject
class Subject {
	/**
	 * @param {String} title 
	 * @param {String} description 
	 */
	constructor(title, description) {
		this.title = title;
		this.description = description;
	}
	/** @type {String} */ #title = ``;
	get title() {
		return this.#title;
	}
	set title(value) {
		this.#title = value;
	}
	/** @type {String} */ #description = ``;
	get description() {
		return this.#description;
	}
	set description(value) {
		this.#description = value;
	}
	/** @type {Array<Task>} */ #tasks = [];
	/** @readonly */ get tasks() {
		return this.#tasks;
	}
	toTimeline() {
		/** @type {Array<Activity>} */ const timeline = [];
		for (let index = 0; index < this.tasks.length; index++) {
			const current = this.tasks[index];
			timeline.push(current);
			const next = this.tasks[index + 1];
			if (next) {
				timeline.push(new Recess(current.end, next.begin - current.end));
			}
		}
		return timeline;
	}
}
//#endregion
//#region Lesson
class Lesson extends Subject {
	/**
	 * @param {String} title 
	 * @param {String} description 
	 * @param {Number} begin 
	 * @param {Number} duration 45 * 60 * 1000
	 */
	constructor(title, description, begin, duration = 2700000) {
		super(title, description);
		const first = new Task(begin, duration, this.title, this.description);
		this.tasks.push(first);
	}
}
//#endregion
//#region Pair
class Pair extends Subject {
	/**
	 * @param {String} title 
	 * @param {String} description 
	 * @param {Number} begin 
	 * @param {Number} duration 40 * 60 * 1000
	 * @param {Number} recess 5 * 60 * 1000
	 */
	constructor(title, description, begin, duration = 2400000, recess = 300000) {
		super(title, description);
		const first = new Task(begin, duration, this.title, this.description);
		const second = new Task(first.end + recess, duration, this.title, this.description);
		this.tasks.push(first, second);
	}
}
//#endregion
//#region Weekday
class Weekday {
	/** @type {Number} */ static #begin = 0;
	/** @readonly */ static get begin() {
		return Weekday.#begin;
	}
	/** @type {Number} */ static #duration = 86400000;
	/** @readonly */ static get duration() {
		return Weekday.#duration;
	}
	/**
	 * @param {String} title 
	 * @param  {Array<Subject>} subjects 
	 */
	constructor(title, ...subjects) {
		this.title = title;
		this.subjects.push(...subjects);
	}
	/** @type {String} */ #title = ``;
	get title() {
		return this.#title;
	}
	set title(value) {
		this.#title = value;
	}
	/** @type {Array<Subject>} */ #subjects = [];
	/** @readonly */ get subjects() {
		return this.#subjects;
	}
	toTimeline() {
		/** @type {Array<Activity>} */ const timeline = [];
		for (let index = 0, pointer = Weekday.begin; index <= this.subjects.length; index++) {
			const subject = this.subjects[index];
			const gap = (subject ? subject.toTimeline()[0].begin : Weekday.duration) - pointer;
			if (gap > 0) {
				timeline.push(index === 0 || index === this.subjects.length ? new Freedom(pointer, gap) : new Recess(pointer, gap));
			}
			if (subject) {
				const line = subject.toTimeline();
				timeline.push(...line);
				pointer = line[line.length - 1].end;
			}
		}
		return timeline;
	}
}
//#endregion
//#region Workweek
class Workweek {
	/**
	 * @param  {Array<Weekday>} weekdays 
	 */
	constructor(...weekdays) {
		this.weekdays.push(...weekdays);
	}
	// /** @readonly */ get duration() {
	// 	return this.weekdays.length * Weekday.duration;
	// }
	/** @type {Array<Weekday>} */ #weekdays = [];
	/** @readonly */ get weekdays() {
		return this.#weekdays;
	}
	toTimeline() {
		/** @type {Array<Activity>} */ const timeline = [];
		for (let index = 0; index < this.weekdays.length; index++) {
			const weekday = this.weekdays[index];
			const line = weekday.toTimeline().map((activity) => {
				activity.begin += index * Weekday.duration;
				return activity;
			});
			timeline.push(...line);
		}
		// TODO
		return timeline;
	}
}
//#endregion
//#region Classlist
class Classlist {
	/**
	 * @param {Array<Activity>} timeline 
	 */
	constructor(...timeline) {
		this.#timeline.push(...timeline);
	}
	/** @type {Array<Activity>} */ #timeline = [];
	/** @readonly */ get length() {
		return this.#timeline.length;
	}
	/** @readonly */ get duration() {
		return this.#timeline[this.length - 1].end;
	}
	/**
	 * @param {Number} index 
	 */
	get(index) {
		const integer = Math.trunc(index / this.length);
		index %= this.length;
		if (index < 0) {
			index += this.length;
		}
		const value = this.#timeline[index].clone();
		value.begin += integer * this.duration;
		return value;
	}
	/**
	 * @param {Number} moment 
	 */
	find(moment) {
		const cycle = Math.trunc(moment / this.duration);
		for (let index = cycle * this.length; index < cycle * this.length + this.length; index++) {
			const activity = this.get(index);
			if (activity.begin <= moment && moment < activity.end) {
				return index;
			}
		}
		throw new ReferenceError(`Can't reach the activity for moment ${moment}`);
	}
}
//#endregion

//#region Settings
/**
 * @typedef {{}} SettingsNotation
 */

class Settings {
	/**
	 * @param {SettingsNotation} source 
	 */
	static import(source) {
		const result = new Settings();
		return result;
	}
	/**
	 * @param {Settings} source 
	 */
	static export(source) {
		const result = (/** @type {SettingsNotation} */ ({}));
		return result;
	}
	reset() {
		const settings = new Settings();
		// TODO
	}
}
//#endregion
//#region Metadata
const metaAuthor = document.querySelector(`meta[name="author"]`);
if (!(metaAuthor instanceof HTMLMetaElement)) {
	throw new TypeError(`Invalid element: ${metaAuthor}`);
}
const developer = metaAuthor.content;

const metaApplicationName = document.querySelector(`meta[name="application-name"]`);
if (!(metaApplicationName instanceof HTMLMetaElement)) {
	throw new TypeError(`Invalid element: ${metaApplicationName}`);
}
const title = metaApplicationName.content;

/** @type {Archive<SettingsNotation>} */ const archiveSettings = new Archive(`${developer}.${title}.Settings`, Settings.export(new Settings()));

const settings = Settings.import(archiveSettings.data);
//#endregion