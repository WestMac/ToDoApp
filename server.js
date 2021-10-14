require('dotenv').config();
const app = require('./app')



app.listen(process.env.SERVER_PORT, () => {
    console.log(`Listening on port ${process.env.SERVER_PORT}`)
})

/////////////////// Server for making JEST work concurently /////////////////////////////