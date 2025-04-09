// adapter/handler/router.ts
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { eventRouter } from "./event/routes";
import { AppType } from "../../type";
import { EventInteractor } from "../../useCase/interactor/event";
import { EventRepository } from "../database/repository/event";

const app = new OpenAPIHono<AppType>();

app.use("*", async (c, next) => {
  c.set("deps", {
    eventUseCase: new EventInteractor(new EventRepository()),
  });
  await next();
});

app.get("/", (c) => c.text("Hello Hono!"));

app.route("/event", eventRouter);

app.get("/ui", swaggerUI({ url: "/doc" }));

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    title: "My API",
    version: "1.0.0",
  },
});

export { app };
