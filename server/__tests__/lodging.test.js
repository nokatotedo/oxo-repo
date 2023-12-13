const app = require('../app')
const request = require('supertest')
const { User, Type } = require('../models/index')
const { verifyToken } = require('../helpers/jwt')
const fs = require('fs')

let req

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

beforeEach(() => {
  req = {
    name: "Singgahsana Raja",
    facility: "Bedcover",
    roomCapacity: 20,
    imgUrl: "https://placekitten.com/200/300",
    location: "Kerajaan Programmer",
    price: 100000,
    typeId: 1
  }
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

describe('POST /lodgings', () => {
  describe('with login', () => {
    let token
    let authorId

    beforeAll(async () => {
      const user = {
        username: 'AdminGanteng',
        password: 'panduganteng'
      }
      const response = await request(app).post('/login').send(user)

      token = response.body.access_token
      authorId = verifyToken(token).id
    })

    test('should be able to create lodging with authorId same as id user login', async () => {
      const response = await request(app).post('/lodgings').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(201)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('id', expect.any(Number))
      expect(response.body).toHaveProperty('name', req.name)
      expect(response.body).toHaveProperty('facility', req.facility)
      expect(response.body).toHaveProperty('roomCapacity', req.roomCapacity)
      expect(response.body).toHaveProperty('imgUrl', req.imgUrl)
      expect(response.body).toHaveProperty('location', req.location)
      expect(response.body).toHaveProperty('price', req.price)
      expect(response.body).toHaveProperty('typeId', req.typeId)
      expect(response.body).toHaveProperty('authorId', authorId)
    })

    test('should return 400 error (validation error)', async () => {
      delete req.facility
      delete req.name
      const response = await request(app).post('/lodgings').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', expect.any(String))
    })
  })

  describe('without login', () => {
    let token

    test('should return 401 error', async () => {
      const response = await request(app).post('/lodgings').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(401)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Invalid Token')
    })

    test('should return 401 error (random string access token)', async () => {
      const response = await request(app).post('/lodgings').send(req).set('Authorization', 'Bearer ' + 'asdfghjkl')

      expect(response.status).toBe(401)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Invalid Token')
    })
  })
})

describe('GET /lodgings', () => {
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

    test('should return list of lodgings', async () => {
      const response = await request(app).get('/lodgings').set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body[0]).toHaveProperty('id', expect.any(Number))
      expect(response.body[0]).toHaveProperty('name', expect.any(String))
      expect(response.body[0]).toHaveProperty('facility', expect.any(String))
      expect(response.body[0]).toHaveProperty('roomCapacity', expect.any(Number))
      expect(response.body[0]).toHaveProperty('imgUrl', expect.any(String))
      expect(response.body[0]).toHaveProperty('location', expect.any(String))
      expect(response.body[0]).toHaveProperty('price', expect.any(Number))
      expect(response.body[0]).toHaveProperty('typeId', expect.any(Number))
      expect(response.body[0]).toHaveProperty('authorId', expect.any(Number))

      expect(response.body[0].User).toHaveProperty('id', expect.any(Number))
      expect(response.body[0].User).toHaveProperty('username', expect.any(String))
      expect(response.body[0].User).toHaveProperty('role', expect.any(String))
      expect(response.body[0].User).toHaveProperty('phoneNumber', expect.any(String))
      expect(response.body[0].User).toHaveProperty('address', expect.any(String))
      expect(response.body[0].User).not.toHaveProperty('email')
      expect(response.body[0].User).not.toHaveProperty('password')
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

describe('GET /lodgings/:id', () => {
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

    test('should return details of lodging', async () => {
      const response = await request(app).get('/lodgings/1').set('Authorization', 'Bearer ' + token)

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

      expect(response.body.User).toHaveProperty('id', expect.any(Number))
      expect(response.body.User).toHaveProperty('username', expect.any(String))
      expect(response.body.User).toHaveProperty('role', expect.any(String))
      expect(response.body.User).toHaveProperty('phoneNumber', expect.any(String))
      expect(response.body.User).toHaveProperty('address', expect.any(String))
      expect(response.body.User).not.toHaveProperty('email')
      expect(response.body.User).not.toHaveProperty('password')
    })

    test('should return 404 error (id not found)', async () => {
      const response = await request(app).get('/lodgings/99').set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(404)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Error Not Found')
    })
  })

  describe('without login', () => {
    let token

    test('should return 401 error', async () => {
      const response = await request(app).get('/lodgings/1').set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(401)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Invalid Token')
    })

    test('should return 401 error (random string access token)', async () => {
      const response = await request(app).get('/lodgings/1').set('Authorization', 'Bearer ' + 'asdfghjkl')

      expect(response.status).toBe(401)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Invalid Token')
    })
  })
})

describe('PUT /lodgings/:id', () => {
  describe('login with admin user', () => {
    let token
    let authorId

    beforeAll(async () => {
      const user = {
        username: 'AdminGanteng',
        password: 'panduganteng'
      }
      const response = await request(app).post('/login').send(user)

      token = response.body.access_token
      authorId = verifyToken(token).id
    })

    test('should be able to update lodging', async () => {
      req.name = "Singgahsana Ratu"
      const response = await request(app).put('/lodgings/1').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('id', 1)
      expect(response.body).toHaveProperty('name', req.name)
      expect(response.body).toHaveProperty('facility', req.facility)
      expect(response.body).toHaveProperty('roomCapacity', req.roomCapacity)
      expect(response.body).toHaveProperty('imgUrl', req.imgUrl)
      expect(response.body).toHaveProperty('location', req.location)
      expect(response.body).toHaveProperty('price', req.price)
      expect(response.body).toHaveProperty('typeId', req.typeId)
      expect(response.body).toHaveProperty('authorId', authorId)
    })

    test('should return 404 error (id not found)', async () => {
      const response = await request(app).put('/lodgings/99').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(404)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Error Not Found')
    })

    test('should return 400 error (validation error)', async () => {
      req.facility = ''
      req.name = ''
      const response  = await request(app).put('/lodgings/1').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', expect.any(String))
    })
  })

  describe('login with staff user', () => {
    let token
    let authorId

    beforeAll(async () => {
      const user = {
        username: 'Naruto',
        password: 'narutokangenayah'
      }
      const response = await request(app).post('/login').send(user)

      token = response.body.access_token
      authorId = verifyToken(token).id
    })

    test('should be able to update lodging', async () => {
      await request(app).post('/lodgings').send(req).set('Authorization', 'Bearer ' + token)
      req.name = "Singgahsana Ratu"
      const response = await request(app).put(`/lodgings/2`).send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('id', 2)
      expect(response.body).toHaveProperty('name', req.name)
      expect(response.body).toHaveProperty('facility', req.facility)
      expect(response.body).toHaveProperty('roomCapacity', req.roomCapacity)
      expect(response.body).toHaveProperty('imgUrl', req.imgUrl)
      expect(response.body).toHaveProperty('location', req.location)
      expect(response.body).toHaveProperty('price', req.price)
      expect(response.body).toHaveProperty('typeId', req.typeId)
      expect(response.body).toHaveProperty('authorId', authorId)
    })

    test('should return 403 error (not owned by staff)', async () => {
      req.name = "Singgahsana Ratu"
      const response = await request(app).put('/lodgings/1').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(403)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Forbidden')
    })
  })

  describe('without login', () => {
    let token

    test('should return 401 error', async () => {
      const response = await request(app).put('/lodgings/1').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(401)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Invalid Token')
    })

    test('should return 401 error (random string access token)', async () => {
      const response = await request(app).put('/lodgings/1').send(req).set('Authorization', 'Bearer ' + 'asdfghjkl')

      expect(response.status).toBe(401)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Invalid Token')
    })
  })
})

describe('DELETE /lodgings/:id', () => {
  describe('login with admin user', () => {
    let token
    let authorId

    beforeAll(async () => {
      const user = {
        username: 'AdminGanteng',
        password: 'panduganteng'
      }
      const response = await request(app).post('/login').send(user)

      token = response.body.access_token
      authorId = verifyToken(token).id
    })

    test('should be able to delete lodging', async () => {
      req.name = "Singgahsana Ratu"
      await request(app).post('/lodgings').send(req).set('Authorization', 'Bearer ' + token)
      const response = await request(app).delete('/lodgings/3').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('id', 3)
      expect(response.body).toHaveProperty('name', req.name)
      expect(response.body).toHaveProperty('facility', req.facility)
      expect(response.body).toHaveProperty('roomCapacity', req.roomCapacity)
      expect(response.body).toHaveProperty('imgUrl', req.imgUrl)
      expect(response.body).toHaveProperty('location', req.location)
      expect(response.body).toHaveProperty('price', req.price)
      expect(response.body).toHaveProperty('typeId', req.typeId)
      expect(response.body).toHaveProperty('authorId', authorId)
    })

    test('should return 404 error (id not found)', async () => {
      const response = await request(app).delete('/lodgings/99').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(404)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Error Not Found')
    })
  })

  describe('login with staff user', () => {
    let token
    let authorId

    beforeAll(async () => {
      const user = {
        username: 'Naruto',
        password: 'narutokangenayah'
      }
      const response = await request(app).post('/login').send(user)

      token = response.body.access_token
      authorId = verifyToken(token).id
    })

    test('should be able to delete lodging', async () => {
      req.name = "Singgahsana Ratu"
      const response = await request(app).delete('/lodgings/2').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('id', 2)
      expect(response.body).toHaveProperty('name', req.name)
      expect(response.body).toHaveProperty('facility', req.facility)
      expect(response.body).toHaveProperty('roomCapacity', req.roomCapacity)
      expect(response.body).toHaveProperty('imgUrl', req.imgUrl)
      expect(response.body).toHaveProperty('location', req.location)
      expect(response.body).toHaveProperty('price', req.price)
      expect(response.body).toHaveProperty('typeId', req.typeId)
      expect(response.body).toHaveProperty('authorId', authorId)
    })

    test('should return 403 error (not owned by staff)', async () => {
      const response = await request(app).delete('/lodgings/1').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(403)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Forbidden')
    })
  })

  describe('without login', () => {
    let token

    test('should return 401 error', async () => {
      const response = await request(app).delete('/lodgings/1').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(401)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Invalid Token')
    })

    test('should return 401 error (random string access token)', async () => {
      const response = await request(app).delete('/lodgings/1').send(req).set('Authorization', 'Bearer ' + 'asdfghjkl')

      expect(response.status).toBe(401)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Invalid Token')
    })
  })
})

describe('PATCH /lodgings/:id', () => {
  let reqImage

  beforeEach(() => {
    reqImage = fs.readFileSync(`./samples/images/image_2.jpg`)
  })

  describe('login with admin user', () => {
    let token

    beforeAll(async () => {
      const user = {
        username: 'AdminGanteng',
        password: 'panduganteng'
      }
      const response = await request(app).post('/login').send(user)

      token = response.body.access_token
    })

    test('should be able to update lodging: imgUrl', async () => {
      const response = await request(app)
        .patch('/lodgings/1')
        .set('Authorization', 'Bearer ' + token)
        .attach('imgUrl', reqImage, 'image_2.jpg')
      
      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Image of Singgahsana Ratu success to update')
    })

    test('should return 404 error (id not found)', async () => {
      const response = await request(app)
        .patch('/lodgings/99')
        .set('Authorization', 'Bearer ' + token)
        .attach('imgUrl', reqImage, 'image_2.jpg')

      expect(response.status).toBe(404)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Error Not Found')
    })

    test('should return 400 error (no attach img)', async () => {
      const response = await request(app)
        .patch('/lodgings/1')
        .set('Authorization', 'Bearer ' + token)
        .attach('imgUrl')

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Validation Error')
    })
  })

  describe('login with staff user', () => {
    let token

    beforeAll(async () => {
      const user = {
        username: 'Naruto',
        password: 'narutokangenayah'
      }
      const response = await request(app).post('/login').send(user)

      token = response.body.access_token
    })

    test('should be able to update lodging: imgUrl', async () => {
      await request(app).post('/lodgings').send(req).set('Authorization', 'Bearer ' + token)
      const response = await request(app)
        .patch('/lodgings/4')
        .set('Authorization', 'Bearer ' + token)
        .attach('imgUrl', reqImage, 'image_2.jpg')

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Image of Singgahsana Raja success to update')
    })

    test('should return 403 error (not owned by staff)', async () => {
      const response = await request(app)
        .patch('/lodgings/1')
        .set('Authorization', 'Bearer ' + token)
        .attach('imgUrl', reqImage, 'image_2.jpg')

      expect(response.status).toBe(403)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Forbidden')
    })
  })

  describe('without login', () => {
    let token

    test('should return 401 error', async () => {
      const response = await request(app)
        .patch('/lodgings/1')
        .set('Authorization', 'Bearer ' + token)
        .attach('imgUrl', reqImage, 'image_2.jpg')

      expect(response.status).toBe(401)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Invalid Token')
    })

    test('should return 401 error (random string access token)', async () => {
      const response = await request(app)
        .patch('/lodgings/1')
        .set('Authorization', 'Bearer ' + 'asdfghjkl')
        .attach('imgUrl', reqImage, 'image_2.jpg')

      expect(response.status).toBe(401)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Invalid Token')
    })
  })
})