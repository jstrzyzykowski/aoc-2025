export type SolutionFn = (input: string) => number | string | Promise<number | string>;

export interface DaySolution {
  day: number;
  part1: SolutionFn;
  part2: SolutionFn;
  testInput?: string;
  expectedResults?: {
    part1?: number | string;
    part2?: number | string;
  };
}

export interface DataServiceConfig {
  sessionToken: string;
  year: number;
  cacheDir: string;
  userAgent: string;
}

export interface CLIArgs {
  day: number;
  part: 1 | 2;
  test: boolean;
}
