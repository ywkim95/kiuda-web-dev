import {Device} from "./Device.model";

export interface Gateway {
  id: number,
  countryId: string,
  areaId: string,
  gatewayId: string,
  location: string | null,
  name: string | null,
  description: string | null,
  frequency: number,
  txPower: number,
  rfConfig: number,
  resetYn: boolean,
  useYn: boolean,
  devices: Device[] | null,
}