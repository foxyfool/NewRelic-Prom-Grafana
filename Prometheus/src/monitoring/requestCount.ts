import client from "prom-client";

export const requestCount = new client.Counter({
  name: "request_count",
  help: "Number of requests made",
  labelNames: ["method", "route", "status_code"],
});

export const activeUserGauge = new client.Gauge({
  name: "active_users",
  help: "Total number of users whose request has not been completed",
  labelNames: ["method", "route"],
});

export const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in milliseconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 5, 15, 50, 100, 500],
});
