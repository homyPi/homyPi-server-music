/* global describe */
/* global before */

import should from "should";

import Music from "../modules/music/Music";
import SharedMock from "./mocks/shared";

import startMongoose from "./mocks/mongoose";
import mongoose from "mongoose";

import {TEST_USER} from "./mocks/data";

describe("Music", function (done) {

    before(done => {
        this.timeout(5000);
        startMongoose()
        .then(() => {
            Music.init(SharedMock);
            done();
        }).catch(done);
    });

    describe("getMyArtists", (done)=> {
        it("should pass and return 3 artists", function (done) {
            this.timeout(5000);
            Music.getMyArtists(TEST_USER, {}).then((results) => {
                results.should.be.ok;
                results.should.be.instanceof(Array).and.have.lengthOf(3);
                done();
            }).catch((err) => {
                console.log("err", err);
                done(err);
            });
        });
        it("should pass but return 0 artists", function (done) {
            this.timeout(5000);
            Music.getMyArtists({_id: new mongoose.Types.ObjectId(), username: "who?"}, {}).then((results) => {
                results.should.be.ok;
                results.should.be.instanceof(Array).and.have.lengthOf(0);
                done();
            }).catch((err) => {
                console.log("err", err);
                done(err);
            });
        });
        it("should throw error 'user undefined'", function (done) {
            this.timeout(5000);
            Music.getMyArtists(undefined, {}).then((results) => {
                done({error: "should not pass :\\"});
            }).catch((err) => {
                err.should.not.be.ok;
                err.should.have.property("error", "user undefined");
                done();
            });
        });
    });


    describe("randomArtist", (done)=> {
        it("should pass and return 1 track", function (done) {
            Music.getRandomArtist(TEST_USER, 1).then((results) => {
                results.should.be.ok;
                results.should.be.instanceof(Array).and.have.lengthOf(1);
                done();
            }).catch((err) => {
                console.log("err", err);
                done(err);
            });
        });
        it("should pass and return 2 track", function (done) {
            Music.getRandomArtist(TEST_USER, 2).then((results) => {
                results.should.be.ok;
                results.should.be.instanceof(Array).and.have.lengthOf(2);
                done();
            }).catch((err) => {
                console.log("err", err);
                done(err);
            });
        });
    });
});
