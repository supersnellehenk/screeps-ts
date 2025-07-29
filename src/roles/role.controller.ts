import { Traveler } from "utils/traveller/traveller";

/**
 * This creep upgrades the room controller
 */
export class Controller {
  public static Work(CurrentCreep: Creep) {
    if (!CurrentCreep.memory.isFull) {
      const Storage = CurrentCreep.room.find(FIND_MY_STRUCTURES, {
        filter: i => {
          return i.structureType === STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] === 2000;
        }
      });
      // console.log(Storage);
    } else {
      if (CurrentCreep.carry.energy !== 0) {
        if (CurrentCreep.room.controller) {
          const CurrentController = CurrentCreep.room.controller;

          if (CurrentCreep.upgradeController(CurrentController) === ERR_NOT_IN_RANGE) {
            Traveler.travelTo(CurrentCreep, CurrentCreep.room.controller);
          }
        } else {
          console.log("Can't find controller");
        }
      } else {
        CurrentCreep.memory.isFull = false;
      }
    }
  }
}
