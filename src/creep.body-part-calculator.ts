//   CARRY_CAPACITY: 50;
//   HARVEST_POWER: 2;
//   HARVEST_MINERAL_POWER: 1;
//   HARVEST_DEPOSIT_POWER: 1;
//   REPAIR_POWER: 100;
//   DISMANTLE_POWER: 50;
//   BUILD_POWER: 5;
//   ATTACK_POWER: 30;
//   UPGRADE_CONTROLLER_POWER: 1;
//   RANGED_ATTACK_POWER: 10;
//   HEAL_POWER: 12;
//   RANGED_HEAL_POWER: 4;
//   DISMANTLE_COST: 0.005;
//
//   MOVE: MOVE;
//   WORK: WORK;
//   CARRY: CARRY;
//   ATTACK: ATTACK;
//   RANGED_ATTACK: RANGED_ATTACK;
//   TOUGH: TOUGH;
//   HEAL: HEAL;
//   CLAIM: CLAIM;
export enum CreepType {
  Harvester = 1,
  Hauler = 2,
  Maintainer = 3,
  Controller = 4,
  FighterMelee = 5,
  FighterRanged = 6,
}

export enum BodyPartCost {
  "work" = <any>100,
  "move" = <any>50,
  "carry" = <any>50
}

export class BodyPartCalculator {
  // MOVE: 50 cost, decrease 2 fatigue per tick
  // WORK: 100 cost, harvest 2 p/t from source,
  //    1 resource unit from mineral or deposit
  //    builds structure for 5 energy units per tick
  //    repair structure for 100 hits consuming 1 energy
  //    dismantle structure for 50 hits consuming 0.25 energy
  //    upgrade controller for 1 energy p/t
  // CARRY: 50 cost, 50 resource units carried

  // Max 50 parts
  // TODO: consider adding spawn for max energy?
  public static Calculate(type: CreepType, cost: number): BodyPartConstant[] {
    let partsToLoop: BodyPartConstant[] = [];
    let parts: BodyPartConstant[] = [];
    let currentCost = 0;

    switch (type) {
      case CreepType.Harvester:
      case CreepType.Controller:
      case CreepType.Maintainer:
        partsToLoop = [WORK, WORK, CARRY, MOVE];
        break;
    }

    let partIndex = 0;
    while (currentCost < cost) {
      const part: BodyPartConstant = partsToLoop[partIndex++];
      parts.push(part);
      // @ts-ignore
      currentCost += BodyPartCost[part];
    }

    console.log(`BodyPartCalculator.Calculate: type: ${type} - cost: ${cost} - ${parts}`);

    return parts;
  }
}
