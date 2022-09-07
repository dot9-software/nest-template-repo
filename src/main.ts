import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as dotenv from "dotenv";
import { AppModule } from "./app.module";
import { JwtAuthGuard } from "./authz/jwt-auth.guard";
import { HttpExceptionFilter } from "./http-exception.filter";
import { setupSwagger } from "./utils";

dotenv.config();

const envVars = ["DATABASE_URL"];

for (const e of envVars) {
  if (!process.env[e]) {
    console.error(`Please specify the ${e} environment variable`);
    process.exit();
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  const authGuard = app.get(JwtAuthGuard);

  setupSwagger(app);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ enableDebugMessages: true }));
  app.useGlobalGuards(authGuard);
  app.enableCors();

  const port = process.env.PORT || 7000;
  console.log("Port: ", port);

  await app.listen(port);
}
bootstrap();
