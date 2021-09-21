const request = require('supertest')
const { sequelize } = require('../models')
const app = require('../app.js')


// beforeEach((done) => {

// })


describe("POST /register", () => {
    

    // beforeAll(async () => {
    //     await sequelize.sync({ force: true })
    //   })


    describe("given a username and a password", () => {
        
        test("Should respond with 302", async () => {
            const response = await request(app).post("/register").send({
                username: 'elo',
                password: 'null',
                email: 'elo@o2.pl'
            })
            expect(response.statusCode).toBe(302)
        })
    })

    describe("when the username or password is missing", () => {

    })

    // afterAll(async () => {
    //     await sequelize.close()
    //   })

})