import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { iconConvert } from "./iconConvert";
import moment from "moment";
import { useRoomIdStore } from "../../../../Common/Store/roomIdStore";
import { Notifications } from "../../Model/Notifications.model";
import removeBaseUrl from "../../../../Common/Function/removeBaseUrl";

const Notification: React.FC = () => {
  const roomId = useRoomIdStore((state) => state.roomId);
  const [notificationList, setNotificationList] = useState<Notifications[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();
  const [expandedId, setexpandedId] = useState<number | null>(null);

  const fetchNotificationList = async (url?: string) => {
    try {
      const response = await axios.get(url ?? `/notifications/${roomId}`, {
        params: !url
          ? {
              where__deleteFlag: "false",
              order__createdAt: "DESC",
            }
          : {},
      });
      if (!url) {
        setNotificationList(response.data.data);
      } else {
        setNotificationList((prevState) => [
          ...prevState,
          ...response.data.data,
        ]);
      }
      const next = removeBaseUrl(response.data.next);
      setNextUrl(next);
    } catch (error) {
      console.error(error);
    }
  };

  const onNotificationBtnClick = () => {
    navigate("/setting");
  };

  const lastNotificationCallback = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && nextUrl) {
          fetchNotificationList(nextUrl);
        }
      });
      if (node) observer.current.observe(node);
    },
    [nextUrl]
  );

  useEffect(() => {
    fetchNotificationList();
  }, [roomId]);

  const onClickNotification = (id: number) => {
    setexpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="notification">
      <div className="notification__header">
        <div className="notification__title">알림내역</div>
        <button
          className="notification__button"
          onClick={onNotificationBtnClick}
        >
          <img
            src="/assets/icon/monitoring/ic_settings.png"
            alt="환경설정"
            className="notification__button-image"
          />
          환경 설정
        </button>
      </div>
      <div className="notification__info">
        <table className="notification__table">
          <thead></thead>
          <tbody>
            {notificationList.map((value, index) => {
              const isLastNotification = notificationList.length === index + 1;
              return (
                <>
                  <tr
                    ref={isLastNotification ? lastNotificationCallback : null}
                    className="notification__table__item"
                    onClick={() => onClickNotification(value.id)}
                  >
                    <td className="notification__table__phase">
                      <img
                        src={`/assets/icon/monitoring/ic_notification_${iconConvert(
                          value.notiType
                        )}`}
                        alt={value.notiType}
                        className="notification__table__image"
                      />
                      {value.title}
                    </td>
                    <td className="notification__table__date">
                      {moment(value.createdAt).format("YYYY-MM-DD")}
                    </td>
                  </tr>
                  {expandedId === value.id && (
                    <tr className="notification__table__item__detail">
                      <td
                        colSpan={2}
                        className="notification__table__item__detail__content"
                      >
                        {value.message}
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Notification;
