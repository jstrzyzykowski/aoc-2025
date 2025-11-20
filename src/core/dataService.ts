import type { DataServiceConfig } from '@/types';

export class DataService {
  private config: DataServiceConfig;

  constructor(config: DataServiceConfig) {
    this.config = config;
  }

  async getInput(day: number): Promise<string> {
    const paddedDay = day.toString().padStart(2, '0');
    const filePath = `${this.config.cacheDir}/day${paddedDay}.txt`;
    const file = Bun.file(filePath);

    // 1. Check if file exists locally
    if (await file.exists()) {
      console.log(`📂 Loading input from cache: ${filePath}`);
      return await file.text();
    }

    // 2. If not, fetch from AoC
    console.log(`🌐 Fetching input for day ${day} from AoC...`);
    const input = await this.fetchFromAoC(day);

    // 3. Save to cache
    await Bun.write(filePath, input);
    console.log(`💾 Saved input to cache: ${filePath}`);

    return input;
  }

  private async fetchFromAoC(day: number): Promise<string> {
    if (!this.config.sessionToken) {
      throw new Error('❌ AOC_SESSION token is missing in .env file! Cannot fetch input.');
    }

    const url = `https://adventofcode.com/${this.config.year}/day/${day}/input`;

    try {
      const response = await fetch(url, {
        headers: {
          Cookie: `session=${this.config.sessionToken}`,
          'User-Agent': this.config.userAgent,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch input: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      return text.trimEnd();
    } catch (error) {
      throw new Error(`Network error while fetching input: ${error}`);
    }
  }
}
