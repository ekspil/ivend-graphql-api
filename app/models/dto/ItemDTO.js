const UserDTO = require("./UserDTO")

class ItemDTO {

    constructor({id, name, price, user}) {
        this.id = id
        this.name = name
        this.price = price
        this.user = user ? new UserDTO(user) : null
    }
}

module.exports = ItemDTO
