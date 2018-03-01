import { assert } from "chai";
import dotenv from "dotenv";
import { describe, it, before, after } from "mocha";
import request from "superagent";

import app from "../src/app";
import auth from "./util/auth";
import prefix from "./util/prefix";
import decode from "jwt-decode";

before(function(done) {
    dotenv.config({
        path: ".env.test"
    });
    auth(() => {
        // Many tests need easy access to these two objects, so global-scope them for simplicity.
        global.ACCESS_TOKEN = auth();
        global.USER = decode(ACCESS_TOKEN);

        console.log("Authenticated user " + USER.sub);
        app.start(done);
    })
});

after(function(done) {
    app.stop(done);
});

describe("The test harness", function() {
    it("should access protected endpoints", function(done) {
        // Auth tokens have the format [header].[body].[checksum]
        assert.equal(auth().split(".").length, 3);

        request.get(prefix("/protected"))
            .set("Authorization", "Bearer " + auth())
            .then((res) => {
                assert.equal(res.status, 200);
                done();
            });
    });

    it("should decode JWTs", function() {
        assert.equal(USER.iss, process.env.AUTH_ISSUER);
        assert.equal(USER.aud, process.env.AUTH_AUDIENCE);
    });
});