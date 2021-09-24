require('dotenv').config();
const app = require('./app')



// app.use((err, req, res, next) => {
// 	const { status = 500 } = err;
// 	if (!err.message) err.message = 'Something went wrong ! Oppss'
// 	res.status(status).render('error', { err })
// })

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Listening on port ${process.env.SERVER_PORT}`)
})