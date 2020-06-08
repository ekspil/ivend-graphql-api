const crypto = require("crypto")
const bcryptjs = require("bcryptjs")

const bcryptRounds = Number(process.env.BCRYPT_ROUNDS)

async function generateRandomAccessKey(length) {
    return new Promise((res, rej) => {
        const buf = Buffer.alloc(length || 16)
        crypto.randomFill(buf, 0, length || 16, (err, buf) => {
            if (err) {
                return rej(err)
            }

            res(buf.toString("hex"))
        })
    })

}

async function hashPassword(password) {
    return await bcryptjs.hash(password, bcryptRounds)
}

async function generateRandomFloor(min, max) {
    let rand = min + Math.random() * (max + 1 - min)
    return Math.floor(rand)
}



module.exports = {
    generateRandomAccessKey,
    hashPassword,
    generateRandomFloor
}
