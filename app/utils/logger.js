const log = require("gelf-pro")
const os = require("os")
const hostname = os.hostname()
const environment = process.env.NODE_ENV

class Logger {

    constructor() {
        if (process.env.GRAYLOG_HOST) {
            log.setConfig({
                fields: {environment, service: "graphql-api", hostname}, // optional; default fields for all messages
                filter: [], // optional; filters to discard a message
                transform: [], // optional; transformers for a message
                broadcast: [], // optional; listeners of a message
                levels: {}, // optional; default: see the levels section below
                aliases: {}, // optional; default: see the aliases section below
                adapterName: "tcp", // optional; currently supported "udp", "tcp" and "tcp-tls"; default: udp
                adapterOptions: { // this object is passed to the adapter.connect() method
                    // common
                    host: process.env.GRAYLOG_HOST, // optional; default: 127.0.0.1
                    port: 12201, // optional; default: 12201
                    // ... and so on

                    // tcp adapter example
                    family: 4, // tcp only; optional; version of IP stack; default: 4
                    timeout: 1000, // tcp only; optional; default: 10000 (10 sec)

                    // udp adapter example
                    //protocol: "udp4", // udp only; optional; udp adapter: udp4, udp6; default: udp4

                    // tcp-tls adapter example
                    //key: fs.readFileSync("client-key.pem"), // tcp-tls only; optional; only if using the client certificate authentication
                    //cert: fs.readFileSync("client-cert.pem"), // tcp-tls only; optional; only if using the client certificate authentication
                    //ca: [fs.readFileSync("server-cert.pem")] // tcp-tls only; optional; only for the self-signed certificate
                }
            })
        }

    }

    _log(level, msg) {
        /* eslint-disable no-console */
        console[level](msg)
        log[level](msg)
        /* eslint-enable no-console */
    }

    info(msg) {
        this._log("info", msg)
    }

    warning(msg) {
        this._log("warn", msg)
    }

    debug(msg) {
        this._log("debug", msg)
    }

    error(msg) {
        this._log("error", msg)
    }

}


module.exports = new Logger()
