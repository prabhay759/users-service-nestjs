import { AdvancedConsoleLogger, ConnectionOptions } from "typeorm";

// Allows migrating straight from the source .ts files when running inside ts-node
const runsTsNode = !!process[Symbol.for("ts-node.register.instance")];

export function databaseConfig(extension?: Partial<ConnectionOptions>): ConnectionOptions {
  const basic = {
    type: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
    username: process.env.POSTGRES_USER_NAME || "docker",
    password: process.env.POSTGRES_PASSWORD || "docker",
    database: process.env.POSTGRES_DATABASE || "postgres",
    extra: { max: process.env.POSTGRES_POOL_MAX_CONNECTIONS },
    entities: ["dist/**/*.entity{.ts,.js}"],
    autoLoadEntities: true,
    synchronize: false,
    logging: true,
    logger: new AdvancedConsoleLogger(["schema", "error", "migration"]),
    migrations: [runsTsNode ? "src/migration/*.ts" : "dist/migration/*.js"],
    cli: {
      migrationsDir: "src/migration",
    },
  } as ConnectionOptions;
  return Object.assign(basic, extension || {});
}
