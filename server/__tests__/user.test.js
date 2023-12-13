const app = require('../app')
const request = require('supertest')
const { User } = require('../models/index')

beforeAll(async () => {
  await User.create({
    username: 'AdminGanteng',
    email: 'gwanteng@gmail.com',
    password: 'panduganteng',
    phoneNumber: '+6283184628660',
    address: 'Kerajaan Programmer',
    role: 'admin'
  })
})

afterAll(async () => {
  await User.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true
  })
})

describe('POST /login', () => {
  let req

  beforeEach(() => {
    req = {
      username: 'AdminGanteng',
      password: 'panduganteng'
    }
  })

  test('should be able to login', async () => {
    const response = await request(app).post('/login').send(req)

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('access_token', expect.any(String))
  })

  test('should return 400 error (null username)', async () => {
    delete req.username
    const response = await request(app).post('/login').send(req)

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message', 'Validation Error')
  })

  test('should return 400 error (null password)', async () => {
    delete req.password
    const response = await request(app).post('/login').send(req)

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message', 'Validation Error')
  })

  test('should return 401 error (invalid username)', async () => {
    req.username = "GantengAdmin"
    const response = await request(app).post('/login').send(req)

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message', 'Invalid Username/Password')
  })

  test('should return 401 error (invalid password)', async () => {
    req.password = "gantengpandu"
    const response = await request(app).post('/login').send(req)

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message', 'Invalid Username/Password')
  })
})

describe('POST /register', () => {
  let req

  beforeEach(() => {
    req = {
      username: 'RajaKegelapan',
      email: 'kingshadow@gmail.com',
      password: 'kingshadow',
      phoneNumber: '+621268329246',
      address: 'Kerajaan Programmer'
    }
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

    test('should be able to create user', async () => {
      const response = await request(app).post('/register').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(201)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).not.toHaveProperty('id')
      expect(response.body).not.toHaveProperty('email')
      expect(response.body).not.toHaveProperty('password')
      expect(response.body).not.toHaveProperty('role')
      expect(response.body).toHaveProperty('username', req.username)
      expect(response.body).toHaveProperty('phoneNumber', req.phoneNumber)
      expect(response.body).toHaveProperty('address', req.address)
    })

    test('should return 400 error (null email)', async () => {
      delete req.email
      const response = await request(app).post('/register').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Email is required.')
    })

    test('should return 400 error (null password)', async () => {
      delete req.password
      const response = await request(app).post('/register').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Password is required.')
    })

    test('shoud return 400 error (empty email)', async () => {
      req.email = ""
      const response = await request(app).post('/register').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Email is required.')
    })

    test('should return 400 error (empty password)', async () => {
      req.password = ""
      const response = await request(app).post('/register').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Password is required.')
    })

    test('should return 400 error (unique email)', async () => {
      req.username = "Raja Kegelapan"
      const response = await request(app).post('/register').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Email already exists.')
    })

    test('should return 400 error (invalid format email)', async () => {
      req.username = "Raja Kegelapan"
      req.email = "gwanteng"
      const response = await request(app).post('/register').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Email is not valid.')
    })
  })

  describe('login with staff user', () => {
    let token

    beforeAll(async () => {
      const user = {
        username: 'RajaKegelapan',
        password: 'kingshadow'
      }
      const response = await request(app).post('/login').send(user)

      token = response.body.access_token
    })

    test('should return 403 error', async () => {
      const response = await request(app).post('/register').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(403)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Forbidden')
    })
  })

  describe('without login', () => {
    let token

    test('should return 401 error', async () => {
      const response = await request(app).post('/register').send(req).set('Authorization', 'Bearer ' + token)

      expect(response.status).toBe(401)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Invalid Token')
    })

    test('should return 401 error (random string access token)', async () => {
      const response = await request(app).post('/register').send(req).set('Authorization', 'Bearer ' + 'asdfghjkl')

      expect(response.status).toBe(401)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', 'Invalid Token')
    })
  })
})