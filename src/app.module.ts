import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { SentryInterceptor, SentryModule } from "@ntegral/nestjs-sentry";
import { MorganInterceptor, MorganModule } from "nest-morgan";
import { APP_INTERCEPTOR } from "@nestjs/core";
import * as dotenv from "dotenv";
import * as _ from "lodash";
dotenv.config();

import { MailModule } from "./mail/mail.module";
import { AuthzModule } from "./authz/authz.module";
import { defaults, types } from "pg";
import * as dayjs from "dayjs";

// writing timestamps to the db -> interpet the timestamp as utc.
defaults.parseInputDatesAsUTC = true;

// reading timetamps from the db -> interpret the timestamp as utc.
const POSTGRES_TIMESTAMP_COLUMN_TYPE_ID = 1114;
types.setTypeParser(POSTGRES_TIMESTAMP_COLUMN_TYPE_ID, function (stringValue) {
  return dayjs.utc(stringValue).toISOString();
});

const isLocalDB = () =>
  process.env.NODE_ENV !== "production" &&
  !process.env.DATABASE_URL?.includes("amazonaws");

const typeOrmConfig = () => {
  console.log(
    // prettier-ignore
    `Initializing TypeORM against ${isLocalDB() ? 'local' : 'heroku'} database `,
    process.env.DATABASE_URL
  );
  const config: TypeOrmModuleOptions = {
    applicationName: `<Project Name> ${process.env.RELEASE_ENVIRONMENT}`,
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: ["schema", "query", "error"],
    entities: [__dirname + "/**/*.entity{.ts,.js}"],
    migrations: [__dirname + "/migrations/*{.ts,.js}"],
    migrationsRun: true,
    cache: true,
  };
  if (!isLocalDB()) {
    (config as any).ssl = true;
    (config as any).extra = {
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }
  return TypeOrmModule.forRoot(config);
};

@Module({
  imports: [
    // Configuration / Setup
    typeOrmConfig(),
    AuthzModule,
    MorganModule,
    // Top-level features
    MailModule,
    AuthzModule,
    SentryModule.forRoot({
      dsn: "<fill in your sentry dsn>",
      environment:
        process.env.RELEASE_ENVIRONMENT === "production"
          ? "production"
          : "staging",
      logLevels: ["debug"],
      tracesSampleRate: 1.0,
      enabled: !!process.env.RELEASE_ENVIRONMENT,
    }),
  ],
  controllers: [],
  providers: _.compact([
    process.env.RELEASE_ENVIRONMENT !== "production"
      ? {
          provide: APP_INTERCEPTOR,
          useClass: MorganInterceptor("dev"),
        }
      : null,
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new SentryInterceptor(),
    },
  ]),
})
export class AppModule {}
