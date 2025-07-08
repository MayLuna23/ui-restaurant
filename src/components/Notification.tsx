import { notification } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

interface NotifyProps {
  type?: NotificationType;
  message: string;
  description?: string;
  placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  duration?: number; // en segundos
}

export const CustomNotification = ({
  type = "info",
  message,
  description = "",
  placement = "bottomRight",
  duration = 3,
}: NotifyProps) => {
  notification[type]({
    message,
    description,
    placement,
    duration,
  });
};
