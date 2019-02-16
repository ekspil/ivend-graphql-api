const crypto = require("crypto")

const keyLength = 16

async function generateRandomAccessKey() {
    return new Promise((res, rej) => {
        const buf = Buffer.alloc(keyLength)
        crypto.randomFill(buf, 0, keyLength, (err, buf) => {
            if (err) {
                return rej(err)
            }

            res(buf.toString("hex"))
        })
    })

}


module.exports = {
    generateRandomAccessKey
}
