expect.extend({
    anyOrNull(received, argument) {
        try {
            expect(received).toEqual(expect.any(argument));
            return {
                message: () => 'Ok',
                pass: true,
            };
        } catch (e) {
            if (received === null) {
                return {
                    message: () => 'Ok',
                    pass: true,
                };
            } else {
                return {
                    message: () => `expected ${received} to be ${argument} type or null`,
                    pass: false,
                };
            }
        }
    },
});
