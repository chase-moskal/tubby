export class TubbyError extends Error {
}
TubbyError.err = (message, originalError) => {
    const error = new TubbyError(message);
    error.originalError = originalError;
    return error;
};
//# sourceMappingURL=tubby-error.js.map