import { CreepRole } from "../CreepRole";
import { CreepState } from "../CreepState";
import { Traveler } from "../utils/traveller/traveller";

declare global {
  interface Creep {
    state: CreepState;
    role: CreepRole;

    updateMemory(): void;

    travel(destination: RoomPosition, options?: TravelToOptions): any;

    getEnergy(): void;
  }
}

Object.defineProperty(Creep.prototype, "state", {
  get: function (): CreepState {
    return this.memory.state;
  },
  set: function (state: CreepState): void {
    this.memory.state = state;
  }
});

Object.defineProperty(Creep.prototype, "role", {
  get: function (): CreepRole {
    return this.memory.role;
  },
  set: function (role: CreepRole): void {
    this.memory.role = role;
  }
});

Creep.prototype.updateMemory = function (): void {
  if (!this.memory.version || this.memory.version < 3) {
    this.memory.version = 3;
    this.memory.moveTarget = { range: 1, target: null };
    this.state = CreepState.Idle;
  }
};

Creep.prototype.travel = function (destination: RoomPosition, options?: TravelToOptions): any {
  this.memory.moveTarget.range = 1;
  this.memory.moveTarget.target = {
    roomName: destination.roomName,
    y: destination.y,
    x: destination.x
  };
  this.state = CreepState.Traveling;

  return Traveler.travelTo(this, destination, options);
};

Creep.prototype.getEnergy = function (): void {
  const containers = this.room
    .find(FIND_STRUCTURES, {
      filter: { structureType: STRUCTURE_CONTAINER }
    })
    .filter((structure: Structure) => {
      return (structure as StructureContainer).store.getUsedCapacity(RESOURCE_ENERGY) > 0;
    });

  if (containers.length > 0) {
    const container = (containers[0] as StructureContainer);
    const withdrawCode = this.withdraw(container, RESOURCE_ENERGY);
    if (withdrawCode === ERR_NOT_IN_RANGE) {
      this.travel(container.pos);
      return;
    } else {
      this.state = CreepState.Idle;
    }
  }
};

export {};
