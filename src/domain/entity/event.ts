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
