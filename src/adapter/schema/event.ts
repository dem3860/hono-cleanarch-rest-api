import { z } from "zod";
import { Event } from "../../domain/entity/event.js";

export const EventId = z.object({
  eventId: z.string(),
});

export type EventId = z.infer<typeof EventId>;

export const EventCreateRequest = z.object({
  name: z.string(),
  description: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  location: z.string(),
});
export type EventCreateRequest = z.infer<typeof EventCreateRequest>;

export const EventUpdateRequest = EventCreateRequest;

export type EventUpdateRequest = z.infer<typeof EventUpdateRequest>;

export const EventResponse = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  location: z.string(),
});
export type EventResponse = z.infer<typeof EventResponse>;

export const toEventCreateResponse = (event: Event): EventResponse => ({
  id: event.id,
  name: event.name,
  description: event.description,
  startDate: event.startDate.toISOString(),
  endDate: event.endDate.toISOString(),
  location: event.location,
});
