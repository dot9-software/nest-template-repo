import * as fs from "fs";
import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("<project name> API")
    .setDescription("API documentation for the backend of <project name>")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter your JWT token",
        in: "header",
      },
      "JWT-AUTH"
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
}

// If condition is true, returns an array, otherwise [].
// See transportschule-backend/pull/142 for context.
export function conditionallyReturnArray<T>(
  condition: any,
  toReturn: T[]
): T[] | [] {
  if (!!condition) {
    return toReturn;
  }
  return [];
}

/**
 * If the condition is true, returns the `toReturn` value, else returns
 * an empty object. This means this can be spread safely regardless.
 * @param condition the condition (ideally boolean) as to when
 * to return the object
 * @param toReturn the object that will be returned if `condition` is true
 * @returns `toReturn` or `{}` (Record<string, never> is TS Speech for `{}`)
 */
export function conditionallyReturnObject<T>(
  condition: any,
  toReturn: T
): T | Record<string, never> {
  if (!!condition) return toReturn;
  return {};
}
