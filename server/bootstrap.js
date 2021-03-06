/*
Boostrap code for QOC Server.

In production, the server loads pre-compiled sources in the build/directory.
In development, babel-register is used to load ES6 files on the fly.

This file is invoked by the Node interpreter, and so must be written in ES5.
 */

// Try to set environment variables
require("config");

// Start the server
if (process.env.NODE_ENV === "production") {
    console.log("Running in production");
    try {
        const app = require("./build/app");
        app.default.start();
    }
    catch (e) {
        console.log("Can't find build/app.js!");
        console.log(e);
    }
}
else {
    console.log("Running in development mode");
    require("babel-register");
    const app = require("./src/app");
    app.default.start();
}
