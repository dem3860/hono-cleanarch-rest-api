// adapter/handler/event.ts
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import {
  EventCreateRequest,
  EventId,
  EventListRequest,
  EventListResponse,
  EventResponse,
  EventUpdateRequest,
  toEventResponse,
  toEventListResponse,
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
  const event = toEventResponse(result.value);
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
    200: {
      description: "Updated",
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
  const event = toEventResponse(result.value);
  const res = EventResponse.parse(event);
  return c.json(res, 201);
});

const deleteEventRoute = createRoute({
  operationId: "deleteEvent",
  tags: ["event"],
  method: "delete",
  path: "/{eventId}",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    params: EventId,
  },
  responses: {
    204: {
      description: "deleted",
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

eventRouter.openapi(deleteEventRoute, async (c) => {
  const eventId = c.req.param("eventId");

  const uc = c.get("deps").eventUseCase;
  const result = await uc.delete(eventId);
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
  return c.body(null, 204);
});

const listEventRoute = createRoute({
  operationId: "listEvent",
  tags: ["event"],
  method: "get",
  path: "/",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    query: EventListRequest,
  },
  responses: {
    200: {
      description: "Get",
      content: {
        "application/json": {
          schema: EventListResponse,
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

eventRouter.openapi(listEventRoute, async (c) => {
  const input = c.req.valid("query");

  const uc = c.get("deps").eventUseCase;
  const result = await uc.list(input);
  console.log("result", result);
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

  const event = toEventListResponse(result.value);
  const res = EventListResponse.parse(event);
  return c.json(res, 201);
});
