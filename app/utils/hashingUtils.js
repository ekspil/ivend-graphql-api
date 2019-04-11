const crypto = require("crypto")

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


module.exports = {
    generateRandomAccessKey
}
