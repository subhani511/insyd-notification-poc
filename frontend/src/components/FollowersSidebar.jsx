import React, { useState, useEffect } from "react";
import { fetchUsers, followUser } from "../api";
import styled from "styled-components";

const UserCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #ddd;
`;

const SidebarContainer = styled.div`
  background-color: #f0f4f8;  // subtle light gray-blue
  border-radius: 10px;
  padding: 15px;
  width: 250px;

  /* Center vertically within its parent */
  display: flex;
  flex-direction: column;
  justify-content: center;
`;


const Button = styled.button`
  background: ${(props) => (props.following ? "#4caf50" : "#007bff")};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    opacity: 0.9;
  }
`;

export default function FollowersSidebar({ userId }) {
  const [users, setUsers] = useState([]);
  const [followStates, setFollowStates] = useState({}); // Track toggle state locally

  useEffect(() => {
    fetchUsers().then(res => {
      setUsers(res.data);
      // Initialize all buttons to false (Follow)
      const initialStates = {};
      res.data.forEach(u => { initialStates[u._id] = false; });
      setFollowStates(initialStates);
    });
  }, []);

  const handleFollowToggle = async (targetUser) => {
    const isFollowing = followStates[targetUser._id];

    if (!isFollowing) {
      await followUser({ followerId: userId, followingId: targetUser._id });
    }

    // Toggle local follow state
    setFollowStates(prev => ({ ...prev, [targetUser._id]: !isFollowing }));
  };

  return (
    <SidebarContainer>
      <h3>Users</h3>
      {users.map(u => {
        const isFollowing = followStates[u._id] || false;
        return (
          <UserCard key={u._id}>
            <span>{u.name}</span>
            <Button
              following={isFollowing}
              onClick={() => handleFollowToggle(u)}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </UserCard>
        );
      })}
    </SidebarContainer>
  );
}
