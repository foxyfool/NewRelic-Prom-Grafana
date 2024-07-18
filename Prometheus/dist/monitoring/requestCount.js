"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpRequestDurationMicroseconds = exports.activeUserGauge = exports.requestCount = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
exports.requestCount = new prom_client_1.default.Counter({
    name: "request_count",
    help: "Number of requests made",
    labelNames: ["method", "route", "status_code"],
});
exports.activeUserGauge = new prom_client_1.default.Gauge({
    name: "active_users",
    help: "Total number of users whose request has not been completed",
    labelNames: ["method", "route"],
});
exports.httpRequestDurationMicroseconds = new prom_client_1.default.Histogram({
    name: "http_request_duration_ms",
    help: "Duration of HTTP requests in milliseconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.1, 5, 15, 50, 100, 500],
});
