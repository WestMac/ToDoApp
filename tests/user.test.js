const request = require('supertest')
const { sequelize } = require('../models')
const app = require('../app.js')
require('dotenv').config();

// beforeEach((done) => {

// })


describe("POST login/register", () => {
    
    describe("given a username and a password", () => {
        
        test('Should respond with 302', async() => {
            const response = await request(app).post('/login').send({
                username: 'test',
                password: 'test'
            })
            // console.log(response)
            expect(response.statusCode).toBe(302)
            
        })
        
        test("Should respond with 302", async () => {
            const response = await request(app).post("/register").send({
                username: 'newUser',
                password: 'newUserrsrs',
                email: 'newUser@newUser.pl'
            })
            expect(response.statusCode).toBe(302)
       
        })
       
        test("Should respond with 403", async () => {
            const response = await request(app).post("/register").send({
                username: null,
                password: 'newUser1',
                email: 'newUse1r@newUs1r.pl'
            })
            expect(response.statusCode).toBe(400)
            
        })
        test("Should respond with 403", async () => {
            const response = await request(app).post("/register").send({
                username: 'newUser',
                password: undefined,
                email: 'newUse1r@newUser1.pl'
            })
            expect(response.statusCode).toBe(400)
          
        })
        test("Should respond with 403", async () => {
            const response = await request(app).post("/register").send({
                username: 'newUser2',
                password: 'newUser2',
                email: null
            })
            expect(response.statusCode).toBe(400)
      
        })
        test("Should respond with 403",async () => {
            const response = await request(app).post('/login').send({
                username: 'test',
                password: null,
            })
            expect(response.statusCode).toBe(400)
            
        })
        test("Should respond with 403",async () => {
            const response = await request(app).post('/login').send({
                username: undefined,
                password: null,
            })
            expect(response.statusCode).toBe(400)
         
        })
        test("Should respond with 403",async () => {
            const response = await request(app).post('/login').send({
                username: 'elo',
                password: 'testtesttest',
            })
            expect(response.statusCode).toBe(400)
        })
    })

    describe("when the username or password is missing", () => {

    })

    afterAll(async () => {
        await sequelize.close()
      })

})