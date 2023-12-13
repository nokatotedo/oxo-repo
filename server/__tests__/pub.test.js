const app = require('../app')
const request = require('supertest')
const { User, Lodging, Type } = require('../models/index')
const lodgings = require('../samples/jsons/lodgings.json')

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

  await Type.bulkCreate([
    {
      name: 'Economy'
    },
    {
      name: 'Premium'
    }
  ])

  await Lodging.bulkCreate(lodgings)
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

describe('GET /pub/lodgings', () => {
  test('should return list of lodgings', async () => {
    const response = await request(app).get('/pub/lodgings')
  
    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('page', 1)
    expect(response.body).toHaveProperty('count', 5)
    expect(response.body.lodgings).toBeInstanceOf(Array)
    expect(response.body.lodgings[0]).toHaveProperty('id', expect.any(Number))
    expect(response.body.lodgings[0]).toHaveProperty('name', expect.any(String))
    expect(response.body.lodgings[0]).toHaveProperty('facility', expect.any(String))
    expect(response.body.lodgings[0]).toHaveProperty('roomCapacity', expect.any(Number))
    expect(response.body.lodgings[0]).toHaveProperty('imgUrl', expect.any(String))
    expect(response.body.lodgings[0]).toHaveProperty('location', expect.any(String))
    expect(response.body.lodgings[0]).toHaveProperty('price', expect.any(Number))
    expect(response.body.lodgings[0]).toHaveProperty('typeId', expect.any(Number))
    expect(response.body.lodgings[0]).toHaveProperty('authorId', expect.any(Number))
  })

  test('should return list of lodgings with requirement', async () => {
    const response = await request(app).get('/pub/lodgings?typeId=2')

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('page', 1)
    expect(response.body).toHaveProperty('count', 5)
    expect(response.body.lodgings).toBeInstanceOf(Array)
    expect(response.body.lodgings[0]).toHaveProperty('id', expect.any(Number))
    expect(response.body.lodgings[0]).toHaveProperty('name', expect.any(String))
    expect(response.body.lodgings[0]).toHaveProperty('facility', expect.any(String))
    expect(response.body.lodgings[0]).toHaveProperty('roomCapacity', expect.any(Number))
    expect(response.body.lodgings[0]).toHaveProperty('imgUrl', expect.any(String))
    expect(response.body.lodgings[0]).toHaveProperty('location', expect.any(String))
    expect(response.body.lodgings[0]).toHaveProperty('price', expect.any(Number))
    expect(response.body.lodgings[0]).toHaveProperty('typeId', 2)
    expect(response.body.lodgings[0]).toHaveProperty('authorId', expect.any(Number))
  })

  test('should return list of lodgings in page 2', async () =>{
    const response = await request(app).get('/pub/lodgings?page=99')

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('page', 99)
    expect(response.body).toHaveProperty('count', 0)
    expect(response.body.lodgings).toBeInstanceOf(Array)
    expect(response.body.lodgings.length).toBe(0)
  })
})

describe('GET /pub/lodgings/:id', () => {
  test('should return details of lodging', async () => {
    const response = await request(app).get('/pub/lodgings/1')

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('id', 1)
    expect(response.body).toHaveProperty('name', expect.any(String))
    expect(response.body).toHaveProperty('facility', expect.any(String))
    expect(response.body).toHaveProperty('roomCapacity', expect.any(Number))
    expect(response.body).toHaveProperty('imgUrl', expect.any(String))
    expect(response.body).toHaveProperty('location', expect.any(String))
    expect(response.body).toHaveProperty('price', expect.any(Number))
    expect(response.body).toHaveProperty('typeId', expect.any(Number))
    expect(response.body).toHaveProperty('authorId', expect.any(Number))
  })
  
  test('should return 404 error (id not found)', async () => {
    const response = await request(app).get('/pub/lodgings/99')

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message', 'Error Not Found')
  })
})