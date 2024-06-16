module.exports = {
    globals: {
        'ts-jest': {
            tsconfig: './tsconfig.json',
        },
    },
    testEnvironment: 'node',
    coveragePathIgnorePatterns: [
        '/node_modules/',
    ],
};
