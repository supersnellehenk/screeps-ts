import { exists } from "fs";
import { ErrorMapper } from "utils/ErrorMapper";
import * as Profiler from "utils/Profiler";
import { Globals } from "./globals";
import { RoleRegulator } from "./utils/RoleRegulator";

declare global {
  var Profiler: Profiler;
}

global.Profiler = Profiler.init();
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  Globals.ResetGlobalAmounts();

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  for (const creep in Game.creeps) {
    RoleRegulator.Regulate(Game.creeps[creep]);
  }

  for (const spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName];
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
      spawn.spawnCreep([WORK, WORK, CARRY, MOVE], "Harvester" + String(Game.time), {memory: CurrentCreepMemory});
    }
    if (Globals.ControllerAmount < Globals.MaxControllers) {
      CurrentCreepMemory.role = "controller";
      spawn.spawnCreep([WORK, WORK, CARRY, MOVE], "Controller" + String(Game.time), {memory: CurrentCreepMemory});
    }
  }
});
