import { join } from 'path';
import { promises as fs, existsSync } from 'fs';

export class Caching {

    constructor(private dir: string) { }

    public async writeCache<T>(file: string, data: T): Promise<void> {
        if (!data) throw new Error('No data was provided!');
        const fullPath = this.validateJsonFile(file);

        let initData = {};
        if (existsSync(fullPath)) {
            const content = await fs.readFile(fullPath, { encoding: 'utf8' });
            initData = JSON.parse(content);
        }

        await fs.writeFile(fullPath, JSON.stringify({ ...initData, ...data }), { encoding: 'utf8' });
    }

    public async checkCache<T>(file: string, key?: string): Promise<T | undefined> {
        const fullPath = this.validateJsonFile(file);
        if (!existsSync(fullPath)) return;

        const content = await fs.readFile(fullPath, { encoding: 'utf8' });
        const data = JSON.parse(content);
        return key ? data[key] : data;
    }

    public async deleteRegistred(file: string, key: string): Promise<void> {
        const fullPath = this.validateJsonFile(file);
        if (!existsSync(fullPath)) return;

        const content = await fs.readFile(fullPath, { encoding: 'utf8' });
        const data = JSON.parse(content);
        delete data[key];

        await fs.writeFile(fullPath, JSON.stringify(data), { encoding: 'utf8' });
    }

    public async clearRegistry(file: string): Promise<void> {
        const fullPath = this.validateJsonFile(file);
        if (existsSync(fullPath)) await fs.unlink(fullPath);
    }

    private validateJsonFile(file: string): string {
        if (!file?.length) throw new Error('No file name was provided!');
        if (!file.endsWith('.json')) throw new Error('File must be of type json!');
        return join(this.dir, file);
    }
}

export interface IUpdate { date?: string, time?: string }

export class LastUpdates {
    constructor(private filePath: string, private interval: number = 10) {
        this.filePath = join(filePath);
    }

    public async check(file: string, timestamp: Date): Promise<boolean> {
        const data = await this.getData();
        if (!data?.[file]?.date || !data?.[file]?.time) return false;
        const cached = data[file];
        try {
            const cachedDate = new Date(`${cached.date}, ${cached.time}`);
            if (timestamp.getFullYear() - cachedDate.getFullYear() >= 1 ||
                timestamp.getMonth() - cachedDate.getMonth() >= 1 ||
                timestamp.getDate() - cachedDate.getDate() >= 1) {
                return false;
            }
            if (timestamp.getHours() - cachedDate.getHours() >= 1 ||
                timestamp.getMinutes() - cachedDate.getMinutes() >= this.interval) {
                return false;
            }
            return true;
        } catch (error) {
            console.log({ error }); // Keep original console log or switch to Logger if preferred? Sticking to original logic.
            return false;
        }
    }

    public async update(file: string, timestamp: Date): Promise<void> {
        const data = await this.getData();
        const [date, time] = new Intl.DateTimeFormat('en-US', {
            timeStyle: 'medium',
            dateStyle: 'short',
            hour12: false,
        }).format(timestamp).split(', ');
        data[file] = { date, time };
        await fs.writeFile(this.filePath, JSON.stringify(data), { encoding: 'utf8' });
    }

    public async reset(file: string): Promise<void> {
        const data = await this.getData();
        data[file] = {};
        await fs.writeFile(this.filePath, JSON.stringify(data), { encoding: 'utf8' });
    }

    private async getData(): Promise<{ [k: string]: IUpdate }> {
        if (!existsSync(this.filePath)) return {};
        const content = await fs.readFile(this.filePath, { encoding: 'utf8' });
        return JSON.parse(content) ?? {};
    }
}