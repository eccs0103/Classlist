// @ts-ignore
/** @typedef {import("../modules/application.js")} */

"use strict";

//#region Timespan
/**
 * @typedef TimespanNotation
 * @property {Number} start
 * @property {Number} duration
 */
class Timespan {
	/**
	 * @param {Number} moment 
	 */
	static toTime(moment) {
		const milliseconds = moment % 1000;
		moment = Math.floor(moment / 1000);
		const seconds = moment % 60;
		moment = Math.floor(moment / 60);
		const minutes = moment % 60;
		moment = Math.floor(moment / 60);
		const hours = moment % 24;
		return (/** @type {[Number, Number, Number, Number]} */ ([hours, minutes, seconds, milliseconds]));
	}
	/**
	 * @param {Number} hours 
	 * @param {Number} minutes 
	 * @param {Number} seconds 
	 * @param {Number} milliseconds 
	 */
	static toMoment(hours = 0, minutes = 0, seconds = 0, milliseconds = 0) {
		return ((((hours) * 60 + minutes) * 60 + seconds) * 1000 + milliseconds);
	}
	/**
	 * @param {Number} moment 
	 * @param {Boolean} full 
	 */
	static toString(moment, full = false) {
		const [hours, minutes, seconds, milliseconds] = Timespan.toTime(moment);
		let result = seconds.toFixed().padStart(2, `0`);
		if (full || milliseconds > 0) {
			result = `${result}.${milliseconds.toFixed().padStart(3, `0`)}`;
		}
		if (full || hours > 0) {
			result = `${minutes.toFixed().padStart(2, `0`)}:${result}`;
			result = `${hours.toFixed().padStart(2, `0`)}:${result}`;
		} else if (minutes > 0) {
			result = `${minutes.toFixed().padStart(2, `0`)}:${result}`;
		}
		return result;
	}
	/**
	 * @param {String} text 
	 */
	static parse(text) {
		const match = /(?:(?:(\d+):)?(\d+):)?(\d+)(?:\.(\d+))?/.exec(text);
		if (!match) {
			throw new SyntaxError(`Invalid moment syntax: '${text}'.`);
		}
		const [, hours, minutes, seconds, milliseconds] = match.map(part => Number.parseInt(part ?? 0));
		if (0 > hours || hours >= 24) throw new RangeError(`Invalid hours value: '${hours}'.`);
		if (0 > minutes || minutes >= 60) throw new RangeError(`Invalid minutes value: '${minutes}'.`);
		if (0 > seconds || seconds >= 60) throw new RangeError(`Invalid seconds value: '${seconds}'.`);
		if (0 > milliseconds || milliseconds >= 1000) throw new RangeError(`Invalid milliseconds value: '${milliseconds}'.`);
		return Timespan.toMoment(hours, minutes, seconds, milliseconds);
	}
	/**
	 * @param {TimespanNotation} source 
	 */
	static import(source) {
		const result = new Timespan(
			source.start,
			source.duration
		);
		return result;
	}
	/**
	 * @param {Timespan} source 
	 */
	static export(source) {
		const result = (/** @type {TimespanNotation} */ ({}));
		result.start = source.#start;
		result.duration = source.#duration;
		return result;
	}
	/**
	 * @param {Number} start 
	 * @param {Number} duration 
	 */
	constructor(start, duration) {
		this.#start = start;
		this.#duration = duration;
		this.#end = this.#start + this.#duration;
	}
	/** @type {Number} */ #start;
	get start() {
		return this.#start;
	}
	set start(value) {
		this.#start = value;
		this.#end = this.#start + this.#duration;
	}
	/** @type {Number} */ #duration;
	get duration() {
		return this.#duration;
	}
	set duration(value) {
		this.#duration = value;
		this.#end = this.#start + this.#duration;
	}
	/** @type {Number} */ #end;
	get end() {
		return this.#end;
	}
	set end(value) {
		this.#end = value;
		this.#start = this.#end - this.#duration;
	}
	/**
	 * @param {Boolean} format 
	 */
	toString(format = false) {
		if (format) {
			return `(${Timespan.toString(this.#start, true)} - ${Timespan.toString(this.#end, true)})`;
		} else {
			return `(${(this.#start)} - ${this.#end})`;
		}
	}
}
//#endregion
//#region Freedom
/**
 * @typedef {TimespanNotation} FreedomNotation
 */
class Freedom extends Timespan {
	/**
	 * @param {FreedomNotation} source 
	 */
	static import(source) {
		const result = (/** @type {Freedom} */ (super.import(source)));
		return result;
	}
	/**
	 * @param {Freedom} source 
	 */
	static export(source) {
		const result = (/** @type {FreedomNotation} */ (super.export(source)));
		return result;
	}
}
//#endregion
//#region Recess
/**
 * @typedef {TimespanNotation} RecessNotation
 */
