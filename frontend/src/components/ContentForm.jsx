import React, { useState } from "react";
import { postContent } from "../api";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const Input = styled.input`
  width: 60%;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

export default function ContentForm({ authorId, onNewPost }) {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) return;

    try {
      const response = await postContent({
        author: authorId, // ✅ fixed
        text: text,       // ✅ fixed
      });

      if (onNewPost) onNewPost(response.data);
      setText("");
    } catch (err) {
      console.error("❌ Error posting content:", err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write something..."
      />
      <Button type="submit">Post</Button>
    </Form>
  );
}
