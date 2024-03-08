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

export default function Join({ params }: { params: { session: string } }) {
  const router = useRouter();

  // Capture Player Name for players entering via Join Link
  const [avatarName, setAvatarName] = useState("");

  const [avatarId, setAvatarId] = useState("");

  useEffect(() => {
    // Get the value from local storage if it exists
    const name = localStorage.getItem("avatarName") || "";
    const id = localStorage.getItem("avatarId") || "";
    setAvatarName(name);
    setAvatarId(id);
  }, []);

  async function joinRoom() {
    const response = await fetch(`/api/v1/room/${params.session}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ avatarName, roomId: params.session }),
    });
    if (response.ok) {
      const room = await response.json();
      localStorage.setItem("avatarId", room.player.id);
      localStorage.setItem("avatarName", room.player.name);
      router.push(`/game/${params.session}/lobby`);
    } else {
      console.log(response);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="min-w-[400px]">
        <CardHeader className="flex gap-3">Join Game</CardHeader>
        <Divider />
        <CardBody>
          <div className="grid gap-y-4">
            <Input
              type="text"
              label="Player Name"
              placeholder="Enter your name"
              value={avatarName}
              required
              onChange={(event) => setAvatarName(event.target.value)}
            />
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="flex-col items-center justify-between">
          <Button
            color="primary"
            onClick={joinRoom}
            isDisabled={!!!avatarName.trim()}
          >
            Join
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
