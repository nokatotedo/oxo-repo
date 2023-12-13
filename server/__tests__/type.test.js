const app = require('../app')
const request = require('supertest')
const { User, Type } = require('../models/index')

beforeAll(async () => {
  await User.bulkCreate([
    {
      username: 'AdminGanteng',
      email: 'gwanteng@gmail.com',
      password: 'panduganteng',
      phoneNumber: '+6283184628660',
      address: 'Kerajaan Programmer',
      role: 'admin'
    },
    {
      username: 'Naruto',
      email: 'uzumaki@gmail.com',
      password: 'narutokangenayah',
      phoneNumber: '+6281268329246',
      address: 'Kerajaan Programmer'
    }
  ], { individualHooks: true })

  await Type.create({
    name: 'Economy'
  })
})

afterAll(async () => {
  await User.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true
  })

  await Type.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true
  })
})

describe('GET /types', () => {
  describe('with login', () => {
    let token

    beforeAll(async () => {
      const user = {
        username: 'AdminGanteng',
        password: 'panduganteng'
      }
      const response = await request(app).post('/login').send(user)

      token = response.body.access_token
    })

    test('should return list of types', async () => {
      const response = await request(app).get('/types').set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body[0]).toHaveProperty('id', expect.any(Number))
      expect(response.body[0]).toHaveProperty('name', expect.any(String))
      expect(response.body[0]).toHaveProperty('createdAt', expect.any(String))
      expect(response.body[0]).toHaveProperty('updatedAt', expect.any(String))
    })
  })

  describe('without login', () => {
    let token

    test('should return 401 error', async () => {
      const response = await request(app).get('/lodgings').set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(401)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Invalid Token')
    })

    test('should return 401 error (random string access token)', async () => {
      const response = await request(app).get('/lodgings').set('Authorization', 'Bearer ' + 'asdfghjkl')

      expect(response.status).toBe(401)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Invalid Token')
    })
  })
})