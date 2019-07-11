export class Controller {
  public static Work(CurrentCreep: Creep, CurrentSpawn: StructureSpawn, CurrentRoom: Room) {
    console.log("Controller");
    if (!CurrentCreep.memory.isFull) {
      const Storage = CurrentCreep.room.find(FIND_MY_STRUCTURES, {
        filter: i => {
          return i.structureType === STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] === 2000;
        }
      });
      console.log(Storage);
    }
    // console.log(CurrentController.pos);
    // if (CurrentController.my) {
    // }
  }
}
