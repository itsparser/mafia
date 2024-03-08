import { getOrCreatePlayer } from "@/service/player";
import { Room, create, createSession } from "@/service/room";

export const dynamic = "force-dynamic"; // defaults to auto
export async function POST(request: Request) {
  let input = await request.json();
  console.log("new sesion request", input);
  let player = await getOrCreatePlayer(
    input["avatarName"],
    input?.["avatarId"]
  );
  console.log("player", player);
  let data: any = {
    id: "111232",
    roundDuration: input?.["roundDuration"] || 1,
    playerCount: input?.["playerCount"] || 5,
    createdBy: player?.id,
  };
  let session = {
    room_id: data.id,
    status: "waiting",
    mafias: [],
    villagers: [],
    totalPlayers: 1,
    round: 0,
    createdBy: player?.id,
    createdAt: new Date(),
    mafiaCount: 0,
    villageCount: 0,
    winner: "",
    players: [
      {
        id: player.id,
        name: player.name,
        isAlive: true,
      },
    ],
  };
  let sessionResult = await createSession(session);
  console.log("sessionResult", sessionResult.id);
  data["currentSession"] = sessionResult.id;
  let result = await create(data);
  return Response.json(data);
}
