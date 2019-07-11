import { Traveler } from "../utils/traveller/traveller";

export class Harvester {
  private static CreepRepairing: boolean = false;

  public static Work(CurrentCreep: Creep, CurrentSpawn: StructureSpawn, CurrentRoom: Room) {
    const source: Source = CurrentCreep.room.find(FIND_SOURCES)[0];
    if (source) {
      const ConstructionSites = CurrentRoom.find(FIND_CONSTRUCTION_SITES)[0];
      if (!CurrentCreep.memory.isFull) {
        if (_.sum(CurrentCreep.carry) === CurrentCreep.carryCapacity) {
          CurrentCreep.memory.isFull = true;
        } else {
          if (!CurrentCreep.pos.inRangeTo(source.pos, 1)) {
            Traveler.travelTo(CurrentCreep, source.pos, { repath: 0.5, offRoad: true });
          } else {
            const result = CurrentCreep.harvest(source);
          }
        }
      }
      if (CurrentCreep.memory.isFull && CurrentSpawn.energy < CurrentSpawn.energyCapacity) {
        if (!CurrentCreep.pos.inRangeTo(CurrentSpawn.pos, 1)) {
          Traveler.travelTo(CurrentCreep, CurrentSpawn.pos, { repath: 0.5 });
        } else {
          const result = CurrentCreep.transfer(CurrentSpawn, RESOURCE_ENERGY);
          if (result === ERR_NOT_ENOUGH_RESOURCES) {
            CurrentCreep.memory.isFull = false;
          }
        }
      }

      if (CurrentCreep.memory.isFull && ConstructionSites) {
        if (!CurrentCreep.pos.inRangeTo(ConstructionSites.pos, 3)) {
          Traveler.travelTo(CurrentCreep, ConstructionSites.pos, { repath: 0.5 });
        } else {
          CurrentCreep.say("Building");
          const result = CurrentCreep.build(ConstructionSites);
          if (result === ERR_NOT_ENOUGH_RESOURCES) {
            CurrentCreep.memory.isFull = false;
          }
        }
      } else if (CurrentCreep.memory.isFull) {
        // console.log(CurrentCreep.room.storage.store[RESOURCE_ENERGY]);
        // TODO: Make harvesters fill storages
      }
    }
  }
}
