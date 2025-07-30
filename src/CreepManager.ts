import { CreepRole } from "./CreepRole";
import { CreepState } from "./CreepState";
import { Globals } from "./globals";
import { Controller } from "./roles/role.controller";
import { Harvester } from "./roles/role.harvester";
import { Maintainer } from "./roles/role.maintainer";
import { Traveler } from "./utils/traveller/traveller";

export class CreepManager {
  private readonly creep: Creep;

  constructor(creep: Creep) {
    this.creep = creep;
    this.creep.updateMemory();

    switch (this.creep.role) {
      case CreepRole.Harvester:
        Globals.HarvesterAmount++;
        break;
      case CreepRole.Controller:
        Globals.ControllerAmount++;
        break;
      case CreepRole.Maintainer:
        Globals.MaintainerAmount++;
        break;
    }
  }

  public run(): void {
    switch (this.creep.state) {
      case CreepState.Idle:
        switch (this.creep.role) {
          case CreepRole.Harvester:
            Harvester.Work(this.creep);
            break;
          case CreepRole.Controller:
            if (this.creep.memory.isFull) {
              Controller.Work(this.creep);
            } else {
              Harvester.Work(this.creep);
            }
            break;
          case CreepRole.Maintainer:
            Maintainer.Work(this.creep);
            break;
          default:
            console.log(`No work for ${this.creep.role}!`);
        }
        break;
      case CreepState.Traveling:
        if (this.creep.memory.moveTarget.target === null) {
          this.creep.state = CreepState.Idle;
          break;
        }

        const targetPos = new RoomPosition(
          this.creep.memory.moveTarget.target.x,
          this.creep.memory.moveTarget.target.y,
          this.creep.memory.moveTarget.target.roomName
        );

        if (this.creep.pos.inRangeTo(targetPos, this.creep.memory.moveTarget.range)) {
          this.creep.state = CreepState.Idle;
          break;
        }

        Traveler.travelTo(this.creep, targetPos);
        break;
      case CreepState.Harvesting:
        if (this.creep.role === CreepRole.Harvester || this.creep.role === CreepRole.Controller) {
          Harvester.Work(this.creep);
        }

        if (this.creep.memory.isFull && this.creep.role === CreepRole.Controller) {
          this.creep.state = CreepState.Upgrading;
        }
        break;
      case CreepState.Building:
        break;
      case CreepState.Maintaining:
        Maintainer.Work(this.creep);
        break;
      case CreepState.Upgrading:
        if (this.creep.role === CreepRole.Controller && this.creep.memory.isFull) {
          Controller.Work(this.creep);
        } else {
          Harvester.Work(this.creep);
        }
        break;
      case CreepState.Repairing:
        break;
      case CreepState.GettingEnergy:
        this.creep.getEnergy();
        break;
      default:
        this.creep.state = CreepState.Idle;
        break;
    }
  }
}
