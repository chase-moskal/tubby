
export class TubbyError extends Error {

	static err = (message: string, originalError?: Error) => {
		const error = new TubbyError(message)
		error.originalError = originalError
		return error
	}

	originalError: Error
}
