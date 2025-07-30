import _ from "lodash";
import { CreepState } from "../CreepState";
import { Traveler } from "../utils/traveller/traveller";

export class Harvester {
  // private static CreepRepairing: boolean = false;

  public static Work(creep: Creep) {
    const source: Source = creep.room.find(FIND_SOURCES)[0];
    if (!source) {
      return;
    }

    const ConstructionSites = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    const CurrentSpawn: StructureSpawn = creep.room.find(FIND_MY_SPAWNS)[0];
    if (!creep.memory.isFull) {
      creep.state = CreepState.Harvesting;
      if (creep.store.getFreeCapacity() === 0) {
        creep.memory.isFull = true;
        creep.state = CreepState.Idle;
      } else {
        if (!creep.pos.isNearTo(source.pos)) {
          Traveler.travelTo(creep, source.pos, { repath: 0.5 });
        } else {
          creep.harvest(source);
        }
      }
    }
    let extensionsThatRequireEnergy: StructureExtension[] = CurrentSpawn.room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_EXTENSION }
    });
    const spawnRequiresEnergy =
      CurrentSpawn.store[RESOURCE_ENERGY] < (CurrentSpawn.store.getCapacity(RESOURCE_ENERGY) ?? 0);
    extensionsThatRequireEnergy = extensionsThatRequireEnergy.filter((extension) => {
      return extension.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    });
    if (creep.memory.isFull && (spawnRequiresEnergy || extensionsThatRequireEnergy.length > 0)) {
      const spawnEnergyRequired = CurrentSpawn.store.getFreeCapacity(RESOURCE_ENERGY);

      if (spawnEnergyRequired > 0) {
        this.fillStructureWithEnergy(CurrentSpawn, creep);
      } else {
        this.fillStructureWithEnergy(extensionsThatRequireEnergy[0], creep);
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
      console.log(creep.room.storage?.store[RESOURCE_ENERGY]);
      const energyStorage = creep.room
        .find(FIND_MY_STRUCTURES, {
          filter: { structureType: STRUCTURE_CONTAINER }
        })
        .filter((structure: Structure) => {
          return (structure as StructureContainer).store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        });

      if (energyStorage.length > 0) {
        this.fillStructureWithEnergy(energyStorage[0], creep);
      }
    }
  }

  private static fillStructureWithEnergy(structure: Structure, creep: Creep): void {
    if (!creep.pos.isNearTo(structure.pos)) {
      Traveler.travelTo(creep, structure.pos, { });
      creep.memory.moveTarget.range = 1;
      creep.memory.moveTarget.target = {
        x: structure.pos.x,
        y: structure.pos.y,
        roomName: structure.room.name
      } as RoomPosition;
      creep.state = CreepState.Traveling;
      return;
    }

    const result = creep.transfer(structure, RESOURCE_ENERGY);
    if (result === ERR_NOT_ENOUGH_RESOURCES) {
      creep.memory.isFull = false;
    }
  }
}
