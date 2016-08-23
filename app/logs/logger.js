var winston = require('winston');

function tsFormat() {
    var date = new Date();
    return date.toLocaleDateString() + ' - ' + date.toLocaleTimeString();
}

var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: 'info'
        }),
        new(winston.transports.File)({
            filename: __dirname + '/../logs/hobbnb.log',
            colorize: true,
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            level: 'debug'
        })
    ]
});

module.exports = logger;
