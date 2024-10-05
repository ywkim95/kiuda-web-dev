import {NotificationTypeEnum} from "../Const/NotificationType.enum";

export interface Notifications {
  id: number;
  message: string;
  notiType: NotificationTypeEnum;
  title: string;
  deleteFlag: boolean;
  createdAt: string;
}