
function reset() {return {id: 51}}
function reload() {return {id: 2}}
function workMode(p1) {return {id: 5, parameter1: p1 || 0}}
function mdbCredit(p1) {return {id: 3, parameter1: p1 || 10000}}
function mdbTerminalMode(p1, p2, p3) {return {id: 8, parameter1: p1 || 2, parameter2: p2 || 100, parameter3: p3 || 2}}
function mdbAlwaysIdle(p1) {return {id: 43, parameter1: p1 || 1}}
function remotePin(p1, p2, p3, p4) {return {id: 38, parameter1: p1 || 0, parameter2: p2 || 2, parameter3: p3 || 2, parameter4: p4 || 0}}
function priceForPulse(p1, p2, p3, p4, p5, p6) {return {id: 46, parameter1: p1 || 0, parameter2: p2 || 0, parameter3: p3 || 0, parameter4: p4 || 0, parameter5: p5 || 0, parameter6: p6 || 0}}
function sniffer(p1, p2, p3, p4, p5, p6, p7) {return {id: 54, parameter1: p1 || 5000, parameter2: p2 || 0, parameter3: p3 || 0, parameter4: p4 || 0, parameter5: p5 || 0, parameter6: p6 || 0, parameter7: p7 || 0}}
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
    priceForPulse,
    sniffer
}

module.exports = Commands
