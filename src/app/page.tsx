"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Set the value received from the local storage to a local state - Create a new game
  const [avatarName, setAvatarName] = useState("");

  useEffect(() => {
    // Get the value from local storage if it exists
    const name = localStorage.getItem("avatarName") || "";
    setAvatarName(name);
  }, []);

  // Capture Room Id entered by user - Join a Game
  const [roomId, setRoomId] = useState("");

  // When user submits the form, save the favorite number to the local storage
  const createSession = async (e: any) => {
    e.preventDefault();
    localStorage.setItem("avatarName", avatarName);
    const response: any = await fetch("/api/v1/room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ avatarName }),
    });
    if (response.ok) {
      const room = await response.json();

      localStorage.setItem("avatarId", room.createdBy);
      localStorage.setItem("currentSession", room.currentSession);
      if (room.id) {
        router.push(`game/${room.id}/lobby`);
      } else {
        console.log(response);
      }
    }
  };

  const joinSession = async (e: any) => {
    e.preventDefault();
    localStorage.setItem("avatarName", avatarName);
    const response = await fetch(`/api/v1/room/${roomId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ avatarName, roomId }),
    });
    if (response.ok) {
      router.push(`/game/${roomId}`);
    } else {
      console.log(response);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="min-w-[400px]">
        <CardHeader className="flex gap-3">Create New Mafia Game</CardHeader>
        <Divider />
        <CardBody>
          <div className="grid gap-y-4">
            <Input
              type="text"
              label="Player Name"
              placeholder="Enter your Name"
              value={avatarName}
              onChange={(e) => setAvatarName(e.target.value)}
            />
            <Button
              color="primary"
              isDisabled={!!!avatarName.trim()}
              onClick={async (e) => await createSession(e)}
            >
              Create Room
            </Button>
          </div>
        </CardBody>
        <Divider about="or" />
        <CardBody>
          <div className="grid gap-y-4">
            <Input
              type="text"
              label="Room Code"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="XXX - XXX"
            />
            <Input
              type="text"
              label="Player Name"
              placeholder="Enter your Name"
              value={avatarName}
              onChange={(e) => setAvatarName(e.target.value)}
            />
            <Button
              color="primary"
              isDisabled={!!!avatarName.trim() || !!!roomId.trim()}
              onClick={joinSession}
            >
              Join Room
            </Button>
          </div>
        </CardBody>
        <CardFooter className="flex-col items-center justify-between">
          <p>Enjoy your time with friends</p>
        </CardFooter>
      </Card>
    </main>
  );
}
