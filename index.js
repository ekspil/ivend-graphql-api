require('dotenv').config()
const App = require("./app/App")
const app = new App()

app
    .start()
    .then(() => {

    })
    .catch(e => {
        console.error("Failed to start iVend GraphQL API." + e)
    })
