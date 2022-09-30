const express = require('express')
const speakeasy = require('speakeasy')
const uuid = require('uuid')
const sqlite3 = require('sqlite3').verbose()


const app = express()
app.use(express.json())

const db = new sqlite3.Database('./test.db')

app.get("/api", (req, res) => res.json({message: "Welcome! Use the /api/register to register and /api/2fauth to verify."}))

app.post('/api/register', (req, res) => {
    const id = uuid.v4()
    try {
        const tempSecret = speakeasy.generateSecret()
        let stmt = db.prepare(`INSERT INTO USERS (uuid, token) VALUES (?, ?)`)
        stmt.run(id, tempSecret.base32)
        res.json({id, secret: tempSecret.base32})
    } catch (error) {
        console.log("Error")
        res.status(500).json({message: 'Error generating secret'})
    }
})

// Verify token and make secret permanent
app.post('/api/2fauth', (req, res) => {
    const {token, userId} = req.body
    db.all(`SELECT COUNT(uuid) AS userAmount, uuid, token FROM users WHERE uuid = ?`, userId, (err, result) => {
        result = result[0]
        if (err) return res.status(500).json({message: "Error: " + err})
        if (result == undefined) return res.status(500).json({message: "Empty result."})
        if (result.userAmount == 0) {
            return res.status(500).json({message: "User not found"})
        } 
        const secret = result.token
        const verified = speakeasy.totp.verify({secret, encoding: "base32", token})

        if (!verified) {
            return res.status(401).json({message: "Not verified"})
        }

        return res.json({message: "Verified"})

    })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on ${PORT}`))
