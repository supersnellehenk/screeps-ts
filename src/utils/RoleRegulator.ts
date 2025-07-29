import { Globals } from "../globals";

import { Controller } from "../roles/role.controller";
import { Harvester } from "../roles/role.harvester";
import { Hauler } from "../roles/role.hauler";
import { Maintainer } from "../roles/role.maintainer";

export class RoleRegulator {
  public static Regulate(CurrentCreep: Creep) {
    const role = CurrentCreep.memory.role;

    switch (role) {
      case "harvester":
        Globals.HarvesterAmount++;
        if (CurrentCreep.memory.isFull && Globals.CurrentRoom.find(FIND_CONSTRUCTION_SITES)[0] === undefined) {
          Controller.Work(CurrentCreep);
        } else {
          Harvester.Work(CurrentCreep);
        }
        break;
      case "hauler":
        Globals.HaulerAmount++;
        Hauler.Work(CurrentCreep);
        break;
      case "maintainer":
        Globals.MaintainerAmount++;
        Maintainer.Work(CurrentCreep);
        break;
      case "controller":
        Globals.ControllerAmount++;
        Controller.Work(CurrentCreep);
        if (CurrentCreep.memory.isFull) {
          Controller.Work(CurrentCreep);
        } else {
          Harvester.Work(CurrentCreep);
        }
    }
  }
}
