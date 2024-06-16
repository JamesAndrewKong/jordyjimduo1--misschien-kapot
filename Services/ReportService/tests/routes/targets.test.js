const {logMessage} = require('../../subscriber');
const fs = require('fs');

const mockWrite = jest.fn();

fs.appendFileSync = mockWrite;

test('it adds line to log', () => {
    const message = {message: 'Hi!'};

    logMessage(message);

    expect(mockWrite).toBeCalledWith('/var/logs/reports.txt', JSON.stringify({message}) + '\n');
});
