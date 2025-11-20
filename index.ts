import { DataService } from '@/core/dataService';
import type { CLIArgs, DaySolution } from '@/types';

if (!process.env.AOC_USER_AGENT) {
  console.error(
    '❌ AOC_USER_AGENT is missing in .env file! Please set it to your repo URL (e.g. github.com/username/aoc).'
  );
  process.exit(1);
}

const CONFIG = {
  year: parseInt(process.env.AOC_YEAR || '2025'),
  sessionToken: process.env.AOC_SESSION || '',
  cacheDir: 'inputs',
  userAgent: process.env.AOC_USER_AGENT,
};

// CLI Argument Parsing
function parseArgs(): CLIArgs {
  const args = Bun.argv.slice(2);
  const dayArg = args[0];
  const partArg = args[1];

  if (!dayArg || !partArg) {
    console.error('❌ Usage: bun start <day> <part> [--test]');
    process.exit(1);
  }

  const day = parseInt(dayArg, 10);
  const part = parseInt(partArg, 10);

  if (isNaN(day) || day < 1 || day > 25) {
    console.error('❌ Day must be between 1 and 25');
    process.exit(1);
  }

  if (isNaN(part) || (part !== 1 && part !== 2)) {
    console.error('❌ Part must be 1 or 2');
    process.exit(1);
  }

  return {
    day,
    part: part as 1 | 2,
    test: args.includes('--test') || args.includes('-t'),
  };
}

// Main Runner
async function main() {
  const args = parseArgs();
  console.log(`🎄 Advent of Code ${CONFIG.year} - Day ${args.day} Part ${args.part}`);

  // #1. Load Solution
  const paddedDay = args.day.toString().padStart(2, '0');
  let solutionModule: { default: DaySolution };

  try {
    solutionModule = await import(`@solutions/day${paddedDay}/index`);
  } catch {
    console.error(`❌ Solution for day ${args.day} not found!`);
    console.error(`   Run: bun run scaffold ${args.day}`);
    process.exit(1);
  }

  const solution = solutionModule.default;

  // #2. Prepare Input
  let input: string;
  if (args.test) {
    if (!solution.testInput) {
      console.error('❌ No test input defined in solution file!');
      process.exit(1);
    }
    input = solution.testInput;
    console.log('🧪 Using TEST input');
  } else {
    const dataService = new DataService({
      sessionToken: CONFIG.sessionToken,
      year: CONFIG.year,
      cacheDir: CONFIG.cacheDir,
      userAgent: CONFIG.userAgent,
    });
    input = await dataService.getInput(args.day);
  }

  // #3. Run Solution
  console.log('🚀 Running solution...');
  const start = performance.now();

  const solveFn = args.part === 1 ? solution.part1 : solution.part2;
  const result = await solveFn(input);

  const end = performance.now();

  console.log('\n🎉 Result:', result);
  console.log(`⏱️  Time: ${(end - start).toFixed(2)}ms`);
}

main().catch(console.error);
