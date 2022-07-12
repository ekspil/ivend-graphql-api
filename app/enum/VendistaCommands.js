
function reset() {return {id: 51}}
function reload() {return {id: 2}}
function workMode(p1) {return {id: 5, parameter1: p1 || 0}}
function mdbCredit(p1) {return {id: 3, parameter1: p1 || 10000}}
function mdbTerminalMode(p1, p2, p3) {return {id: 8, parameter1: p1 || 2, parameter2: p2 || 100, parameter3: p3 || 2}}
function mdbAlwaysIdle(p1) {return {id: 43, parameter1: p1 || 1}}
function remotePin(p1, p2, p3, p4) {return {id: 38, parameter1: p1 || 0, parameter2: p2 || 2, parameter3: p3 || 20, parameter4: p4 || 1}}
function fixPaymentMode(p1) {return {id: 18, parameter1: p1 || 1}}



const Commands = {
    reset,
    reload,
    workMode,
    mdbCredit,
    mdbTerminalMode,
    mdbAlwaysIdle,
    remotePin,
    fixPaymentMode,
}

module.exports = Commands
