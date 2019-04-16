const {gql} = require("apollo-server")

const typeDefs = gql`

    scalar Timestamp

    type Controller {
        id: Int!
        uid: String!
        status: ControllerStatus!
        mode: ControllerMode!
        readStatMode: ReadStatMode!
        bankTerminalMode: BankTerminalMode!
        fiscalizationMode: FiscalizationMode!
        revision: Revision!
        accessKey: String,
        lastState: ControllerState
        lastErrorTime: Timestamp
        errors: [ControllerError!]!
        services: [Service!]!
        machine: Machine
        firmwareId: String
        registrationTime: Timestamp
        user: User!
    }

    enum ReadStatMode {
        COINBOX
        MACHINE
        COINBOX_MACHINE
    }

    enum BankTerminalMode {
        NO_BANK_TERMINAL
        INPAS
        SBERBANK
    }

    enum FiscalizationMode {
        NO_FISCAL
        UNAPPROVED
        APPROVED
    }

    input Period {
        from: Timestamp!
        to: Timestamp!
    }


    type Deposit {
        id: Int!
        amount: Float!
        status: PaymentStatus!
        timestamp: Timestamp!
        redirectUrl: String!
    }

    enum PaymentStatus {
        SUCCEEDED
        CANCELLED
        PENDING
    }

    type SalesSummary {
        salesCount: Int!
        overallAmount: Int!
        cashAmount: Int!
        cashlessAmount: Int!
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
        uid: String!
        status: ControllerStatus!
        mode: ControllerMode!
        readStatMode: ReadStatMode!
        bankTerminalMode: BankTerminalMode!
        fiscalizationMode: FiscalizationMode!
        revisionId: Int!
        serviceIds: [Int!]
    }

    input EditControllerInput {
        status: ControllerStatus
        mode: ControllerMode
        readStatMode: ReadStatMode
        bankTerminalMode: BankTerminalMode
        fiscalizationMode: FiscalizationMode
        revisionId: Int
        serviceIds: [Int!]
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

    type Equipment {
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
        type: SaleType!
        item: Item!
        itemMatrix: ItemMatrix!
        controller: Controller!
        sqr: String
    }

    type ControllerError {
        id: Int!
        message: String!
        errorTime: Timestamp!
    }

    type Billing {
        balance: Float!
        deposits(period: Period): [Deposit!]!
        dailyBill: Float!
        daysLeft: Float!
    }

    type User {
        email: String!
        phone: String!
        role: String!
        notificationSettings: [NotificationSetting!]!
        legalInfo: LegalInfo
        billing: Billing!
        items: [Item!]!
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
        salesSummary(period: Period): SalesSummary
        lastSaleTime: Timestamp
    }

    type Revision {id: Int!
        name: String!
    }

    input CreateItemInput {
        name: String!
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
        errorTime: Timestamp!
    }

    input CreateEquipmentInput {
        name: String!
    }


    input ErrorEventInput {
        errorTime: Timestamp,
        message: String
    }

    input SaleEventInput {
        controllerUid: String!
        buttonId: Int!
        price: Float!
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
        code: String!
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
        mdb
        exe
        cashless
        cashless_free
        exe_ph
        mdb_D
        exe_D
        exe_ph_D
        cashless_D
        mdb_C
        exe_C
        exe_ph_C
        cashless_C
        ps_p
        ps_m_D
        ps_M_D
        ps_m_C
        ps_M_C
        mdb2
    }

    input AddButtonToItemMatrixInput {
        itemMatrixId: Int!
        buttonId: Int!
        itemId: Int!
    }

    input RemoveButtonFromItemMatrixInput {
        itemMatrixId: Int!
        buttonId: Int!
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

    type AvailableServices {
        controller: [Service!]!
    }

    type Service {
        id: Int!
        name: String!
        price: Float!
        billingType: BillingType!
    }

    enum BillingType {
        DAILY
        MONTHLY
    }

    type ExcelReport {
        url: String!
    }

    input GenerateExcelInput {
        rows: [RowDataInput!]!
    }

    input RowDataInput {
        cells: [String!]!
    }

    type MachineGroup {
        id: Int!
        name: String!
    }

    type MachineType {
        id: Int!
        name: String!
    }

    type Machine {
        id: Int!
        number: String!
        name: String!
        place: String!
        group: MachineGroup!
        equipment: Equipment!
        itemMatrix: ItemMatrix
        type: MachineType!
        salesSummary(period: Period): SalesSummary
        logs: [MachineLog!]!
        lastSaleTime: Timestamp
        controller: Controller
    }

    type MachineLog {
        type: String!
        message: String!
        time: Timestamp!
    }

    input CreateMachineInput {
        number: String!
        name: String!
        place: String!
        groupId: Int!
        typeId: Int!
        equipmentId: Int!
        controllerId: Int
    }

    input EditMachineInput {
        machineId: Int!
        number: String
        name: String
        place: String
        groupId: Int
        typeId: Int
        controllerId: Int
    }

    input CreateMachineGroupInput {
        name: String!
    }

    input CreateMachineTypeInput {
        name: String!
    }

    type Query {
        getController(id: Int!): Controller
        getControllerByUID(uid: String!): Controller
        getControllers: [Controller]
        getMachineById(id: Int!): Machine
        getMachines: [Machine]
        getMachineGroups: [MachineGroup]
        getMachineTypes: [MachineType]
        getEquipments: [Equipment]
        getRevisions: [Revision]
        getItemMatrix(id: Int!): ItemMatrix
        getProfile: User
        getAvailableServices: AvailableServices!
    }

    input AuthControllerInput {
        controllerUid: String!
        firmwareId: String!
    }
    
    input Registration1StepInput {
        phone: String!
    }

    type Mutation {
        authController(input: AuthControllerInput!): Controller
        registerControllerError(input: ControllerErrorInput!): ControllerError
        registerControllerState(input: ControllerStateInput!): Controller
        registerSale(input: SaleEventInput!): Sale
        registerUser(input: CreateUserInput!): User
        requestToken(input: RequestTokenInput!): String
        createEquipment(input: CreateEquipmentInput!): Equipment
        createController(input: CreateControllerInput!): Controller
        createMachine(input: CreateMachineInput!): Machine
        editMachine(input: EditMachineInput!): Machine
        createMachineType(input: CreateMachineTypeInput!): MachineType
        createMachineGroup(input: CreateMachineGroupInput!): MachineGroup
        createItem(input: CreateItemInput!): Item
        addButtonToItemMatrix(input: AddButtonToItemMatrixInput!): ItemMatrix
        removeButtonFromItemMatrix(input: RemoveButtonFromItemMatrixInput!): ItemMatrix
        createRevision(input: CreateRevisionInput!): Revision
        editController(id:Int, input: EditControllerInput!): Controller
        updateNotificationSetting(input: UpdateNotificationSettingInput!): NotificationSetting
        updateLegalInfo(input: LegalInfoInput!): LegalInfo
        requestDeposit(amount: Float!): Deposit
        generateExcel(input: GenerateExcelInput!): ExcelReport
        requestRegistrationSms(input: Registration1StepInput!): Timestamp
    }
`

module.exports = typeDefs
