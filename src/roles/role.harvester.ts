import _ from "lodash";
import { Traveler } from "../utils/traveller/traveller";

export class Harvester {
  private static CreepRepairing: boolean = false;

  public static Work(creep: Creep) {
    const source: Source = creep.room.find(FIND_SOURCES)[0];
    if (source) {
      // const ConstructionSites = CurrentCreep.room.find(FIND_CONSTRUCTION_SITES)[0];
      const ConstructionSites = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
      const CurrentSpawn: StructureSpawn = creep.room.find(FIND_MY_SPAWNS)[0];
      if (!creep.memory.isFull) {
        if (creep.store.getFreeCapacity() === 0) {
          creep.memory.isFull = true;
        } else {
          if (!creep.pos.inRangeTo(source.pos, 1)) {
            Traveler.travelTo(creep, source.pos, { repath: 0.5, offRoad: true });
          } else {
            const result = creep.harvest(source);
          }
        }
      }

      // 1. Fill spawn
      if (creep.memory.isFull && CurrentSpawn.store[RESOURCE_ENERGY] < (CurrentSpawn.store.getCapacity(RESOURCE_ENERGY) ?? 0)) {
        if (!creep.pos.inRangeTo(CurrentSpawn.pos, 1)) {
          Traveler.travelTo(creep, CurrentSpawn.pos, { repath: 0.5 });
        } else {
          const result = creep.transfer(CurrentSpawn, RESOURCE_ENERGY);
          if (result === ERR_NOT_ENOUGH_RESOURCES) {
            creep.memory.isFull = false;
          }
        }
        // 2. If spawn is full and has leftovers, check if there's any construction
      } else if (creep.memory.isFull && ConstructionSites) {
        if (!creep.pos.inRangeTo(ConstructionSites.pos, 3)) {
          Traveler.travelTo(creep, ConstructionSites.pos, { repath: 0.5 });
        } else {
          creep.say("Building");
          const result = creep.build(ConstructionSites);
          if (result === ERR_NOT_ENOUGH_RESOURCES) {
            creep.memory.isFull = false;
          }
        }
      } else if (creep.memory.isFull) {
        // console.log(CurrentCreep.room.storage.store[RESOURCE_ENERGY]);
        // TODO: Make harvesters fill storages
      }
    }
  }
}
