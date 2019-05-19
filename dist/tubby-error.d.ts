export declare class TubbyError extends Error {
    static err: (message: string, originalError?: Error) => TubbyError;
    originalError: Error;
}
