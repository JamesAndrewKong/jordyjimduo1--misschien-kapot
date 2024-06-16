module.exports = {
    globals: {
        'ts-jest': {
            tsconfig: './tsconfig.json',
        },
        "jest": {
            "transformIgnorePatterns": [
                "/node_modules/(?!axios)"
            ]
        }
    },
    setupFilesAfterEnv: [
        './tests/config/setup.js',
    ],
    testEnvironment: 'node',
    coveragePathIgnorePatterns: [
        '/node_modules/',
    ],
};
