


class ControllerPulseDTO {

    constructor({id, controllerId, a, b, c, o ,t, d, e, f, randomCommands}) {
        this.id = id
        this.controllerId = controllerId
        this.a = a
        this.b = b
        this.c = c
        this.o = o
        this.t = t
        this.d = d
        this.e = e
        this.f = f
        this.randomCommands = randomCommands
    }
}

module.exports = ControllerPulseDTO
