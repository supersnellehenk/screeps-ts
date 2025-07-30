import { ErrorMapper } from "utils/ErrorMapper";
import * as Profiler from "utils/Profiler";
import { CreepManager } from "./CreepManager";
import { ErrorTracker } from "./ErrorTracker";
import { Globals } from "./globals";
import { PerformanceMonitor } from "./PerformanceMonitor";
import './extensions/extensions';

declare global {
  var Profiler: Profiler;
}

global.Profiler = Profiler.init();
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  PerformanceMonitor.start();

  Globals.ResetGlobalAmounts();

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  for (const creep in Game.creeps) {
    runCreep(Game.creeps[creep]);
  }

  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    runRoom(room);
  }
});

function runRoom(room: Room): void {
  PerformanceMonitor.measureModule(`room-${room.name}`, () => {
    ErrorTracker.track(() => {
      // Your room logic here
      room.runSpawns();
      // room.runTowers();
      // etc...
    }, `room-${room.name}`);
  });
}

function runCreep(creep: Creep): void {
  PerformanceMonitor.measureModule(creep.name, () => {
    // ErrorTracker.track(() => {
      // Your creep logic here
      new CreepManager(creep).run();
    // }, creep.name);
  });
}
