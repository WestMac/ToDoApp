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

describe('List actions', () => {
    test('Post new list', async () => {
        const response = await request(app)
            .post('/list/addList')
            .set('Cookie', token)
            .send({
                name: 'NewTestCreateList'
            })
            expect(response.status).toBe(302)
        })

    test('Post new list item', async () => {
        const response = await request(app)
            .post(`/list/4`)
            .set('Cookie', token)
            .send({
                toDo: 'NewTestListItem'
            })
        expect(response.status).toBe(302)
    })

    test('Post new list item/ should failed', async () => {
        const response = await request(app)
            .post(`/list/6`)
            .set('Cookie', token)
            .send({
                toDo: 'NewTestListItem'
            })
        expect(response.status).toBe(403)
    })

})



afterAll(async () => {
    await sequelize.close()
  })