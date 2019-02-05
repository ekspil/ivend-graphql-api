const UserDTO = require("./UserDTO")

class ItemMatrixDTO {

    constructor({id, buttons, user}) {
        this.id = id
        this.buttons = buttons
        this.user = user ? new UserDTO(user) : null
    }
}

module.exports = ItemMatrixDTO
