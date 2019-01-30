const { gql } = require("apollo-server")

const typeDefs = gql`

    scalar Timestamp

    type Controller {
        id: Int!
        name: String!
        equipment: Equipment!
        uid: String!
        revision: Int!
        status: ControllerStatus!
        mode: ControllerMode!
        fiscalRegistrar: FiscalRegistrar
        bankTerminal: BankTerminal
    }

    input CreateControllerInput {
        name: String!
        equipmentId: Int!
        uid: String!
        revision: Int!
        status: ControllerStatus!
        mode: ControllerMode!
        fiscalRegistrarId: Int
        bankTerminalId: Int
    }

    input EditControllerInput {
        name: String
        equipmentId: Int
        revision: Int
        status: ControllerStatus
        mode: ControllerMode
        fiscalRegistrarId: Int
        bankTerminalId: Int
    }

    type Equipment {
        id: Int!
        name: String!
    }

    type FiscalRegistrar {
        id: Int!
        name: String!
    }

    type BankTerminal {
        id: Int!
        name: String!
    }

    type ControllerError {
        id: Int
        message: String
    }

    type User {
        email: String!,
        phone: String
    }

    type SaleEvent {
        saleTime: Timestamp
        createTime: Timestamp,
    }

    input SaleItemInput {
        id: Int
    }

    input SaleEventInput {
        saleTime: Timestamp
        items: [SaleItemInput!]!
    }

    input UpdateStateEventInput {
        coinAcceptor: BusStatus,
        billAcceptor: BusStatus,
        coinAmount: Float,
        billAmount: Float,
        dex1Status: BusStatus,
        dex2Status: BusStatus,
        exeStatus: BusStatus,
        mdbStatus: BusStatus
    }
    
    input CreateEquipmentInput {
        name: String!
    }

    input CreateFiscalRegistrarInput {
        name: String!
    }

    input CreateBankTerminalInput {
        name: String!
    }

    input ErrorEventInput {
        errorTime: Timestamp,
        message: String
    }

    enum BusStatus {
        OK,
        DISABLED,
        ERROR
    }

    enum ControllerStatus {
        ENABLED
        DISABLED
        TRAINING
        PAUSED
        DEBUG
    }

    enum ControllerMode {
        MDB
        EXE
        CASHLESS
    }


    type Query {
        getController(id: Int): Controller
        getControllers: [Controller]
    }

    type Mutation {
        registerUser(email: String!, password: String!): User
        createEquipment(input: CreateEquipmentInput!): Equipment
        createFiscalRegistrar(input: CreateFiscalRegistrarInput!): FiscalRegistrar
        createBankTerminal(input: CreateBankTerminalInput!): BankTerminal
        createController(input: CreateControllerInput!): Controller
        editController(id:Int, input: EditControllerInput!): Controller
        authController(uid:String!): String
        addErrorToController(uid:String!, message: String!): ControllerError
        #registerSale(input: SaleEventInput): Controller
        #registerStateUpdate(input: UpdateStateEventInput): Controller
   }
   

`

module.exports = typeDefs
