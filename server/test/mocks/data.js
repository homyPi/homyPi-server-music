import mongoose from "mongoose";

export const TEST_USER = {_id: new mongoose.Types.ObjectId(), username: "TEST"}

export const ARTIST_TEST_1 = {
    _id: new mongoose.Types.ObjectId(),
	"spotifyId" : "id1",
	"images" : [
		{
			"height" : 640,
			"url" : "https://i.scdn.co/image/e411aa3e87fe770937ec347cc0914aca6bdb236f",
			"width" : 640
		},
		{
			"height" : 300,
			"url" : "https://i.scdn.co/image/78fcc8fc440dd2ea90b9e31f82d0f626518e869e",
			"width" : 300
		},
		{
			"height" : 64,
			"url" : "https://i.scdn.co/image/9c89b1e8f3d8ec46a7e82307313cdc6f418364eb",
			"width" : 64
		}
	],
	"name" : "Rocky Rockish",
	"user" : TEST_USER
}
export const ARTIST_TEST_2 = {
    _id: new mongoose.Types.ObjectId(),
	"spotifyId" : "id2",
	"images" : [
		{
			"height" : 640,
			"url" : "https://i.scdn.co/image/e411aa3e87fe770937ec347cc0914aca6bdb236f",
			"width" : 640
		},
		{
			"height" : 300,
			"url" : "https://i.scdn.co/image/78fcc8fc440dd2ea90b9e31f82d0f626518e869e",
			"width" : 300
		},
		{
			"height" : 64,
			"url" : "https://i.scdn.co/image/9c89b1e8f3d8ec46a7e82307313cdc6f418364eb",
			"width" : 64
		}
	],
	"name" : "Wub Wub Wub",
	"user" : TEST_USER
}
export const ARTIST_TEST_3 = {
    _id: new mongoose.Types.ObjectId(),
	"spotifyId" : "id3",
	"images" : [
		{
			"height" : 640,
			"url" : "https://i.scdn.co/image/e411aa3e87fe770937ec347cc0914aca6bdb236f",
			"width" : 640
		},
		{
			"height" : 300,
			"url" : "https://i.scdn.co/image/78fcc8fc440dd2ea90b9e31f82d0f626518e869e",
			"width" : 300
		},
		{
			"height" : 64,
			"url" : "https://i.scdn.co/image/9c89b1e8f3d8ec46a7e82307313cdc6f418364eb",
			"width" : 64
		}
	],
	"name" : "Dr Jazzy samba",
	"user" : TEST_USER
}
