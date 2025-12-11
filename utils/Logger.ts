export class Logger {
    static log(msg: string): void {
        this.breaker(msg.length, '-');
        console.log(`| ${msg} |`);
        this.breaker(msg.length, '-');
    }

    static error(msg: string): void {
        this.breaker(msg.length, '~');
        console.log(`! ${msg} !`);
        this.breaker(msg.length, '~');
    }

    private static breaker(base: number, style: '~' | '-'): void {
        console.log(new Array(base + 4).fill(style).join(''));
    }
}