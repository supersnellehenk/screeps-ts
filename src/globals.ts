export class Globals {
  public static MaxHarvesters: number = 3;
  public static MaxControllers: number = 1;

  public static HarvesterAmount: number = 0;
  public static HaulerAmount: number = 0;
  public static MaintainerAmount: number = 0;
  public static ControllerAmount: number = 0;

  public static CurrentRoom: Room = Game.rooms.E6N2;
  public static CurrentSpawn: StructureSpawn = Game.spawns.HenkIsHier;

  public static ResetGlobalAmounts() {
    this.HarvesterAmount = 0;
    this.HaulerAmount = 0;
    this.MaintainerAmount = 0;
    this.ControllerAmount = 0;

    this.CurrentSpawn = Game.spawns.HenkIsHier;
  }
}
