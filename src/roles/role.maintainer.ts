import { CreepState } from "CreepState";

export class Maintainer {
  public static Work(creep: Creep) {
    // X Find structures that need repairs
    // Get energy if needed
    // X Repair!
    // ??
    // Profit

    const targets = creep.room.find(FIND_STRUCTURES, {
      filter: object => object.hits < object.hitsMax
    });

    targets.sort((a,b) => a.hits - b.hits);

    if(targets.length > 0) {
      const returnCode = creep.repair(targets[0]);
      if(returnCode === ERR_NOT_IN_RANGE) {
        creep.travel(targets[0].pos);
      } else if (returnCode === ERR_NOT_ENOUGH_RESOURCES) {
        // Get energy
        creep.state = CreepState.GettingEnergy;
      } else {
        creep.state = CreepState.Maintaining;
      }
    } else {
      console.log("No targets to repair!");
      creep.state = CreepState.Idle;
    }
  }
}
