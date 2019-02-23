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
        lastErrorTime: Timestamp
        itemSaleStats(period: Period): [ItemSalesStat!]!
        overallSalesSummary(period: Period): SalesSummary
        errors: [ControllerError!]!
    }

    input Period {
        from: Timestamp!
        to: Timestamp!
    }

    
    type Deposit {
        id: Int!
        amount: Float!
        status: PaymentStatus!
        redirectUrl: String!
    }
    
    enum PaymentStatus {
        SUCCEDED
        CANCELED
        PENDING
    }
    
    type ItemSalesStat {
        item: Item!
        salesSummary: SalesSummary!
        lastSaleTime: Timestamp!
    }

    type SalesSummary {
        salesCount: Int!
        overallAmount: Int!
        cashAmount: Int!
        cashlessAmount: Int!
    }

    type ControllerState {
        firmwareId: String!,
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
        type: SaleType!
        item: Item!
        itemMatrix: ItemMatrix!
        controller: Controller!
    }

    type ControllerError {
        id: Int!
        message: String!
        errorTime: Timestamp!
    }

    type User {
        email: String!
        phone: String!
        role: String!
        notificationSettings: [NotificationSetting!]!
        legalInfo: LegalInfo
    }

    type NotificationSetting {
        type: NotificationType!
        email: Boolean!
        sms: Boolean!
    }

    enum NotificationType {
        CONTROLLER_NO_CONNECTION
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
        firmwareId: String!
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
        errorTime: Timestamp!
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
        buttonId: Int!
        type: SaleType!
    }

    enum SaleType {
        CASH
        CASHLESS
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

    input UpdateNotificationSettingInput {
        type: NotificationType!
        email: Boolean!
        sms: Boolean!
    }

    type LegalInfo {
        companyName: String!
        city: String!
        actualAddress: String!
        inn: String!
        ogrn: String!
        legalAddress: String!
        director: String!
        directorPhone: String!
        directorEmail: String!
        contactPerson: String!
        contactPhone: String!
        contactEmail: String!
    }

    input LegalInfoInput {
        companyName: String!
        city: String!
        actualAddress: String!
        inn: String!
        ogrn: String!
        legalAddress: String!
        director: String!
        directorPhone: String!
        directorEmail: String!
        contactPerson: String!
        contactPhone: String!
        contactEmail: String!
    }

    type Query {
        getController(id: Int!): Controller
        getControllerByUID(uid: String!): Controller
        getControllers: [Controller]
        getEquipments: [Equipment]
        getRevisions: [Revision]
        getItemMatrix(id: Int!): ItemMatrix
        getProfile: User
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
        registerControllerError(input: ControllerErrorInput!): ControllerError
        registerControllerState(input: ControllerStateInput!): Controller
        registerSale(input: SaleEventInput!): Sale
        updateNotificationSetting(input: UpdateNotificationSettingInput!): NotificationSetting
        updateLegalInfo(input: LegalInfoInput!): LegalInfo
        requestDeposit(amount: Float!): Deposit
    }


`

module.exports = typeDefs
