import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
`;

const NotificationCard = styled.div`
  background: ${(props) =>
    props.type === "NEW_FOLLOW" ? "#E0F7FA" :
    props.type === "NEW_POST" ? "#E8F5E9" : "#E8F5E9"};
  border-left: 5px solid ${(props) =>
    props.type === "NEW_FOLLOW" ? "#00BCD4" :
    props.type === "NEW_POST" ? "#4CAF50" : "#4CAF50"};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const Badge = styled.span`
  background-color: ${(props) =>
    props.type === "NEW_FOLLOW" ? "#00BCD4" :
    props.type === "NEW_POST" ? "#4CAF50" : "#4CAF50"};
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 6px;
  margin-right: 10px;
`;

export default function Notifications({ notifications }) {
  return (
    <Container>
      <h2>Notifications</h2>
      {notifications.length === 0 && (
        <p style={{ color: "#777", textAlign: "center" }}>No notifications yet</p>
      )}
      {notifications.map((notif) => (
        <NotificationCard key={notif._id} type={notif.type}>
          <Badge type={notif.type}>{notif.type}</Badge>
          {notif.type === "NEW_FOLLOW"
            ? `${notif.actorId?.name || notif.authorName || "Someone"} started following you`
            : notif.type === "NEW_POST"
            ? `${notif.actorId?.name || notif.authorName || "Someone"} posted new content`
            : "New notification"}
        </NotificationCard>
      ))}
    </Container>
  );
}
