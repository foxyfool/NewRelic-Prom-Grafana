import { NextFunction, Request, Response } from "express";
import {
  requestCount,
  activeUserGauge,
  httpRequestDurationMicroseconds,
} from "./requestCount";

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", function () {
    const endTime = Date.now();
    console.log("Time taken: ", endTime - start);

    requestCount.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode,
    });
  });
  next();
};

// gauge is used to measure the value of a metric at a
//  particular point in time goes up and down

// metrics are used to measure the value of a metric over time goes up
export const activeUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  activeUserGauge.inc({
    method: req.method,
    route: req.route ? req.route.path : req.path,
  });

  res.on("finish", () => {
    setTimeout(() => {
      activeUserGauge.dec({
        method: req.method,
        route: req.route ? req.route.path : req.path,
      });
    }, 5000);
  });

  next();
};

export const requestDurationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  activeUserGauge.inc();

  res.on("finish", () => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    httpRequestDurationMicroseconds.observe(
      {
        method: req.method,
        route: req.route ? req.route.path : req.path,
        status_code: res.statusCode,
      },
      duration
    );
    activeUserGauge.dec();
  });
  next();
};
