import React, { useState } from "react";
import ContentForm from "./components/ContentForm";
import Feed from "./components/Feed";
import Notifications from "./components/Notifications";
import FollowersSidebar from "./components/FollowersSidebar";
import styled from "styled-components";

// ----- Layout Wrappers -----
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #222;
  margin-bottom: 30px;
`;

const MainContent = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
`;

const CenterColumn = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// ----- Reusable card wrapper -----
const Section = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  padding: 15px;
`;

export default function App() {
  const [userId] = useState("68a8ab3888d25fe9ead1beab");
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Add/remove notification helpers
  const addNotification = (notif) => {
    setNotifications((prev) => {
      if (prev.some((n) => n._id === notif._id)) return prev;
      return [notif, ...prev];
    });
  };

  const removeNotification = (notifId) => {
    setNotifications((prev) => prev.filter((n) => n._id !== notifId));
  };

  // New post handler
  const handleNewPost = (post) => {
    setPosts((prev) => [post, ...prev]);

    // Add post notification
    addNotification({
      _id: post._id || `post-${Date.now()}`,
      type: "NEW_POST",
      authorName: "You", // or post.authorName if available
      read: false
    });
  };

  return (
    <Container>
      <Title>Insyd POC</Title>
      <MainContent>
        {/* ---- Center: Post form + Feed ---- */}
        <CenterColumn>
          <Section>
            <ContentForm authorId={userId} onNewPost={handleNewPost} />
          </Section>
          <Section>
            <Feed posts={posts} />
          </Section>
        </CenterColumn>

        {/* ---- Right: Followers + Notifications ---- */}
        <RightColumn>
          <Section>
            <FollowersSidebar
              userId={userId}
              usersNotifications={{ addNotification, removeNotification }}
            />
          </Section>
          <Section>
            <Notifications
              userId={userId}
              notifications={notifications}
            />
          </Section>
        </RightColumn>
      </MainContent>
    </Container>
  );
}
