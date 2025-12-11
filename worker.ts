import { Logic } from './data/Logic';
import { IWorkerMessage, IResponse } from './types';

const service = new Logic();

process.on('message', async (message: IWorkerMessage) => {
    try {
        switch (message.type) {
            case 'START':
                if (process.send) process.send({ status: 'SUCCESS', data: 'Started' } as IResponse);
                break;
            case 'STOP':
                process.exit(0);
            case 'Check Health':
                if (process.send) process.send({ status: 'SUCCESS', data: 'Healthy' } as IResponse);
                break;
            case 'DATA':
                const result = await service.create(message.payload);
                if (process.send) process.send({ status: 'SUCCESS', data: result, id: message.id } as IResponse);
                break;
            default:
                if (process.send) process.send({ status: 'ERROR', error: 'Unknown message type' } as IResponse);
        }
    } catch (error: any) {
        if (process.send) process.send({ status: 'ERROR', error: error.message } as IResponse);
    }
});

// Keep process alive
setInterval(() => { }, 1000 * 60 * 60);
