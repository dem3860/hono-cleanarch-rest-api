// adapter/handler/event.ts
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import {
  EventCreateRequest,
  EventId,
  EventResponse,
  EventUpdateRequest,
  toEventCreateResponse,
} from "../../schema/event.js";
import { AppType } from "../../../type.js";

export const eventRouter = new OpenAPIHono<AppType>();

const createEventRoute = createRoute({
  operationId: "createEvent",
  tags: ["event"],
  method: "post",
  path: "/create",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: EventCreateRequest,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": {
          schema: EventResponse,
        },
      },
    },
    400: {
      description: "Bad Request",
    },
    401: {
      description: "Unauthorized",
    },
    500: {
      description: "Internal Server Error",
    },
  },
});

eventRouter.openapi(createEventRoute, async (c) => {
  const input = c.req.valid("json");

  const uc = c.get("deps").eventUseCase;
  const result = await uc.create(input);
  if (result.isErr()) {
    const error = result.error;
    switch (error.name) {
      case "DBError":
        return c.json({ name: "DB_ERROR", message: "db error" }, 500);
      case "ValidationError":
        return c.json(
          { name: "VALIDATION_ERROR", message: "validation error" },
          400
        );
      default:
        return c.json({ name: "UNKNOWN_ERROR", message: "unknown error" }, 500);
    }
  }
  const event = toEventCreateResponse(result.value);
  const res = EventResponse.parse(event);
  return c.json(res, 201);
});

const updateEventRoute = createRoute({
  operationId: "updateEvent",
  tags: ["event"],
  method: "put",
  path: "/{eventId}",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    params: EventId,
    body: {
      content: {
        "application/json": {
          schema: EventUpdateRequest,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": {
          schema: EventResponse,
        },
      },
    },
    400: {
      description: "Bad Request",
    },
    401: {
      description: "Unauthorized",
    },
    500: {
      description: "Internal Server Error",
    },
  },
});

eventRouter.openapi(updateEventRoute, async (c) => {
  const eventId = c.req.param("eventId");
  const input = c.req.valid("json");

  const uc = c.get("deps").eventUseCase;
  const result = await uc.update(eventId, input);
  if (result.isErr()) {
    const error = result.error;
    switch (error.name) {
      case "DBError":
        return c.json({ name: "DB_ERROR", message: "db error" }, 500);
      case "ValidationError":
        return c.json(
          { name: "VALIDATION_ERROR", message: "validation error" },
          400
        );
      default:
        return c.json({ name: "UNKNOWN_ERROR", message: "unknown error" }, 500);
    }
  }
  const event = toEventCreateResponse(result.value);
  const res = EventResponse.parse(event);
  return c.json(res, 201);
});
