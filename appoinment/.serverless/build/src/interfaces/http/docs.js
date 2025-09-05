"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/Interfaces/Http/docs.ts
var docs_exports = {};
__export(docs_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(docs_exports);

// src/docs/openapi.json
var openapi_default = {
  openapi: "3.0.3",
  info: {
    title: "Rimac Appointments API",
    version: "1.0.0"
  },
  paths: {
    "/appointments": {
      post: {
        summary: "Crea una cita",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "insuredId",
                  "scheduleId",
                  "countryISO"
                ],
                properties: {
                  insuredId: {
                    type: "string",
                    pattern: "^[0-9]{5}$"
                  },
                  scheduleId: {
                    type: "integer"
                  },
                  countryISO: {
                    type: "string",
                    enum: [
                      "PE",
                      "CL"
                    ]
                  }
                }
              },
              examples: {
                ok: {
                  value: {
                    insuredId: "01234",
                    scheduleId: 100,
                    countryISO: "PE"
                  }
                }
              }
            }
          }
        },
        responses: {
          "202": {
            description: "Aceptado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string"
                    },
                    appointmentId: {
                      type: "string",
                      format: "uuid"
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Bad Request"
          }
        }
      }
    },
    "/appointments/{insuredId}": {
      get: {
        summary: "Lista citas por asegurado",
        parameters: [
          {
            in: "path",
            name: "insuredId",
            required: true,
            schema: {
              type: "string",
              pattern: "^[0-9]{5}$"
            }
          }
        ],
        responses: {
          "200": {
            description: "Listado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          appointmentId: {
                            type: "string"
                          },
                          insuredId: {
                            type: "string"
                          },
                          scheduleId: {
                            type: "integer"
                          },
                          countryISO: {
                            type: "string"
                          },
                          status: {
                            type: "string",
                            enum: [
                              "pending",
                              "completed"
                            ]
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time"
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  servers: [
    {
      url: "https://yj6hb7xlw1.execute-api.us-east-1.amazonaws.com",
      description: "AWS HTTP API"
    },
    {
      url: "http://localhost:3000",
      description: "Local (serverless offline)"
    }
  ]
};

// src/Interfaces/Http/docs.ts
var handler = async () => ({
  statusCode: 200,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(openapi_default)
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=docs.js.map
