"use client";
import React, { use, useEffect, useState } from "react";
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
import { UserMinusIcon } from "@heroicons/react/24/outline";

const SAMPLE_DATA = [
  "Player 1",
  "Player 2",
  "Player 3",
  "Player 4",
  "Player 5",
];

const ROLES = { DOCTOR: "doctor", VILLAGER: "villager", MAFIA: "mafia" };

const MY_ROLE = ROLES.DOCTOR;

function vote() {
  //
}

export default function Game({ params }: { params: { session: string } }) {
  const router = useRouter();
  const [players, setPlayers] = useState([]);
  const [room, setRoomInfo] = useState({} as any);
  const [isModerator, setIsModerator] = useState(false);
  const [role, setRole] = useState("");
  const [style, setStyle] = useState({});

  useEffect(() => {
    roomInfo();
  }, []);

  function validateRole(room: any) {
    if ((room.mafias || []).length > 0) {
      setRole("MAFIA");
      setStyle({
        backgroundImage: "url(/mafia.jpg)",
        opacity: 0.6,
      });
    } else if ((room.doctor || []).lenght > 0) {
      setRole("DOCTOR");
    } else {
      setRole("Villagers");
      setStyle({
        backgroundImage: "url(/villagers.avif)",
        opacity: 0.6,
      });
    }
  }

  async function roomInfo() {
    const response = await fetch(`/api/v1/room/${params.session}/info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        avatarId: localStorage.getItem("avatarId") || "",
      },
    });
    if (response.ok) {
      let roomInfo = await response.json();
      if (roomInfo.createdBy === localStorage.getItem("avatarId")) {
        setIsModerator(true);
      }
      let mafias = (roomInfo.mafias || []).map((p: any) => p.id);
      roomInfo.players = roomInfo.players
        .map((p: any) => {
          if (mafias.includes(p.id)) {
            p.role = "mafia";
            return;
          }
          return p;
        })
        .filter((p: any) => p);
      setRoomInfo(roomInfo);
      validateRole(roomInfo);
      setPlayers(roomInfo.players);
    } else {
      console.log(response);
    }
  }

  return (
    <main
      className="flex flex-col justify-evenly items-center h-screen bg-fixed bg-center bg-cover bg-no-repeat"
      style={style}
    >
      <Card>
        <CardBody>
          <p>You are a {role}</p>
        </CardBody>
      </Card>
      <div className="flex flex-row gap-5">
        <Card className="min-w-[800px]">
          <CardHeader className=" w-full text-center">
            Voting process
          </CardHeader>
          <Divider />
          {(room?.mafias || []).length > 0 ? (
            <>
              <CardHeader className="flex gap-3">
                Your Partner in crime
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="grid gap-y-4">
                  {(room?.mafias || [])
                    .filter(
                      (data: any) =>
                        data.id !== localStorage.getItem("avatarId")
                    )
                    .map((data: any) => (
                      <Button onClick={vote} key={data.id}>
                        {data.name}{" "}
                        {data.isAlive ? (
                          <UserMinusIcon className="h-5 w-5" />
                        ) : (
                          ""
                        )}
                      </Button>
                    ))}
                </div>
              </CardBody>
              <Divider />
            </>
          ) : (
            ""
          )}
          <CardHeader className="flex gap-3">Villagers</CardHeader>
          <Divider />
          <CardBody>
            <div className="grid gap-y-4">
              {(room?.players || [])
                .filter((data: any) => data?.role !== "mafia")
                .map((data: any) => (
                  <Button onClick={vote} key={data?.id}>
                    {data?.name}{" "}
                    {data?.isAlive ? <UserMinusIcon className="h-5 w-5" /> : ""}
                  </Button>
                ))}
            </div>
          </CardBody>
        </Card>
        {/* {MY_ROLE === ROLES.DOCTOR && (
          <Card className="min-w-[400px]">
            <CardHeader className="flex gap-3">
              Whom do you want to save?
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="grid gap-y-4">
                {SAMPLE_DATA.map((data) => (
                  <Button onClick={vote} key={data}>
                    {data}
                  </Button>
                ))}
              </div>
            </CardBody>
          </Card>
        )} */}
      </div>
    </main>
  );
}
