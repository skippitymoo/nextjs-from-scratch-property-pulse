import type { PropertyType } from "./app-types";

export interface GetPropertiesPayload {
  total: number;
  properties: PropertyType[];
}
