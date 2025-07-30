import { CreepRole } from "../CreepRole";
import { CreepState } from "../CreepState";
import { GameStats } from "../GameStats";
import { Globals } from "../globals";
import { BodyPartCalculator, CreepType } from "../creep.body-part-calculator";

declare global {
  interface Room {
    runSpawns(): void;
  }
}

Room.prototype.runSpawns = function (): void {
  const spawns = this.find(FIND_MY_SPAWNS);
  for (const spawn of spawns) {
    const CurrentCreepMemory: CreepMemory = {
      _travel: null,
      _trav: null,
      isFull: false,
      role: CreepRole.Harvester,
      working: false,
      state: CreepState.Idle,
      moveTarget: {
        target: null,
        range: 1,
      },
      version: 1
    };

    if (spawn.spawning !== null) {
      continue;
    }

    if (Globals.HarvesterAmount < Globals.MaxHarvesters) {
      CurrentCreepMemory.role = CreepRole.Harvester;
      spawn.spawnCreep(BodyPartCalculator.Calculate(CreepType.Harvester, spawn.store.getCapacity(RESOURCE_ENERGY)), "Harvester" + String(Game.time), { memory: CurrentCreepMemory });
    } else if (Globals.ControllerAmount < Globals.MaxControllers) {
      CurrentCreepMemory.role = CreepRole.Controller;
      spawn.spawnCreep(BodyPartCalculator.Calculate(CreepType.Controller, spawn.store.getCapacity(RESOURCE_ENERGY)), "Controller" + String(Game.time), { memory: CurrentCreepMemory });
    } else if (Globals.MaintainerAmount < Globals.MaxMaintainers) {
      CurrentCreepMemory.role = CreepRole.Maintainer;
      spawn.spawnCreep(BodyPartCalculator.Calculate(CreepType.Maintainer, spawn.store.getCapacity(RESOURCE_ENERGY)), "Maintainer" + String(Game.time), { memory: CurrentCreepMemory });
    }

    console.log(
      `Current game tick is ${Game.time} - HAR: ${Globals.HarvesterAmount} HAU: ${Globals.HaulerAmount} MNT: ${Globals.MaintainerAmount} CTL: ${Globals.ControllerAmount}`
    );
  }

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

export {};
