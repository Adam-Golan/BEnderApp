import { Logger } from "../utils/Logger";
import { IService } from "../types";

export class Logic implements IService {
    async create(payload: any): Promise<any> {
        try {
            Logger.log(`Creating ${payload?.name || 'Item'}`);
            // Logic
            Logger.log(`Successfully created ${payload?.name || 'Item'}`);
            return payload;
        } catch (error) {
            Logger.error(`Failed to create item: ${error}`);
            throw error;
        }
    }

    async retrieve(id: string): Promise<any> {
        try {
            Logger.log(`Retrieving ${id}`);
            // Logic
            Logger.log(`Retrieved ${id}`);
            return { id };
        } catch (error) {
            Logger.error(`Failed to retrieve ${id}: ${error}`);
            throw error;
        }
    }

    async update(id: string, payload: Partial<any>): Promise<any> {
        try {
            Logger.log(`Updating ${id}`);
            // Logic
            Logger.log(`Updated ${id}`);
            return { id, ...payload };
        } catch (error) {
            Logger.error(`Failed to update ${id}: ${error}`);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            // Logic
            Logger.log(`Deleted ${id}`);
        } catch (error) {
            Logger.error(`Failed to delete ${id}: ${error}`);
            throw error;
        }
    }
}