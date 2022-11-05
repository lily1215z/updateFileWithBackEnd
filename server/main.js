const express = require('express')
const cors = require('cors')
const fs = require('fs')

const app = express()

app.use(cors())

app.get("/file", (req, res) => {
    // return res.send('HELLO')
    return fs.createReadStream('./hello.txt').pipe(res)
})

app.post('/file', (req, res) => {
    console.log(req)
    return res.send('ok')
})

app.listen(8000, () => {  //8000 - it's port
    console.log('Started')
})