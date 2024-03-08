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

  session.players = session.players || [];
  if (session.players.length < 5) {
    return Response.json(
      {
        message: "Game cannot be started with less than 5 players",
        status: "playing",
      },
      { status: 400 }
    );
  } else if (player.id === room.createdBy) {
    session.status = "playing";
    let totalPlayers = session.totalPlayers || 1;
    let mafiaCount = 4; //Math.ceil(totalPlayers / 5);
    session.mafias = session.mafias || [];
    for (let i = 0; i < mafiaCount; i++) {
      let random = Math.floor(Math.random() * totalPlayers);
      session.mafias.push(session.players[random]);
    }
    let mafiaList = session.mafias.map((m) => m.id);
    session.mafiaCount = mafiaCount;
    session.villageCount = totalPlayers - mafiaCount;
    session.round = 1;
    session.villagers = session.players.filter(
      (p) => !mafiaList.includes(p.id)
    );
    console.log("session", session);
    let sessionResult = await updateSession(room?.currentSession, session);
    return Response.json(
      {
        message: "Game is started",
        status: "playing",
      },
      { status: 200 }
    );
  }
  return Response.json({
    message: "Your not a host to manage",
    status: "NotHost",
  });
}
