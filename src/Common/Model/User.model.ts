import {RolesEnum} from "../Const/Roles.enum";
import {PermissionsEnum} from "../Const/Permission.enum";
import {Gateway} from "./Gateway.model";

export interface User {
  id: number,
  email: string,
  name: string,
  address: string,
  phoneNumber: string,
  roles: RolesEnum,
  permission: PermissionsEnum,
  gateways: Gateway[],
}