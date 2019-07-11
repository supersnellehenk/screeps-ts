import { exists } from "fs";
import { ErrorMapper } from "utils/ErrorMapper";
import * as Profiler from "utils/Profiler";
import { Traveler } from "./utils/traveller/traveller";

import { Controller } from "./roles/role.controller";
import { Harvester } from "./roles/role.harvester";
import { Hauler } from "./roles/role.hauler";
import { Maintainer } from "./roles/role.maintainer";

global.Profiler = Profiler.init();
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);
  const CurrentRoom: Room = Game.rooms.E6N2;
  const CurrentSpawn: StructureSpawn = Game.spawns.HenkIsHier;
  const CurrentCreepMemory: CreepMemory = {
    _trav: null,
    _travel: null,
    isFull: false,
    role: "harvester",
    room: CurrentRoom.name,
    working: false
  };
  const MaxHarvesters: number = 3;
  const MaxControllers: number = 1;

  let HarvesterAmount: number = 0;
  let HaulerAmount: number = 0;
  let MaintainerAmount: number = 0;
  let ControllerAmount: number = 0;

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  for (const creep in Game.creeps) {
    const CurrentCreep = Game.creeps[creep];
    const role = CurrentCreep.memory.role;

    switch (role) {
      case "harvester":
        HarvesterAmount++;
        Harvester.Work(CurrentCreep, CurrentSpawn, CurrentRoom);
        break;
      case "hauler":
        HaulerAmount++;
        Hauler.Work(CurrentCreep, CurrentSpawn, CurrentRoom);
        break;
      case "maintainer":
        MaintainerAmount++;
        Maintainer.Work(CurrentCreep, CurrentSpawn, CurrentRoom);
        break;
      case "controller":
        ControllerAmount++;
        Controller.Work(CurrentCreep, CurrentSpawn, CurrentRoom);
    }
  }

  for (const spawn in Game.spawns) {
    if (HarvesterAmount < MaxHarvesters) {
      CurrentCreepMemory.role = "harvester";
      CurrentSpawn.createCreep([WORK, WORK, CARRY, MOVE], "Harvester" + String(Game.time), CurrentCreepMemory);
    }
    // if (ControllerAmount < MaxControllers) {
    //   CurrentCreepMemory.role = "controller";
    //   CurrentSpawn.createCreep([WORK, WORK, CARRY, MOVE], "Controller" + String(Game.time), CurrentCreepMemory);
    // }
  }
});
