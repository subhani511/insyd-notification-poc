import React from "react";
import styled from "styled-components";

const FeedContainer = styled.div`
  margin-top: 30px;
`;

const PostCard = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const Author = styled.p`
  font-weight: bold;
  color: #007bff;
  margin-bottom: 8px;
`;

const Text = styled.p`
  font-size: 16px;
  margin-bottom: 8px;
`;

const DateText = styled.small`
  color: #555;
`;

export default function Feed({ posts = [] }) {
  return (
    <FeedContainer>
      {posts.length === 0 && <p style={{ textAlign: "center", color: "#777" }}>No posts yet</p>}
      {posts.map((post) => (
        <PostCard key={post._id}>
          <Author>{post.author?.name || post.author}</Author>
          <Text>{post.text}</Text>
          <DateText>{new Date(post.createdAt).toLocaleString()}</DateText>
        </PostCard>
      ))}
    </FeedContainer>
  );
}
