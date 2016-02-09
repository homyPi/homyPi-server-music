## Track

### Track sended to raspberry Pi
```
{
	source: String,
	track: {
		uri: String
	}
}
```
#### Example
```
{
	source: "spotify",
	track: {
		uri: "spotify:track:71koAFCnGnugRdGIDfS7f4"
	}
}
```

### Track sended to clients
```
{
	_id: "56b8bc4994c550d143d70c02",
	album: Album object,
	artists: Array of Artists,
	duration_ms: int,
	name: String,
	source: String,
	uri: String
}
```

#### Example
```
{
	_id: "56b8bc4994c550d143d70c02",
	album: {
		images: []
	},
	artists: [
		{
		name: "Gorillaz"
		}
	],
	duration_ms: 210880,
	id: "71koAFCnGnugRdGIDfS7f4",
	name: "19-2000",
	source: "spotify",
	uri: "spotify:track:71koAFCnGnugRdGIDfS7f4"
}
```