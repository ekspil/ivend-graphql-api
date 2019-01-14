require("dotenv").config()
const App = require("./app/App")
const app = new App()
const logger = require("./app/utils/logger")

app
    .start()
    .then(() => {
        logger.info("Ivend GraphQL API started")
    })
    .catch(e => {
        logger.error("Failed to start iVend GraphQL API." + e)
    })
