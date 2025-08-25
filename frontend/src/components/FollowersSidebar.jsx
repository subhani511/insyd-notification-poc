import React, { useState, useEffect } from "react";
import { fetchUsers, followUser } from "../api";
import styled from "styled-components";

const SidebarContainer = styled.div`
  background-color: #f9fbfd;
  border-radius: 12px;
  padding: 20px;
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const UserCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 8px;
  width: 100%;
  margin-bottom: 10px;

  &:hover {
    background-color: #f1f5f9;
  }
`;

const UserName = styled.span`
  flex: 1;
  font-weight: 500;
  font-size: 14px;
  color: #333;
  margin-right: 12px;
`;

const Button = styled.button`
  background: ${(props) => (props.$following ? "#4caf50" : "#007bff")};
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

  &:hover {
    background: ${(props) => (props.$following ? "#43a047" : "#0056b3")};
    transform: scale(1.05);
  }
`;

export default function FollowersSidebar({ userId, usersNotifications }) {
  const [users, setUsers] = useState([]);
  const [followStates, setFollowStates] = useState({});

  const { addNotification, removeNotification } = usersNotifications || {};

  useEffect(() => {
    fetchUsers()
      .then((usersData) => {
        if (Array.isArray(usersData)) {
          setUsers(usersData);

          const initialStates = {};
          usersData.forEach((u) => {
            initialStates[u._id] = false; // default: not following
          });
          setFollowStates(initialStates);
        } else {
          setUsers([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      });
  }, []);

  const handleFollowToggle = async (targetUser) => {
    const isFollowing = followStates[targetUser._id];

    try {
      await followUser({
        followerId: userId,
        followingId: targetUser._id,
      });

      if (!isFollowing && addNotification) {
        addNotification({
          _id: `${userId}-${targetUser._id}-follow`,
          type: "NEW_FOLLOW",
          authorName: users.find((u) => u._id.toString() === userId)?.name || "Someone",
          read: false,
        });
      } else if (isFollowing && removeNotification) {
        removeNotification(`${userId}-${targetUser._id}-follow`);
      }

      setFollowStates((prev) => ({
        ...prev,
        [targetUser._id]: !isFollowing,
      }));
    } catch (err) {
      console.error("Follow toggle failed:", err);
    }
  };

  return (
    <SidebarContainer>
      <h3>Users</h3>
      {users.length === 0 && (
        <p style={{ color: "#777", textAlign: "center" }}>No users found</p>
      )}
      {users.map((u) => {
        const isFollowing = followStates[u._id] || false;
        return (
          <UserCard key={u._id}>
            <UserName>{u.name || "Unnamed User"}</UserName>
            <Button
              $following={isFollowing}
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
