import { Logger } from "../utils/Logger";

export class AnyService {
    async create(payload: any): Promise<any> {
        Logger.log(`Creating ${payload?.name}`);
        // Logic
        Logger.log(`Successfuly created ${payload?.name}`);
        return payload;
    }

    async retrieve(id: string): Promise<any> {
        Logger.log(`Retrieving ${id}`);
        // Logic
        Logger.log(`Retrieved ${id}`);
        return { id };
    }
    
    async update(id: string, payload: Partial<any>): Promise<any> {
        Logger.log(`Updating ${id}`);
        // Logic
        Logger.log(`Updated ${id}`);
        return { id, ...payload };
    }
    
    async delete(id: string): Promise<void> {
        // Logic
        Logger.log(`Deleted ${id}`);
    }
}