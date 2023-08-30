# Classlist

## Information
Automatically configured schedule.

## Guide
To work with the program, you will need a schedule. The schedule should be structured as a JSON file according to the following schema:
```typescript
interface Lesson { // Structure of individual lessons, similar to those taught in school
	title: String, // Lesson title
	description: String, // Lesson description
	begin: Number, // Start time (in milliseconds)
	duration: Number, // Duration (in milliseconds)
}

interface Pair { // Structure of paired lessons, like those taught in university
	title: String, // Lesson title
	description: String, // Lesson description
	begin: Number, // Start time (in milliseconds)
	duration: Number, // Duration (in milliseconds)
	recess: Number, // Break duration between pairs (in milliseconds)
}

interface Weekday { // Structure of a day, both weekdays and weekends
	title: String, // Day title
	subjects: Array<Lesson | Pair>, // Lessons throughout the day
}

interface Workweek { // Structure of a study period, typically a week, but can differ
	weekdays: Array<Weekday>, // Days during the period
}
```
One of the simplest examples of a JSON structure is provided below:
```json
{
	"weekdays": [
		{
			"title": "Monday",
			"subjects": [
				{
					"title": "Introduction to Programming",
					"description": "Audience 101",
					"begin": 34200000, // 09:30:00
					"duration": 2400000, // 00:40:00
					"recess": 300000 // 00:05:00
				},
				{
					"title": "Data Structures and Algorithms",
					"description": "Audience 203",
					"begin": 39900000, // 11:05:00
					"duration": 2400000, // 00:40:00
					"recess": 300000 // 00:05:00
				},
				{
					"title": "Discrete Mathematics",
					"description": "Audience 305",
					"begin": 46200000, // 12:50:00
					"duration": 2400000, // 00:40:00
					"recess": 300000 // 00:05:00
				}
			]
		},
		{
			"title": "Tuesday",
			"subjects": [
				{
					"title": "Machine Learning Fundamentals",
					"description": "Audience 102",
					"begin": 34200000, // 09:30:00
					"duration": 2400000, // 00:40:00
					"recess": 300000 // 00:05:00
				},
				{
					"title": "Numerical Methods",
					"description": "Audience 204",
					"begin": 39900000, // 11:05:00
					"duration": 2400000, // 00:40:00
					"recess": 300000 // 00:05:00
				},
				{
					"title": "Introduction to Programming",
					"description": "Audience 306",
					"begin": 46200000, // 12:50:00
					"duration": 2400000, // 00:40:00
					"recess": 300000 // 00:05:00
				}
			]
		},
		{
			"title": "Wednesday",
			"subjects": [
				{
					"title": "Cryptography and Network Security",
					"description": "Audience 103",
					"begin": 34200000, // 09:30:00
					"duration": 2400000, // 00:40:00
					"recess": 300000 // 00:05:00
				},
				{
					"title": "Artificial Intelligence Applications",
					"description": "Audience 305",
					"begin": 46200000, // 12:50:00
					"duration": 2400000, // 00:40:00
					"recess": 300000 // 00:05:00
				}
			]
		},
		{
			"title": "Thursday",
			"subjects": [
				{
					"title": "Data Structures and Algorithms",
					"description": "Audience 204",
					"begin": 34200000, // 09:30:00
					"duration": 2400000, // 00:40:00
					"recess": 300000 // 00:05:00
				},
				{
					"title": "Software Engineering Principles",
					"description": "Audience 306",
					"begin": 39900000, // 11:05:00
					"duration": 2400000, // 00:40:00
					"recess": 300000 // 00:05:00
				},
				{
					"title": "Machine Learning Fundamentals",
					"description": "Audience 102",
					"begin": 46200000, // 12:50:00
					"duration": 2400000, // 00:40:00
					"recess": 300000 // 00:05:00
				}
			]
		},
		{
			"title": "Friday",
			"subjects": [
				{
					"title": "Artificial Intelligence Application",
					"description": "Audience 305",
					"begin": 39900000, // 11:05:00
					"duration": 2400000, // 00:40:00
					"recess": 300000 // 00:05:00
				},
				{
					"title": "Discrete Mathematics",
					"description": "Audience 103",
					"begin": 46200000, // 12:50:00
					"duration": 2400000, // 00:40:00
					"recess": 300000 // 00:05:00
				}
			]
		},
		{
			"title": "Saturday",
			"subjects": []
		},
		{
			"title": "Sunday",
			"subjects": []
		}
	]
}
```
As an alternative, you can use the internal engine of the program to quickly generate a JSON file from your schedule using the console.
```javascript
const workweek = new Workweek(
	new Weekday(`Monday`,
		new Pair(`Introduction to Programming`, `Audience 101`, Timespan.parse(`09:30:00`).duration, Timespan.parse(`00:40:00`).duration, Timespan.parse(`00:05:00`).duration),
		new Pair(`Data Structures and Algorithms`, `Audience 203`, Timespan.parse(`11:05:00`).duration, Timespan.parse(`00:40:00`).duration, Timespan.parse(`00:05:00`).duration),
		new Pair(`Discrete Mathematics`, `Audience 305`, Timespan.parse(`12:50:00`).duration, Timespan.parse(`00:40:00`).duration, Timespan.parse(`00:05:00`).duration),
	),
	new Weekday(`Tuesday`,
		new Pair(`Machine Learning Fundamentals`, `Audience 102`, Timespan.parse(`09:30:00`).duration, Timespan.parse(`00:40:00`).duration, Timespan.parse(`00:05:00`).duration),
		new Pair(`Numerical Methods`, `Audience 204`, Timespan.parse(`11:05:00`).duration, Timespan.parse(`00:40:00`).duration, Timespan.parse(`00:05:00`).duration),
		new Pair(`Introduction to Programming`, `Audience 306`, Timespan.parse(`12:50:00`).duration, Timespan.parse(`00:40:00`).duration, Timespan.parse(`00:05:00`).duration),
	),
	new Weekday(`Wednesday`,
		new Pair(`Cryptography and Network Security`, `Audience 103`, Timespan.parse(`09:30:00`).duration, Timespan.parse(`00:40:00`).duration, Timespan.parse(`00:05:00`).duration),
		new Pair(`Artificial Intelligence Applications`, `Audience 305`, Timespan.parse(`12:50:00`).duration, Timespan.parse(`00:40:00`).duration, Timespan.parse(`00:05:00`).duration),
	),
	new Weekday(`Thursday`,
		new Pair(`Data Structures and Algorithms`, `Audience 204`, Timespan.parse(`09:30:00`).duration, Timespan.parse(`00:40:00`).duration, Timespan.parse(`00:05:00`).duration),
		new Pair(`Software Engineering Principles`, `Audience 306`, Timespan.parse(`11:05:00`).duration, Timespan.parse(`00:40:00`).duration, Timespan.parse(`00:05:00`).duration),
		new Pair(`Machine Learning Fundamentals`, `Audience 102`, Timespan.parse(`12:50:00`).duration, Timespan.parse(`00:40:00`).duration, Timespan.parse(`00:05:00`).duration),
	),
	new Weekday(`Friday`,
		new Pair(`Artificial Intelligence Application`, `Audience 305`, Timespan.parse(`11:05:00`).duration, Timespan.parse(`00:40:00`).duration, Timespan.parse(`00:05:00`).duration),
		new Pair(`Discrete Mathematics`, `Audience 103`, Timespan.parse(`12:50:00`).duration, Timespan.parse(`00:40:00`).duration, Timespan.parse(`00:05:00`).duration),
	),
	new Weekday(`Saturday`),
	new Weekday(`Sunday`),
);
Workweek.export(workweek); // Your required data
```
## Feed
### Update 1.0.0
- Added theme customization.
- Added date and description settings for tasks.
- Added the option to reset to factory settings.
- Improved color correction to support both themes.

### Update 0.9.3
- Added database management capability.

### Update 0.9.0
- Added list saving functionality.
- Added database support.

### Update 0.8.0
- Core updated.
- Fixed errors.