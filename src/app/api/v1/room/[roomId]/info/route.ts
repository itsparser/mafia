import { getOrCreatePlayer } from "@/service/player";
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
  //   let input = await request.json();
  //   console.log("join sesion request", input);
  //   let player = await getOrCreatePlayer(
  //     input["avatarName"],
  //     input?.["avatarId"]
  //   );
  console.log("room_id", room_id);
  let room = await get(room_id);
  console.log("room", room);
  let session: Partial<Session> = await getSession(room?.currentSession);
  console.log("session", session);
  session.mafias = [];
  session.villagers = [];
  return Response.json(session, { status: 200 });
}
