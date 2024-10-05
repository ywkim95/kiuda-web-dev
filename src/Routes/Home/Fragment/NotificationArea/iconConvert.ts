import {NotificationTypeEnum} from "../../Const/NotificationType.enum";

export const iconConvert = (notiType: NotificationTypeEnum) => {
  switch (notiType) {
    case NotificationTypeEnum.Info:
      return 'green.png';
    case NotificationTypeEnum.Warning:
      return 'yellow.png';
  }
};