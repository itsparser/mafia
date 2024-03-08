import { getOrCreatePlayer, getPlayer } from "@/service/player";
import {
  Session,
  createSession,
  get,
  getSession,
  updateSession,
} from "@/service/room";
import { type NextRequest } from "next/server";

// GET /api/v1/room/[roomId]/info :- this will get the room info
export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  const room_id = params.roomId;
  let avatarId = request.headers.get("avatarId") || "";

  let player = await getPlayer(avatarId);
  console.log("player", player, "room_id", room_id);
  let room = await get(room_id);
  console.log("room", room);
  let session: Partial<Session> = await getSession(room?.currentSession);
  let mafiaList = (session.mafias || []).map((m) => m.id);
  console.log("session", session);
  if (session.status === "playing" && !mafiaList.includes(player.id)) {
    session.mafias = [];
  }
  session.villagers = [];
  return Response.json(session, { status: 200 });
}
