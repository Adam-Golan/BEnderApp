export interface IService<T = any> {
    create(payload: T): Promise<T>;
    retrieve(id: string): Promise<T>;
    update(id: string, payload: Partial<T>): Promise<T>;
    delete(id: string): Promise<T>;
}

export interface IWorkerMessage {
    type: 'START' | 'STOP' | 'Check Health' | 'DATA';
    payload?: any;
    id?: string;
}

export interface IResponse<T = any> {
    status: 'SUCCESS' | 'ERROR';
    data?: T;
    error?: string;
}
