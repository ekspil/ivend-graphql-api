const {gql} = require("apollo-server")

const typeDefs = gql`

    scalar Timestamp

    type Controller {
        name: String!
        equipment: Equipment!
        uid: String!
        revision: Int!
        status: ControllerStatus!
        mode: ControllerMode!
        fiscalRegistrar: FiscalRegistrar
    }
    
    type BankTerminal {
        name: String
    }
    
    type FiscalRegistrar {
        name: String!
    }
    
    type Equipment {
        name: String
    }

    type ControllerError {
        id: Int
        message: String
    }

    type User {
        email: String!,
        phone: String
    }

    type Query {
        controller(uid: String!): Controller
        controllers: [Controller]
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
    
    type Mutation {
        registerUser(email: String!, password: String!): User
        createController(uid:String!, mode: String!): Controller
        createEquipment(input: CreateEquipmentInput): Equipment
        authController(uid:String!): String
        addErrorToController(uid:String!, message: String!): ControllerError
        #registerSale(input: SaleEventInput): Controller
        #registerStateUpdate(input: UpdateStateEventInput): Controller
    }

`

module.exports = typeDefs
