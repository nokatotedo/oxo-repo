const express = require('express')
const app = express()
const cors = require('cors')

const index = require('./routers/index')

app.use(cors())
app.use(express.json());

app.use(index)

module.exports = app