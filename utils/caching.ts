import { join } from 'path';
import { writeFileSync, readFileSync, existsSync, unlinkSync } from 'fs';

export class Caching {

    constructor(private dir: string) { }

    public writeCache<T>(file: string, data: T): void {
        if (!data) throw 'No data was provided!';
        const fullPath = this.validateJsonFile(file);
        const initData = existsSync(fullPath) ? JSON.parse(readFileSync(fullPath, { encoding: 'utf8' })) : {};
        writeFileSync(fullPath, JSON.stringify({ ...initData, ...data }), { encoding: 'utf8' });
    }

    public checkCache<T>(file: string, key?: string): T | undefined {
        const fullPath = this.validateJsonFile(file);
        if (!existsSync(fullPath)) return;
        const data = JSON.parse(readFileSync(fullPath, { encoding: 'utf8' }));
        return key ? data[key] : data;
    }

    public deleteRegistred(file: string, key: string): void { 
        const fullPath = this.validateJsonFile(file);
        if (!existsSync(fullPath)) return;
        const data = JSON.parse(readFileSync(fullPath, { encoding: 'utf8' }));
        delete data[key];
        writeFileSync(fullPath, JSON.stringify(data), { encoding: 'utf8' });
    }

    public clearRegistry(file: string): void {
        const fullPath = this.validateJsonFile(file);
        if (existsSync(fullPath)) unlinkSync(fullPath);
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

    public check(file: string, timestamp: Date): boolean {
        const data = this.getData();
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
            console.log({ error });
            return false;
        }
    }

    public update(file: string, timestamp: Date): void {
        const data = this.getData();
        const [date, time] = new Intl.DateTimeFormat('en-US', {
            timeStyle: 'medium',
            dateStyle: 'short',
            hour12: false,
        }).format(timestamp).split(', ');
        data[file] = { date, time };
        writeFileSync(this.filePath, JSON.stringify(data), { encoding: 'utf8' });
    }

    public reset(file: string): void {
        const data = this.getData();
        data[file] = {};
        writeFileSync(this.filePath, JSON.stringify(data), { encoding: 'utf8' });
    }

    private getData(): { [k: string]: IUpdate } {
        if (!existsSync(this.filePath)) return {};
        return JSON.parse(readFileSync(this.filePath, { encoding: 'utf8' })) ?? {};
    }
}