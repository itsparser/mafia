import { getOrCreatePlayer } from "@/service/player";
import {
  Session,
  createSession,
  get,
  getSession,
  updateSession,
} from "@/service/room";
import { vote } from "@/service/vote";
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
  await vote(`session-${room?.currentSession}/${session.round}/1`);
  return Response.json(
    {
      message: "Vote is done",
      status: "voted",
    },
    { status: 200 }
  );
}
