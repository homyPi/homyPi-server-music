import Promise from "bluebird";

var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();

var mockgoose = require('mockgoose');
mockgoose(mongoose);
var config = require("../../config.js");

import {ARTIST_TEST_1, ARTIST_TEST_2, ARTIST_TEST_3} from "./data";

export const Artist = mongoose.model("Artist", config.schemas.Artist);

function initDB() {
    return new Promise((resolve, reject) => {
        Artist.create([ARTIST_TEST_1, ARTIST_TEST_2, ARTIST_TEST_3], err => {
            (err)? reject(err): resolve();
        });
    });
};

export default function initMongoMock() {
    return new Promise((resolve, reject) => {
        mongoose.connect("mongodb://example.com/TestingDB", function(err) {
            //initDB
            if (err) return reject(err);
            return initDB().then(resolve).catch(reject);
        });
    });
}
