import { mkdir, writeFile, exists } from 'node:fs/promises';
import path from 'node:path';

const dayArg = Bun.argv[2];

if (!dayArg) {
  console.error('❌ Please provide a day number (e.g., bun run scaffold 1)');
  process.exit(1);
}

const dayNum = parseInt(dayArg, 10);
if (isNaN(dayNum) || dayNum < 1 || dayNum > 25) {
  console.error('❌ Day must be between 1 and 25');
  process.exit(1);
}

const paddedDay = dayNum.toString().padStart(2, '0');
const targetDir = path.join(process.cwd(), 'src', 'solutions', `day${paddedDay}`);

async function scaffold() {
  if (await exists(targetDir)) {
    console.error(`❌ Directory ${targetDir} already exists!`);
    process.exit(1);
  }

  console.log(`🔨 Scaffolding day ${dayNum}...`);
  await mkdir(targetDir, { recursive: true });

  // 1. Create index.ts
  const indexContent = `import type { DaySolution } from '@/types';

const solution: DaySolution = {
  day: ${dayNum},
  part1: (input) => {
    const lines = input.split('\\n');
    return 0;
  },
  part2: (input) => {
    return 0;
  },
};

export default solution;
`;

  await writeFile(path.join(targetDir, 'index.ts'), indexContent);

  // 2. Create index.test.ts
  const testContent = `import { expect, test, describe } from 'bun:test';
import solution from './index';

const testInput = \`\`;

describe('Day ${dayNum}', () => {
  test('Part 1', () => {
    expect(solution.part1(testInput)).toBe(0);
  });

  test('Part 2', () => {
    expect(solution.part2(testInput)).toBe(0);
  });
});
`;

  await writeFile(path.join(targetDir, 'index.test.ts'), testContent);

  console.log(`✅ Successfully created structure for Day ${dayNum}!`);
  console.log(`📂 ${targetDir}`);
}

scaffold().catch(console.error);
