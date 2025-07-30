/**
 * 1. **CPU Metrics**:
 *     - Current CPU usage
 *     - CPU bucket level
 *     - CPU limit
 *     - Helps track performance and identify CPU spikes
 *
 * 2. **Progress Metrics**:
 *     - GCL (Global Control Level) progress
 *     - GPL (Global Power Level) progress
 *     - RCL (Room Control Level) for each room
 *     - Tracks overall empire growth
 *
 * 3. **Resource Metrics**:
 *     - Total energy across all rooms
 *     - Energy available/capacity per room
 *     - Storage/Terminal contents
 *     - Helps with resource management
 *
 * 4. **Population Metrics**:
 *     - Creep counts by role
 *     - Spawn queue length
 *     - Helps track population management
 *
 * 5. **Room-specific Metrics**:
 *     - Source utilization
 *     - Structure counts
 *     - Creep distribution
 *     - Construction sites
 *     - Helps monitor room efficiency
 *
 * 6. **Memory Usage**:
 *     - Memory size
 *     - Helps prevent hitting memory limits
 */
import _ from "lodash";
import { CreepRole } from "./CreepRole";

export class GameStats {
  public static log(): void {
    // CPU Usage
    const cpuUsed = Game.cpu.getUsed();
    const cpuLimit = Game.cpu.limit;
    const bucketLevel = Game.cpu.bucket;

    // GCL/GPL Progress
    const gclProgress = `GCL ${Game.gcl.level} (${(Game.gcl.progress / Game.gcl.progressTotal * 100).toFixed(2)}%)`;
    const gplProgress = `GPL ${Game.gpl.level} (${(Game.gpl.progress / Game.gpl.progressTotal * 100).toFixed(2)}%)`;

    // Empire Stats
    const totalEnergy = this.calculateTotalEnergy();
    const creepCount = Object.keys(Game.creeps).length;
    const spawnCount = Object.keys(Game.spawns).length;
    const roomCount = Object.keys(Game.rooms).length;

    // Memory Stats
    const memorySize = RawMemory.get().length;

    console.log(`Tick ${Game.time}:
            CPU: ${cpuUsed.toFixed(2)}/${cpuLimit} (Bucket: ${bucketLevel})
            Progress: ${gclProgress} | ${gplProgress}
            Empire: ${creepCount} creeps, ${spawnCount} spawns, ${roomCount} rooms
            Energy: ${totalEnergy}
            Memory: ${(memorySize / 1024).toFixed(2)}KB`);
  }

  private static calculateTotalEnergy(): number {
    let total = 0;
    for (const room of Object.values(Game.rooms)) {
      if (!room.controller?.my) continue;

      // Storage
      total += room.storage?.store.energy ?? 0;

      // Terminal
      total += room.terminal?.store.energy ?? 0;

      // Spawns
      room.find(FIND_MY_SPAWNS).forEach(spawn => {
        total += spawn.store.energy;
      });

      // Extensions
      room.find(FIND_MY_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_EXTENSION
      }).forEach(extension => {
        total += (extension as StructureExtension).store.energy;
      });
    }
    return total;
  }

  public static logRoomStats(room: Room): void {
    if (!room.controller?.my) return;

    const energyAvailable = room.energyAvailable;
    const energyCapacity = room.energyCapacityAvailable;
    const rcl = room.controller.level;
    const rclProgress = (room.controller.progress / room.controller.progressTotal * 100).toFixed(2);

    const creeps = _.countBy(room.find(FIND_MY_CREEPS), 'memory.role');
    const structures = _.countBy(room.find(FIND_MY_STRUCTURES), 'structureType');

    const sources = room.find(FIND_SOURCES);
    const minerStats = sources.map(source => {
      const miners = source.pos.findInRange(FIND_MY_CREEPS, 1, {
        filter: c => c.memory.role === CreepRole.Harvester
      }).length;
      return `${miners}/${source.energy}`;
    }).join(', ');

    console.log(`Room ${room.name}:
            Energy: ${energyAvailable}/${energyCapacity}
            RCL ${rcl} (${rclProgress}%)
            Sources: ${minerStats}
            Creeps: ${JSON.stringify(creeps)}
            Structures: ${JSON.stringify(structures)}`);
  }
}

