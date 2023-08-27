declare class Workweek {
	weekdays: Array<{
		title: String,
		subjects: Array<{
			title: String,
			description: String,
			begin: Number,
			duration: Number,
			recess?: Number;
		}>;
	}>;
}