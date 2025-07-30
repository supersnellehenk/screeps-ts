import { CreepRole } from "../CreepRole";
import { CreepState } from "../CreepState";

declare global {
  interface Creep {
    state: CreepState;
    role: CreepRole;

    updateMemory(): void;
  }
}

Object.defineProperty(Creep.prototype, 'state', {
  get: function(): CreepState {
    return this.memory.state;
  },
  set: function(state: CreepState): void {
    this.memory.state = state;
  }
});

Object.defineProperty(Creep.prototype, 'role', {
  get: function(): CreepRole {
    return this.memory.role;
  },
  set: function(role: CreepRole): void {
    this.memory.role = role;
  }
});

Creep.prototype.updateMemory = function(): void {
  if (!this.memory.version || this.memory.version < 3) {
    this.memory.version = 3;
    this.memory.moveTarget = {range: 1, target: null};
    this.state = CreepState.Idle;
  }
}

export {};
