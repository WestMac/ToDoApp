const request = require('supertest')
const { sequelize } = require('../models')
const app = require('../app.js')
const FormData = require('form-data');

let token;
beforeAll((done) => {
    request(app)
        .post('/login')
        .send({
            username: 'test',
            password: 'test'
        })
        .end((err,response) =>{
            token = response.headers['set-cookie'][0]
            done();
        })
})


describe('Get All User list', () => {
    test('Get all user lists', async () => {
        const response = await request(app)
            .get('/list')
            .set('Cookie', token)
        

        expect(response.status).toBe(200)
    })
})

describe('Post new list', () => {
    test('Post new list', async () => {

        let formData = new FormData();
        formData.append('name', 'NewTestedList')
        
        const response = await request(app)
            .post('/list/addList')
            .set('Cookie', token)
            .send({
                name: 'NewTestCreateList'
            })


    
        expect(response.status).toBe(302)
    })
})

afterAll(async () => {
    await sequelize.close()
  })