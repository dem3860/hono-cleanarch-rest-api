// adapter/repository/event.ts
import { ResultAsync, fromPromise } from "neverthrow";
import { PrismaClient } from "@prisma/client";
import { DBError } from "../../../domain/entity/error.js";
import { IEventRepository } from "../../../useCase/outputPort/event.js";
import { Event } from "../../../domain/entity/event.js";

const prisma = new PrismaClient();

export class EventRepository implements IEventRepository {
  create(input: Event): ResultAsync<Event, DBError> {
    return fromPromise(
      prisma.event.create({
        data: {
          name: input.name,
          description: input.description,
          startDate: input.startDate,
          endDate: input.endDate,
          location: input.location,
        },
      }),
      (e) => new DBError("Failed to create event")
    ).andThen((result) => {
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

  findById(id: string): ResultAsync<Event, DBError> {
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
}
