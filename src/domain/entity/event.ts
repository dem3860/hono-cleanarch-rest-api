import { z } from "zod";

export const Event = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string(),
});

export type Event = z.infer<typeof Event>;

export const EventSearch = z.object({
  q: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(["startDate", "endDate", "name", "createdAt"]).optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});
export type EventSearch = z.infer<typeof EventSearch>;

export const EventList = z.object({
  events: z.array(Event),
  total: z.number(),
});
export type EventList = z.infer<typeof EventList>;
