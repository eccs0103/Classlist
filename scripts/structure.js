// @ts-ignore
/** @typedef {import("./components/archive.js")} */
// @ts-ignore
/** @typedef {import("./components/manager.js")} */
// @ts-ignore
/** @typedef {import("./components/timespan.js")} */

"use strict";

//#region Activity
/**
 * @typedef ActivityNotation
 * @property {Number} begin
 * @property {Number} duration
 */

class Activity extends Timespan {
	/**
	 * @param {any} source 
	 */
	static import(source) {
		const begin = Reflect.get(source, `begin`);
		if (typeof (begin) !== `number`) {
			throw new TypeError(`Property type ${typeof (begin)} is invalid`);
		}

		const duration = Reflect.get(source, `duration`);
		if (typeof (duration) !== `number`) {
			throw new TypeError(`Property type ${typeof (duration)} is invalid`);
		}

		return new Activity(begin, duration);
	}
	/**
	 * @param {Activity} source 
	 */
	static export(source) {
		const result = (/** @type {ActivityNotation} */ ({}));
		result.begin = source.begin;
		result.duration = source.duration;
		return result;
	}
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
/**
 * @typedef {ActivityNotation} FreedomNotation
 */

class Freedom extends Activity {
	/**
	 * @param {any} source 
	 */
	static import(source) {
		try {
			const base = Activity.import(source);
			return new Freedom(base.begin, base.duration);
		} catch (error) {
			throw error;
		}
	}
	/**
	 * @param {Freedom} source 
	 */
	static export(source) {
		const base = Activity.export(source);
		const result = (/** @type {FreedomNotation} */ ({}));
		result.begin = base.begin;
		result.duration = base.duration;
		return result;
	}
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
/**
 * @typedef {ActivityNotation} RecessNotation
 */

class Recess extends Activity {
	/**
	 * @param {any} source 
	 */
	static import(source) {
		try {
			const base = Activity.import(source);
			return new Recess(base.begin, base.duration);
		} catch (error) {
			throw error;
		}
	}
	/**
	 * @param {Freedom} source 
	 */
	static export(source) {
		const base = Activity.export(source);
		const result = (/** @type {RecessNotation} */ ({}));
		result.begin = base.begin;
		result.duration = base.duration;
		return result;
	}
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
/**
 * @typedef $TaskNotation
 * @property {String} title
 * @property {String} description
 * 
 * @typedef {ActivityNotation & $TaskNotation} TaskNotation
 */

class Task extends Activity {
	/**
	 * @param {any} source 
	 */
	static import(source) {
		try {
			const base = Activity.import(source);

			const title = Reflect.get(source, `title`);
			if (typeof (title) !== `string`) {
				throw new TypeError(`Property type ${typeof (title)} is invalid`);
			}

			const description = Reflect.get(source, `description`);
			if (typeof (description) !== `string`) {
				throw new TypeError(`Property type ${typeof (description)} is invalid`);
			}

			return new Task(base.begin, base.duration, title, description);
		} catch (error) {
			throw error;
		}
	}
	/**
	 * @param {Freedom} source 
	 */
	static export(source) {
		const base = Activity.export(source);
		const result = (/** @type {TaskNotation} */ ({}));
		result.begin = base.begin;
		result.duration = base.duration;
		return result;
	}
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
/**
 * @typedef SubjectNotation
 * @property {String} title
 * @property {String} description
 * @property {Array<TaskNotation>} tasks
 */

class Subject {
	/**
	 * @param {any} source 
	 */
	static import(source) {
		const title = Reflect.get(source, `title`);
		if (typeof (title) !== `string`) {
			throw new TypeError(`Property type ${typeof (title)} is invalid`);
		}

		const description = Reflect.get(source, `description`);
		if (typeof (description) !== `string`) {
			throw new TypeError(`Property type ${typeof (description)} is invalid`);
		}

		let tasks = Reflect.get(source, `tasks`);
		if (!(tasks instanceof Array)) {
			throw new TypeError(`Property type ${tasks} is invalid`);
		}
		tasks = tasks.map((task) => {
			try {
				return Task.import(task);
			} catch (error) {
				throw error;
			}
		});

		const result = new Subject(title, description);
		result.tasks.push(...tasks);
		return result;
	}
	/**
	 * @param {Subject} source 
	 */
	static export(source) {
		const result = (/** @type {SubjectNotation} */ ({}));
		result.title = source.title;
		result.description = source.description;
		result.tasks = source.tasks.map((task) => Task.export(task));
		return result;
	}
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
/**
 * @typedef {SubjectNotation} LessonNotation
 */

class Lesson extends Subject {
	/**
	 * @param {any} source 
	 */
	static import(source) {
		try {
			const base = Subject.import(source);

			const begin = base.tasks[0].begin;

			const duration = base.tasks[0].duration;

			return new Lesson(base.title, base.description, begin, duration);
		} catch (error) {
			throw error;
		}
	}
	/**
	 * @param {Lesson} source 
	 */
	static export(source) {
		const base = Subject.export(source);
		const result = (/** @type {LessonNotation} */ ({}));
		result.title = base.title;
		result.description = base.description;
		result.tasks = base.tasks;
		return result;
	}
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
/**
 * @typedef {SubjectNotation} PairNotation
 */

class Pair extends Subject {
	/**
	 * @param {any} source 
	 */
	static import(source) {
		try {
			const base = Subject.import(source);

			const begin = base.tasks[0].begin;

			const duration = base.tasks[0].duration;

			return new Pair(base.title, base.description, begin, duration);
		} catch (error) {
			throw error;
		}
	}
	/**
	 * @param {Pair} source 
	 */
	static export(source) {
		const base = Subject.export(source);
		const result = (/** @type {PairNotation} */ ({}));
		result.title = base.title;
		result.description = base.description;
		result.tasks = base.tasks;
		return result;
	}
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
/**
 * @typedef WeekdayNotation
 * @property {String} title
 * @property {Array<SubjectNotation>} subjects
 */

class Weekday {
	/**
	 * @param {any} source 
	 */
	static import(source) {
		const title = Reflect.get(source, `title`);
		if (typeof (title) !== `string`) {
			throw new TypeError(`Property type ${typeof (title)} is invalid`);
		}

		let subjects = Reflect.get(source, `subjects`);
		if (!(subjects instanceof Array)) {
			throw new TypeError(`Property type ${subjects} is invalid`);
		}
		subjects = subjects.map((subject) => {
			try {
				return Subject.import(subject);
			} catch (error) {
				throw error;
			}
		});
	}
	/**
	 * @param {Weekday} source 
	 */
	static export(source) {

	}
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
const search = Manager.getSearch();
//#endregion