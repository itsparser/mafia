import { getOrCreatePlayer } from "@/service/player";
import {
  Session,
  createSession,
  get,
  getSession,
  updateSession,
} from "@/service/room";
import { type NextRequest } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  const room_id = params.roomId;
  let input = await request.json();
  console.log("join sesion request", input);
  let player = await getOrCreatePlayer(
    input["avatarName"],
    input?.["avatarId"]
  );
  console.log("player", player, "room_id", room_id);
  let room = await get(room_id);
  console.log("room", room);
  let session: Partial<Session> = await getSession(room?.currentSession);
  console.log("session", session);
  if (session.status === "playing") {
    return Response.json(
      {
        message: "Game is already started, Check with Host",
        status: "playing",
      },
      { status: 400 }
    );
  }
  if ((session.players || []).length < room.playerCount) {
    session.players = session.players || [];
    let players = session.players.filter((p) => p.id === player.id);
    if (players.length > 0) {
      return Response.json(
        {
          message: "Player already joined",
          status: "joined",
        },
        { status: 400 }
      );
    }
    session.players.push({
      id: player.id,
      name: player.name,
      isAlive: true,
    });
    session.totalPlayers = (session.totalPlayers || 0) + 1;
    let sessionResult = await updateSession(room?.currentSession, session);
  } else {
    return Response.json(
      { message: "Room is full, Check with Host", status: "full" },
      { status: 400 }
    );
  }
  return Response.json({ message: "Joined Successfully", status: "joined" });
}
