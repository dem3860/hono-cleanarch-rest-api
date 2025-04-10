// adapter/repository/event.ts
import { ResultAsync, fromPromise } from "neverthrow";
import { PrismaClient } from "@prisma/client";
import { DBError } from "../../../domain/entity/error.js";
import { IEventRepository } from "../../../useCase/outputPort/event.js";
import { Event, EventList, EventSearch } from "../../../domain/entity/event.js";

const prisma = new PrismaClient();

export class EventRepository implements IEventRepository {
  create(input: Event): ResultAsync<void, DBError> {
    return fromPromise(
      prisma.event.create({
        data: {
          id: input.id,
          name: input.name,
          description: input.description,
          startDate: input.startDate,
          endDate: input.endDate,
          location: input.location,
        },
      }),
      (e) => new DBError("Failed to create event")
    ).map(() => {
      return;
    });
  }

  update(input: Event): ResultAsync<void, DBError> {
    return fromPromise(
      prisma.event.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          startDate: input.startDate,
          endDate: input.endDate,
          location: input.location,
        },
      }),
      (e) => new DBError("Failed to create event")
    ).map(() => {
      return;
    });
  }

  findById(id: string): ResultAsync<Event, DBError> {
    console.log("findById", id);
    return fromPromise(
      prisma.event.findUnique({ where: { id } }),
      (e) => new DBError("Failed to find event")
    ).andThen((result) => {
      if (!result) {
        return ResultAsync.fromSafePromise(
          Promise.reject(new DBError(`Event not found: ${id}`))
        );
      }
      return ResultAsync.fromPromise(
        Promise.resolve({
          id: result.id,
          name: result.name,
          description: result.description,
          startDate: result.startDate,
          endDate: result.endDate,
          location: result.location,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        }),
        () => new DBError("Mapping error")
      );
    });
  }

  delete(id: string): ResultAsync<void, DBError> {
    return fromPromise(
      prisma.event.delete({ where: { id } }),
      (e) => new DBError("Failed to delete event")
    ).map(() => {
      return;
    });
  }
  list(input: EventSearch): ResultAsync<EventList, DBError> {
    return fromPromise(
      prisma.event.findMany({
        where: {
          name: {
            contains: input.q,
            mode: "insensitive",
          },
          startDate: {
            gte: input.startDate,
            lte: input.endDate,
          },
        },
        orderBy: {
          [input.orderBy || "startDate"]: input.order || "asc",
        },
        skip: (input.page || 0) * (input.limit || 10),
        take: input.limit || 10,
      }),
      (e) => new DBError("Failed to list events")
    ).andThen((events) => {
      return fromPromise(
        prisma.event.count({
          where: {
            name: {
              contains: input.q,
              mode: "insensitive",
            },
            startDate: {
              gte: input.startDate,
              lte: input.endDate,
            },
          },
        }),
        () => new DBError("Failed to count events")
      ).map((total) => {
        return {
          events,
          total,
        };
      });
    });
  }
}
