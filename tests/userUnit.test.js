const request = require('supertest')
const { sequelize } = require('../models')
const app = require('../app.js')



describe("POST register", () => {
    
        //@@## REGISTER USER SUCCESSFULL @@##//

    describe("given a username and a password SUCCESS", () => {
        
        test("Register new account,302", async () => {
            const response = await request(app).post("/register").send({
                username: 'newUser',
                password: 'newUserrsrs',
                email: 'newUser@newUser.pl'
            })
            expect(response.statusCode).toBe(302)
        })
    })
       
       //@@## REGISTER USERNAME FAILED @@##//

    describe("given a username and a password FAIL", () => {
        
        test("Register new account with password null, 400", async () => {
            const response = await request(app).post("/register").send({
                username: 'newUser1',
                password: null,
                email: 'newUse1r@newUs1r.pl'
            })
            expect(response.statusCode).toBe(400)
            
        })


        test("Register new account with username null, 400", async () => {
            const response = await request(app).post("/register").send({
                username: null,
                password: 'newUser1',
                email: 'newUse1r@newUs1r.pl'
            })
            expect(response.statusCode).toBe(400)
            
        })

        test("Register new account with username empty string, 400", async () => {
            const response = await request(app).post("/register").send({
                username: '',
                password: 'newUser1',
                email: 'newUse1r@newUser1.pl'
            })
            expect(response.statusCode).toBe(400)
        })

        test("Register new account with email as an null, 403", async () => {
            const response = await request(app).post("/register").send({
                username: 'newUser2',
                password: 'newUser2',
                email: null
            })
            expect(response.statusCode).toBe(400)
        })
            
        test("Register new account with wrong email format, without @, 400", async() => {
            const response = await request(app).post('/register').send({
                username: 'newUser2',
                password: 'newUser2',
                email: 'test.pl'
            })
            expect(response.statusCode).toBe(400)
        })
        
        test("Register new account with wrong email format,without . ,400", async() => {
            const response = await request(app).post('/register').send({
                username: 'newUser2',
                password: 'newUser2',
                email: 'test@pl'
            })
            expect(response.statusCode).toBe(400)
        })
        test("Register new account with wrong email format ,400", async() => {
            const response = await request(app).post('/register').send({
                username: 'newUser2',
                password: 'newUser2',
                email: 'testpl'
            })
            expect(response.statusCode).toBe(400)
        })
    })
})

describe("POST /login", () => { 

            //@@## Login Sucessfully ##@@//
    
    test('Login to new account, 302', async() => {
        const response = await request(app).post('/login').send({
            username: 'newUser',
            password: 'newUserrsrs'
        })
        expect(response.statusCode).toBe(302)
    })

    test('Login to existing account,302', async() => {
        const response = await request(app).post('/login').send({
            username: 'test',
            password: 'test'
        })
        expect(response.statusCode).toBe(302)
    })

            //@@## Login Failed ##@@//

    test("Should respond with 403",async () => {
        const response = await request(app).post('/login').send({
            username: 'test',
            password: null,
        })
        expect(response.statusCode).toBe(400)
    })

    test('No username but password, 403', async() => {
        const response = await request(app).post('/login').send({
            username: null,
            password: 'test'
        })
        expect(response.statusCode).toBe(400)
    })


    afterAll(async () => {
        await sequelize.close()
      })

})