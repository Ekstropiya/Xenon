module.exports = {
    "container": true,
    "ssl": {
        "use": false,
        "cert": "",
        "key": "",
    },
    "address": {
        "range": process.env["XENON_ADDR_RANGE"],
        "port": process.env["XENON_ADDR_PORT"],
    },
    "logging": {
        "console": process.env["XENON_LOG_CONSOLE"],
        "database": process.env["XENON_LOG_DATABASE"],
    },
}

// Uncomment if not using docker.
// module.exports = {
//     "container": false,
//     "ssl": {
//         "use": true,
//         "cert": "ssl.cert",
//         "key": "ssl.key",
//     },
//     "address": {
//         "range": "0.0.0.0",
//         "port": "80",
//     },
//     "logging": {
//         "console": true,
//         "database": true,
//     },
// }