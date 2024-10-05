import {Device} from "../../../Common/Model/Device.model";

export interface SensorData {
  id: number,
  s1: number | null,
  s2: number | null,
  s3: number | null,
  s4: number | null,
  s5: number | null,
  s6: number | null,
  s7: number | null,
  s8: number | null,
  s9: number | null,
  s10: number | null,
  s11: number | null,
  s12: number | null,
  s13: number | null,
  s14: number | null,
  s15: number | null,
  s16: number | null,
  s17: number | null,
  s18: number | null,
  s19: number | null,
  s20: number | null,
  rssi: number,
  sqn: number
  device: Device | null,
}