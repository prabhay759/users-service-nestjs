export const config = {
  endPoint: `http://${process.env.SQS_HOST}:${process.env.SQS_PORT}`,
  accessKeyId: "string",
  secretAccessKey: "string",
  region: "string",
};

export const SQS_CLIENT = Symbol("SQS_CLIENT");
export const SQS_MODULE_OPTIONS = Symbol("SQS_MODULE_OPTIONS");
