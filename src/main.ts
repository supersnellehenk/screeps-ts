import { exists } from "fs";
import { ErrorMapper } from "utils/ErrorMapper";
import * as Profiler from "utils/Profiler";
import { Globals } from "./globals";
import { RoleRegulator } from "./utils/RoleRegulator";
import { Traveler } from "./utils/traveller/traveller";

global.Profiler = Profiler.init();
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);
  const CurrentCreepMemory: CreepMemory = {
    _trav: null,
    _travel: null,
    isFull: false,
    role: "harvester",
    room: Globals.CurrentRoom.name,
    working: false
  };

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  for (const creep in Game.creeps) {
    RoleRegulator.Regulate(Game.creeps[creep]);
  }

  for (const spawn in Game.spawns) {
    if (Globals.HarvesterAmount < Globals.MaxHarvesters) {
      CurrentCreepMemory.role = "harvester";
      Globals.CurrentSpawn.createCreep([WORK, WORK, CARRY, MOVE], "Harvester" + String(Game.time), CurrentCreepMemory);
    }
    if (Globals.ControllerAmount < Globals.MaxControllers) {
      CurrentCreepMemory.role = "controller";
      Globals.CurrentSpawn.createCreep([WORK, WORK, CARRY, MOVE], "Controller" + String(Game.time), CurrentCreepMemory);
    }
  }
});
