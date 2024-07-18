"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestDurationMiddleware = exports.activeUserMiddleware = exports.metricsMiddleware = void 0;
const requestCount_1 = require("./requestCount");
const metricsMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on("finish", function () {
        const endTime = Date.now();
        console.log("Time taken: ", endTime - start);
        requestCount_1.requestCount.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode,
        });
    });
    next();
};
exports.metricsMiddleware = metricsMiddleware;
// gauge is used to measure the value of a metric at a
//  particular point in time goes up and down
// metrics are used to measure the value of a metric over time goes up
const activeUserMiddleware = (req, res, next) => {
    requestCount_1.activeUserGauge.inc({
        method: req.method,
        route: req.route ? req.route.path : req.path,
    });
    res.on("finish", () => {
        setTimeout(() => {
            requestCount_1.activeUserGauge.dec({
                method: req.method,
                route: req.route ? req.route.path : req.path,
            });
        }, 5000);
    });
    next();
};
exports.activeUserMiddleware = activeUserMiddleware;
const requestDurationMiddleware = (req, res, next) => {
    const startTime = Date.now();
    requestCount_1.activeUserGauge.inc();
    res.on("finish", () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        requestCount_1.httpRequestDurationMicroseconds.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode,
        }, duration);
        requestCount_1.activeUserGauge.dec();
    });
    next();
};
exports.requestDurationMiddleware = requestDurationMiddleware;
