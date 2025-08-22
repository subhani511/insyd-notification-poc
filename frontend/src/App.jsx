import React, { useState } from "react";
import ContentForm from "./components/ContentForm";
import Feed from "./components/Feed";
import Notifications from "./components/Notifications";
import FollowersSidebar from "./components/FollowersSidebar";
import styled from "styled-components";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-top: 20px;
`;

const MainContent = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start; /* Align children to top */
`;

const LeftColumn = styled.div`
  flex: 1;
`;

const RightColumn = styled.div`
  width: 250px;
`;

export default function App() {
  const [userId] = useState("68a8ab3888d25fe9ead1beab");
  const [posts, setPosts] = useState([]);

  const handleNewPost = (post) => {
    setPosts((prev) => [post, ...prev]);
  };

  return (
    <Container>
      <Title>Insyd POC</Title>
      <MainContent>
        <LeftColumn>
          <ContentForm authorId={userId} onNewPost={handleNewPost} />
          <Notifications userId={userId} />
          <Feed posts={posts} />
        </LeftColumn>
        <RightColumn>
          <FollowersSidebar userId={userId} />
        </RightColumn>
      </MainContent>
    </Container>
  );
}