class Recess extends Timespan {
	/**
	 * @param {RecessNotation} source 
	 */
	static import(source) {
		const result = (/** @type {Recess} */ (super.import(source)));
		return result;
	}
	/**
	 * @param {Recess} source 
	 */
	static export(source) {
		const result = (/** @type {RecessNotation} */ (super.export(source)));
		return result;
	}
}
//#endregion
//#region Task
/**
 * @typedef {Object} __TaskNotation__
 * @property {String} title
 * @property {String} description
 * @typedef {TimespanNotation & __TaskNotation__} TaskNotation
 */
class Task extends Timespan {
	/**
	 * @param {TaskNotation} source 
	 */
	static import(source) {
		const result = (/** @type {Task} */ (super.import(source)));
		return result;
	}
	/**
	 * @param {Task} source 
	 */
	static export(source) {
		const result = (/** @type {TaskNotation} */ (super.export(source)));
		return result;
	}
	/**
	 * @param {String} title 
	 * @param {String} description 
	 * @param {Number} start 
	 * @param {Number} duration 
	 */
	constructor(title, description, start, duration) {
		super(start, duration);
		this.#title = title;
		this.#description = description;
	}
	/** @type {String} */ #title;
	/** @readonly */ get title() {
		return this.#title;
	}
	/** @type {String} */ #description;
	/** @readonly */ get description() {
		return this.#description;
	}
}
//#endregion
//#region Subject
/**
 * @typedef SubjectNotation
 * @property {String} title
 * @property {String} description
 */
class Subject {
	/**
	 * @param {SubjectNotation} source 
	 */
	static import(source) {
		const result = new Subject(
			source.title,
			source.description
		);
		return result;
	}
	/**
	 * @param {Subject} source 
	 */
	static export(source) {
		const result = (/** @type {SubjectNotation} */ ({}));
		result.title = source.#title;
		result.description = source.#description;
		return result;
	}
	/**
	 * @param {String} title 
	 * @param {String} description 
	 */
	constructor(title, description) {
		this.#title = title;
		this.#description = description;
	}
	/** @type {String} */ #title;
	/** @readonly */ get title() {
		return this.#title;
	}
	/** @type {String} */ #description;
	/** @readonly */ get description() {
		return this.#description;
	}
	/**
	 * @returns {Readonly<Array<Timespan>>}
	 */
	toTimespans() {
		throw new ReferenceError(`Method 'toTimespans' not implemented.`);
	}
}
//#endregion
//#region Lesson
/**
 * @typedef {Object} __LessonNotation__
 * @property {Number} start
 * @property {Number} duration
 * @typedef {SubjectNotation & __LessonNotation__} LessonNotation
 */
