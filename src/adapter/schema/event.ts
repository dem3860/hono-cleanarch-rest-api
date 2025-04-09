import { z } from "zod";
import { Event } from "../../domain/entity/event";

export const EventCreateRequest = z.object({
  name: z.string(),
  description: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  location: z.string(),
});
export type EventCreateRequest = z.infer<typeof EventCreateRequest>;

export const EventCreateResponse = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  location: z.string(),
});
export type EventCreateResponse = z.infer<typeof EventCreateResponse>;

export const toEventCreateResponse = (event: Event): EventCreateResponse => ({
  id: event.id,
  name: event.name,
  description: event.description,
  startDate: event.startDate.toISOString(),
  endDate: event.endDate.toISOString(),
  location: event.location,
});
