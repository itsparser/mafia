"use client";
import React, { useState } from "react";
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

const CONFIG_META = { DURATION: "duration", PLAYER_COUNT: "player_count" };

// util to replace the last part of a URL
function replaceLastPart(url: string, newPart: string) {
  let parts = url.split("/");
  parts[parts.length - 1] = newPart;
  return parts.join("/");
}

export default function Lobby({ params }: { params: { session: string } }) {
  const router = useRouter();

  // Store game config
  const [config, setConfig] = useState({
    [CONFIG_META.DURATION]: "2",
    [CONFIG_META.PLAYER_COUNT]: "5",
  });

  async function startGame() {
    const response = await fetch(`/api/v1/room/${params.session}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatarName: localStorage.getItem("avatarName"),
        avatarId: localStorage.getItem("avatarId"),
      }),
    });
    if (response.ok) {
      router.push(`/game/${params.session}`);
    } else {
      console.log(response);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="min-w-[400px]">
        <CardHeader className="flex gap-3">Mafia Game - Lobby</CardHeader>
        <Divider />
        <CardBody>
          <div className="grid gap-y-4">
            <Input
              type="text"
              label="Room ID"
              disabled
              value={params.session}
            />
            <Input
              type="number"
              label="Number of players"
              value={config[CONFIG_META.PLAYER_COUNT]}
              onChange={(event) => {
                setConfig({
                  ...config,
                  [CONFIG_META.PLAYER_COUNT]: event.target.value,
                });
              }}
            />
            <Input
              type="number"
              label="Time per round (in minutes)"
              value={config[CONFIG_META.DURATION]}
              onChange={(event) => {
                setConfig({
                  ...config,
                  [CONFIG_META.DURATION]: event.target.value,
                });
              }}
            />
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="flex-row items-center justify-between">
          <Button
            onClick={() =>
              navigator.clipboard.writeText(
                replaceLastPart(window.location.toString(), "join")
              )
            }
          >
            Copy Link
          </Button>
          <Button color="primary" onClick={startGame}>
            Start Game
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
