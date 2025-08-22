import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { io } from "socket.io-client";
import { getNotifications } from "../api";

// Socket connection
const socket = io("http://localhost:5000");

// Container
const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
`;

// Notification card
const NotificationCard = styled.div`
  background: ${(props) =>
    props.type === "NEW_FOLLOW" ? "#E0F7FA" :
    props.type === "DISCOVERY" ? "#FFF3E0" :
    "#E8F5E9"};
  border-left: 5px solid ${(props) =>
    props.type === "NEW_FOLLOW" ? "#00BCD4" :
    props.type === "DISCOVERY" ? "#FF9800" :
    "#4CAF50"};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  font-weight: ${(props) => (!props.read ? "bold" : "normal")};
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

// Badge showing type
const Badge = styled.span`
  background-color: ${(props) =>
    props.type === "NEW_FOLLOW" ? "#00BCD4" :
    props.type === "DISCOVERY" ? "#FF9800" :
    "#4CAF50"};
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 6px;
  margin-right: 10px;
`;

// Toast animation
const ToastAnimation = keyframes`
  0% { transform: translateY(-20px); opacity: 0; }
  10% { transform: translateY(0); opacity: 1; }
  90% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-20px); opacity: 0; }
`;

const Toast = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #007bff;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  animation: ${ToastAnimation} 3s ease forwards;
  z-index: 1000;
`;

export default function Notifications({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!userId) return;

    socket.emit("join", userId);

    // Live notifications
    socket.on("new-notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      const message =
        notif.type === "NEW_FOLLOW"
          ? `${notif.authorName} started following you`
          : notif.type === "DISCOVERY"
          ? `${notif.authorName} posted content you might like`
          : `${notif.authorName} posted new content`;

      setToast(message);
      setTimeout(() => setToast(null), 3000);
    });

    // Fetch initial notifications
    getNotifications(userId)
      .then(res => setNotifications(res.data))
      .catch(err => console.error(err));

    return () => socket.off("new-notification");
  }, [userId]);

  return (
    <Container>
      <h2>Notifications</h2>
      {notifications.length === 0 && (
        <p style={{ color: "#777", textAlign: "center" }}>No notifications yet</p>
      )}
      {notifications.map((notif) => {
        let message;
        if (notif.type === "NEW_FOLLOW") message = `${notif.authorName} started following you`;
        else if (notif.type === "DISCOVERY") message = `${notif.authorName} posted content you might like`;
        else message = `${notif.authorName} posted new content`;

        // Format badge text: "NEW_FOLLOW" -> "New Follow"
        const badgeText = notif.type.split("_").map(word => word[0] + word.slice(1).toLowerCase()).join(" ");

        return (
          <NotificationCard key={notif._id || notif.contentId} type={notif.type} read={notif.read}>
            <Badge type={notif.type}>{badgeText}</Badge>
            {message}
          </NotificationCard>
        );
      })}
      {toast && <Toast>{toast}</Toast>}
    </Container>
  );
}
