// example declaration file - remove these and add your own custom typings

// memory extension samples
import { CreepRole } from "./CreepRole";
import { CreepState } from "./CreepState";

declare global {
  interface CreepMemory {
    role: CreepRole;
    working: boolean;
    isFull: boolean;
    state: CreepState;
    moveTarget: {
      target: {
        x: number;
        y: number;
        roomName: string;
      } | null;
      range: number;
    };
    version: number;

    // Traveller
    _trav: any;
    _travel: any;
  }
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    Profiler: Profiler;
    log: any;
  }
}

export {};