class Lesson extends Subject {
	/**
	 * @param {LessonNotation} source 
	 */
	static import(source) {
		const result = new Lesson(
			source.title,
			source.description,
			source.start,
			source.duration
		);
		return result;
	}
	/**
	 * @param {Lesson} source 
	 */
	static export(source) {
		const result = (/** @type {LessonNotation} */ (super.export(source)));
		const task = Task.export(source.#first);
		result.start = task.start;
		result.duration = task.duration;
		return result;
	}
	/**
	 * @param {String} title 
	 * @param {String} description 
	 * @param {Number} start 
	 * @param {Number} duration 45 * 60 * 1000
	 */
	constructor(title, description, start, duration = 2700000) {
		super(title, description);
		this.#first = new Task(this.title, this.description, start, duration);
	}
	/** @type {Task} */ #first;
	/** @readonly */ get first() {
		return this.#first;
	}
	toTimespans() {
		return Object.freeze(/** @type {Array<Timespan>} */([
			this.#first
		]));
	}
}
//#endregion
//#region Pair
/**
 * @typedef {Object} __PairNotation__
 * @property {Number} start
 * @property {Number} duration
 * @property {Number} recess
 * @typedef {SubjectNotation & __PairNotation__} PairNotation
 */
class Pair extends Subject {
	/**
	 * @param {PairNotation} source 
	 */
	static import(source) {
		const result = new Pair(
			source.title,
			source.description,
			source.start,
			source.duration,
			source.recess
		);
		return result;
	}
	/**
	 * @param {Pair} source 
	 */
	static export(source) {
		const result = (/** @type {PairNotation} */ ({}));
		result.title = source.title;
		result.description = source.description;
		const task = Task.export(source.#first);
		result.start = task.start;
		result.duration = task.duration;
		result.recess = source.#second.start - source.#first.end;
		return result;
	}
	/**
	 * @param {String} title 
	 * @param {String} description 
	 * @param {Number} start 
	 * @param {Number} duration 40 * 60 * 1000
	 * @param {Number} recess 5 * 60 * 1000
	 */
	constructor(title, description, start, duration = 2400000, recess = 300000) {
		super(title, description);
		this.#first = new Task(this.title, this.description, start, duration);
		this.#second = new Task(this.title, this.description, this.#first.end + recess, duration);
	}
	/** @type {Task} */ #first;
	/** @readonly */ get first() {
		return this.#first;
	}
	/** @type {Task} */ #second;
	/** @readonly */ get second() {
		return this.#second;
	}
	toTimespans() {
		return Object.freeze(/** @type {Array<Timespan>} */([
			this.#first,
			new Recess(this.#first.end, this.#second.start - this.#first.end),
			this.#second
		]));
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
	/** @type {Number} */ static #min = 0;
	/** @readonly @default 0 */ static get min() {
		return this.#min;
	}
	/** @type {Number} */ static #max = 86400000;
	/** @readonly @default 86400000 */ static get max() {
		return this.#max;
	}
	/**
	 * @param {WeekdayNotation} source 
	 */
	static import(source) {
		const result = new Weekday(
			source.title,
			...source.subjects.map((subject) => (/** @type {Subject} */ ((Object.hasOwn(subject, `second`) ? Pair.import(/** @type {PairNotation} */(subject)) : Lesson.import(/** @type {LessonNotation} */(subject))))))
		);
		return result;
	}
	/**
	 * @param {Weekday} source 
	 */
	static export(source) {
		const result = (/** @type {WeekdayNotation} */ ({}));
		result.title = source.#title;
		result.subjects = source.#subjects.map((subject) => {
			if (subject instanceof Lesson) {
				return Lesson.export(subject);
			} else if (subject instanceof Pair) {
				return Pair.export(subject);
			} else throw new TypeError(`Invalid subject type: '${subject}'.`);
		});
		return result;
	}
	/**
	 * @param {String} title 
	 * @param  {Array<Subject>} subjects 
	 */
	constructor(title, ...subjects) {
		this.#title = title;
		this.#subjects = subjects;
	}
	/** @type {String} */ #title;
	/** @readonly */ get title() {
		return this.#title;
	}
	/** @type {Array<Subject>} */ #subjects;
	/** @readonly */ get subjects() {
		return Object.freeze(this.#subjects);
	}
	toTimespans() {
		const timeline = (/** @type {Array<Timespan>} */([]));
		for (let index = 0, pointer = Weekday.min; index <= this.#subjects.length; index++) {
			const subject = this.#subjects.at(index);
			const gap = (subject ? (/** @type {Lesson | Pair} */ (subject)).first.start : Weekday.max) - pointer;
			if (gap > 0) {
				timeline.push(index == 0 || index == this.#subjects.length ? new Freedom(pointer, gap) : new Recess(pointer, gap));
			}
			if (subject) {
				timeline.push(...subject.toTimespans());
				pointer = (() => {
					if (subject instanceof Lesson) {
						return subject.first.end;
					} else if (subject instanceof Pair) {
						return subject.second.end;
					} else throw new TypeError(`Invalid subject type: '${subject}'.`);
				})();
			}
		}
		return Object.freeze(timeline);
	}
}
//#endregion
//#region Workweek
/**
 * @typedef WorkweekNotation
 * @property {Array<WeekdayNotation>} weekdays
 */
class Workweek {
	/**
	 * @param {WorkweekNotation} source 
	 */
	static import(source) {
		const result = new Workweek(
			...source.weekdays.map(weekday => Weekday.import(weekday))
		);
		return result;
	}
	/**
	 * @param {Workweek} source 
	 */
	static export(source) {
		const result = (/** @type {WorkweekNotation} */ ({}));
		result.weekdays = source.#weekdays.map(weekday => Weekday.export(weekday));
		return result;
	}
	/**
	 * @param  {Array<Weekday>} weekdays 
	 */
	constructor(...weekdays) {
		this.#weekdays = weekdays;
	}
	/** @type {Array<Weekday>} */ #weekdays;
	/** @readonly */ get weekdays() {
		return Object.freeze(this.#weekdays);
	}
	toTimespans() {
		return Object.freeze(this.#weekdays.flatMap((weekday, index) => weekday.toTimespans().map((timespan) => {
			// index -= 4;
			// if (index < 0) {
			// 	index += 7;
			// }
			timespan.start += index * Weekday.max;
			return timespan;
		})));
	}
}
//#endregion