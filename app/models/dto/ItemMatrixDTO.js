const UserDTO = require("./UserDTO")
const ButtonItemDTO = require("./ButtonItemDTO")

class ItemMatrixDTO {

    constructor({id, buttons, user}) {
        this.id = id
        this.buttons = buttons ? buttons.map(button => (new ButtonItemDTO(button))) : null
        this.user = user ? new UserDTO(user) : null
    }
}

module.exports = ItemMatrixDTO
