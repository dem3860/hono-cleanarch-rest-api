import { z } from "zod";
import { Event, EventList } from "../../domain/entity/event.js";

export const EventId = z.object({
  eventId: z.string(),
});

export type EventId = z.infer<typeof EventId>;

export const EventCreateRequest = z.object({
  name: z.string().openapi({ example: "Event name" }),
  description: z.string().openapi({ example: "Event description" }),
  startDate: z
    .string()
    .datetime()
    .openapi({ example: "2025-04-01T01:00:00.000Z" }),
  endDate: z
    .string()
    .datetime()
    .openapi({ example: "2025-04-02T01:00:00.000Z" }),
  location: z.string().openapi({ example: "Event location" }),
});

export const EventUpdateRequest = EventCreateRequest;

export const EventResponse = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  location: z.string(),
});
export type EventResponse = z.infer<typeof EventResponse>;

export const EventListRequest = z.object({
  q: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(["startDate", "endDate", "name", "createdAt"]).optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const EventListResponse = z.object({
  events: z.array(EventResponse),
  total: z.number(),
});
export type EventListResponse = z.infer<typeof EventListResponse>;

export const toEventResponse = (event: Event): EventResponse => ({
  id: event.id,
  name: event.name,
  description: event.description,
  startDate: event.startDate.toISOString(),
  endDate: event.endDate.toISOString(),
  location: event.location,
});

export const toEventListResponse = (events: EventList): EventListResponse => ({
  events: events.events.map((event) => {
    console.log("event", event);
    return toEventResponse(event);
  }),
  total: events.total,
});
