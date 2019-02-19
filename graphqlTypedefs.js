const {gql} = require("apollo-server")

const typeDefs = gql`

    scalar Timestamp

    type Controller {
        id: Int!
        name: String!
        equipment: Equipment!
        uid: String!
        revision: Revision!
        status: ControllerStatus!
        mode: ControllerMode!
        fiscalRegistrar: FiscalRegistrar
        bankTerminal: BankTerminal
        accessKey: String,
        lastState: ControllerState
        itemMatrix: ItemMatrix!
        lastSaleTime: Timestamp
        saleStats(period: Period): [ItemSalesStat!]!
    }
    
    input Period {
        from: Timestamp!
        to: Timestamp!
    }
    
    type ItemSalesStat {
        item: Item!
        amount: Int!
    }

    type ControllerState {
        coinAcceptorStatus: BusStatus!,
        billAcceptorStatus: BusStatus!,
        coinAmount: Float!,
        billAmount: Float!,
        dex1Status: BusStatus!,
        dex2Status: BusStatus!,
        exeStatus: BusStatus!,
        mdbStatus: BusStatus!,
        signalStrength: SignalStrength!,
        registrationTime: Timestamp!
    }

    input CreateControllerInput {
        name: String!
        uid: String!
        equipmentId: Int!
        revisionId: Int!
        status: ControllerStatus!
        mode: ControllerMode!
        fiscalRegistrarId: Int
        bankTerminalId: Int
        itemMatrixId: Int
        serviceIds: [Int]
    }

    input CreateItemMatrixInput {
        controllerId: Int!,
        buttons: [CreateButtonItemInput!]!
    }

    input CreateButtonItemInput {
        buttonId: Int!
        itemName: String!,
        price: Float!
    }

    input EditControllerInput {
        name: String
        equipmentId: Int
        revisionId: Int
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

    type ItemMatrix {
        id: Int
        buttons: [ButtonItem!]!
    }

    type ButtonItem {
        buttonId: Int
        item: Item
    }

    type Sale {
        id: Int!
        buttonId: Int!
        item: Item!
        itemMatrix: ItemMatrix!
        controller: Controller!
    }

    type ControllerError {
        id: Int
        message: String
    }

    type User {
        email: String!,
        phone: String
    }

    type Item {
        id: Int,
        name: String!
        price: Float!
        user: User!
    }
    
    type Revision {
        id: Int!
        name: String!
    }

    input CreateItemInput {
        name: String!
        price: Float!
    }

    input ControllerStateInput {
        controllerUid: String!
        coinAcceptorStatus: BusStatus!,
        billAcceptorStatus: BusStatus!,
        coinAmount: Int!,
        billAmount: Int!,
        dex1Status: BusStatus!,
        dex2Status: BusStatus!,
        exeStatus: BusStatus!,
        mdbStatus: BusStatus!,
        signalStrength: SignalStrength!
    }

    input ControllerErrorInput {
        controllerUid: String!
        message: String!
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

    input SaleEventInput {
        controllerUid: String!
        buttonId: Int
    }
    
    input CreateUserInput {
        phone: String!
        email: String!
        password: String!
    }
    
    input RequestTokenInput {
        phone: String!
        password: String!
    }

    enum BusStatus {
        OK,
        DISABLED,
        ERROR
    }


    enum SignalStrength {
        BAD,
        GOOD,
        MEDIUM
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

    input CreateItemInItemMatrixInput {
        itemMatrixId: Int!,
        buttonId: Int!,
        itemName: String!,
        price: Float!
    }

    input CreateRevisionInput {
        name: String!
    }

    type Query {
        getController(id: Int!): Controller
        getControllerByUID(uid: String!): Controller
        getControllers: [Controller]
        getEquipments: [Equipment]
        getRevisions: [Revision]
        getItemMatrix(id: Int!): ItemMatrix
    }
    
    type Mutation {
        registerUser(input: CreateUserInput!): User
        requestToken(input: RequestTokenInput!): String
        createEquipment(input: CreateEquipmentInput!): Equipment
        createFiscalRegistrar(input: CreateFiscalRegistrarInput!): FiscalRegistrar
        createBankTerminal(input: CreateBankTerminalInput!): BankTerminal
        createController(input: CreateControllerInput!): Controller
        createItem(input: CreateItemInput!): Item
        createItemMatrix(input: CreateItemMatrixInput!): ItemMatrix
        createItemInItemMatrix(input: CreateItemInItemMatrixInput!): ItemMatrix
        createRevision(input: CreateRevisionInput!): Revision
        editController(id:Int, input: EditControllerInput!): Controller
        authController(uid:String!): Controller
        registerControllerError(input: ControllerErrorInput!): Controller
        registerControllerState(input: ControllerStateInput!): Controller
        registerSale(input: SaleEventInput!): Sale
    }


`

module.exports = typeDefs
