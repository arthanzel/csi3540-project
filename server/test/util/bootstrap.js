import "async";

import token from "./token";

import Project from "../../src/model/Project";
import Equation from "../../src/model/Equation";

/**
 * Functions for setting up and tearing down test data in the database.
 */
const bootstrap = {};
export default bootstrap;

/**
 * Inserts some test data into the database.
 * This function should be called before each test case.
 * @param done Callback for when the operation completes.
 */
bootstrap.setup = function bootstrapSetup(done) {
    const jwt = token();

    const oscillator = new Project({
        name: "Harmonic Oscillator",
        user: jwt.sub,
        equations: [
            new Equation({ symbol: "F", expression: "-k*X" }),
            new Equation({ symbol: "X", expression: "F" })
        ],
        parameters: [
            new Equation({ symbol: "F", expression: "0" }),
            new Equation({ symbol: "X", expression: "-1" }),
            new Equation({ symbol: "k", expression: "1" })
        ]
    });
    const lotka = new Project({
        name: "Lotka-Volterra",
        user: jwt.sub,
        equations: [
            new Equation({ symbol: "X", expression: "a*X - b*X*Y" }),
            new Equation({ symbol: "Y", expression: "c*X*Y - d*Y" })
        ],
        parameters: [
            new Equation({ symbol: "X", expression: "1" }),
            new Equation({ symbol: "Y", expression: "0.5" }),
            new Equation({ symbol: "a", expression: "0.6" }),
            new Equation({ symbol: "b", expression: "1.3" }),
            new Equation({ symbol: "c", expression: "1" }),
            new Equation({ symbol: "d", expression: "1" })
        ]
    });
    const mixing = new Project({
        name: "Mixing Problem",
        user: jwt.sub,
        equations: [
            new Equation({ symbol: "X", expression: "c * k - X / v * k" })
        ],
        parameters: [
            new Equation({ symbol: "X", expression: "0" }),
            new Equation({ symbol: "k", expression: "10" }),
            new Equation({ symbol: "c", expression: "0.7" }),
            new Equation({ symbol: "v", expression: "500" }),
        ]
    });

    console.log("DB Boostrap: Starting");
    Project.insertMany([mixing, oscillator, lotka], (err) => {
        if (err && err.code === 11000) {
            // E11000 indicates duplicate key
            // This means that the docs are already in the db.
            console.warn("DB Bootstrap: database already contains documents for user " + jwt.sub);
        }

        if (typeof done === "function") {
            done();
        }
    });
};

/**
 * Removes test data from the database and restores the database to the pre-test state.
 * This function is intended to be called after every test case.
 * @param done Callback for when the database restore operation completes.
 */
bootstrap.restore = function bootstrapRestore(done) {
    const jwt = token();

    Project.remove({ user: jwt.sub }, (err, docs) => {
        if (typeof done === "function") {
            done();
        }
    });
};