import { GameStats } from "../GameStats";
import { Globals } from "../globals";

declare global {
  interface Room {
    runSpawns(): void;
  }
}

Room.prototype.runSpawns = function (): void {
  const spawns = this.find(FIND_MY_SPAWNS);
  for (const spawn of spawns) {
    const CurrentCreepMemory: CreepMemory = {
      _trav: null,
      _travel: null,
      isFull: false,
      role: "harvester",
      room: spawn.room.name,
      working: false
    };

    if (Globals.HarvesterAmount < Globals.MaxHarvesters) {
      CurrentCreepMemory.role = "harvester";
      spawn.spawnCreep([WORK, WORK, CARRY, MOVE], "Harvester" + String(Game.time), { memory: CurrentCreepMemory });
    } else if (Globals.ControllerAmount < Globals.MaxControllers) {
      CurrentCreepMemory.role = "controller";
      spawn.spawnCreep([WORK, WORK, CARRY, MOVE], "Controller" + String(Game.time), { memory: CurrentCreepMemory });
    }

    console.log(
      `Current game tick is ${Game.time} - HAR: ${Globals.HarvesterAmount} HAU: ${Globals.HaulerAmount} MNT: ${Globals.MaintainerAmount} CTL: ${Globals.ControllerAmount}`
    );

    if (Game.time % 10 === 0) {
      GameStats.log();

      // Log individual room stats
      for (const room of Object.values(Game.rooms)) {
        if (room.controller?.my) {
          GameStats.logRoomStats(room);
        }
      }
    }
  }
};

export {};
