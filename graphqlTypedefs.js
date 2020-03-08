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
        machine: Machine
        firmwareId: String
        registrationTime: Timestamp
        user: User!
        connected: Boolean!
        remotePrinterId: String
        simCardNumber: String
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
        d200i_v
        d200i_t
        d200s_v
        d200s_t
        otiu_v
        otiu_t
        otit_v 
        otit_t
    }

    enum FiscalizationMode {
        NO_FISCAL
        UNAPPROVED
        APPROVED
    }

    enum SNO {
        osn
        usn_income
        usn_income_outcome
        envd
        esn
        patent
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

    type Pdf {
        url: String!
    }

    enum PaymentStatus {
        SUCCEEDED
        CANCELLED
        PENDING
        ADMIN_EDIT
    }

    type SalesSummary {
        salesCount: Int!
        overallAmount: Int!
        cashAmount: Int!
        cashlessAmount: Int!
    }

    type salesSum {
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
    }

    input EditControllerInput {
        status: ControllerStatus
        mode: ControllerMode
        readStatMode: ReadStatMode
        bankTerminalMode: BankTerminalMode
        fiscalizationMode: FiscalizationMode
        revisionId: Int
        remotePrinterId: String
        simCardNumber: String
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
        multiplier: Int
        item: Item
    }
    
    type Receipt {
        timestamp: Timestamp!
        status: ReceiptStatus!
        paymentType: SaleType!
    }
    
    enum ReceiptStatus {
        PENDING
        ERROR
        SUCCESS
    }

    type Sale {
        id: Int!
        type: SaleType!
        price: Float!
        item: Item!
        machine: Machine!
        receipt: Receipt
        sqr: String
        createdAt: Timestamp!
    }

    type ControllerError {
        id: Int!
        message: String!
        errorTime: Timestamp!
    }

    type Billing {
        userId: Int!
        balance: Float!
        deposits(period: Period): [Deposit!]!
        dailyBill: Float!
        daysLeft: Float!
    }

    type Kkt {
        id: Int!
        inn: String!
        companyName: String!
        kktModel: String
        kktFactoryNumber: String
        kktRegNumber: String
        kktFNNumber: String
        kktActivationDate: String
        kktBillsCount: Int
        kktOFDRegKey: String
        kktLastBill: String
        server: String
    }

    type User {
        email: String!
        id: Int!
        phone: String!
        role: String!
        notificationSettings: [NotificationSetting!]!
        legalInfo: LegalInfo
        billing: Billing!
        salesSummary(period: Period): SalesSummary
        items: [Item!]!
        kkts: [Kkt!]!
    }

    type NotificationSetting {
        type: NotificationType!
        email: Boolean!
        sms: Boolean!
        tlgrm: Boolean!
        telegram: String
        extraEmail: String
        telegramChat: String
    }

    enum NotificationType {
        CONTROLLER_NO_CONNECTION
        CONTROLLER_NO_SALES
        CONTROLLER_ENCASHMENT
        USER_LOW_BALANCE
        USER_WILL_BLOCK
        
    }

    type Item {
        id: Int,
        name: String!
        salesSummary(machineId: Int, machineGroupId: Int, period: Period): SalesSummary
        lastSaleTime: Timestamp
    }
    type ItemsSales {
        id: Int,
        name: String!
        salesSummary: salesSum
        lastSaleTime: Timestamp
    }
    type MachineSales {
        id: Int,
        name: String!
        salesSummary: salesSum
        lastSaleTime: Timestamp
    }

    type Revision {id: Int!
        name: String!
    }

    input CreateItemInput {
        name: String!
    }


    input CreateKktInput {
        kktModel: String!
        inn: String!
        companyName: String!

    }
    input EditKktInput {
        id: Int!
        inn: String!
        companyName: String!
        kktModel:  String!
        kktFactoryNumber:  String
        kktRegNumber:  String
        kktFNNumber:  String
        kktActivationDate:  String
        kktBillsCount: Int
        kktOFDRegKey:  String
        server:  String
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
        mdb1
        exe
        cashless
        cashless2
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
        ps_m_2
        ps_m_3
        rs232

    }

    input AddButtonToItemMatrixInput {
        itemMatrixId: Int!
        buttonId: Int!
        multiplier: Int!
        itemId: Int!
    }


    input EditButtonToItemMatrixInput {
        itemMatrixId: Int!
        buttonId: Int!
        multiplier: Int!
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
        tlgrm: Boolean!     
        extraEmail: String
        telegram: String
        telegramChat: String
    }
    input NotificationSettingTelegramChat {
        telegram: String
        telegramChat: String
    }
    
    input CreateNotificationSettingInput {
        type: NotificationType!
        email: Boolean!
        sms: Boolean!     
        tlgrm: Boolean!     
        telegram: String
        extraEmail: String
        telegramChat: String
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
        sno: SNO!
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
        sno: SNO!
    }
    
    type News {
        id: Int!
        active: Int!
        date: String!
        text: String!
        link: String
        header: String!
    }
    
    input NewsInput {
        id: Int
        active: Int!
        date: String!
        text: String!
        link: String
        header: String!
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

    type Encashment {
        id: Int!
        prevEncashment: Encashment
        timestamp: Timestamp!
        createdAt: Timestamp!
    }

    type EncashmentSalesSummary {
        encashment: Encashment!
        salesSummary: SalesSummary!
    }

    type Machine {
        id: Int!
        number: String!
        name: String!
        place: String!
        kktStatus: String
        terminalStatus: String
        error: String
        encashment: String
        group: MachineGroup!
        equipment: Equipment!
        itemMatrix: ItemMatrix
        type: MachineType!
        salesSummaryOfItem(itemId:Int, period: Period): SalesSummary
        salesSummary(machineGroupId: Int, period: Period): SalesSummary
        salesByEncashment(machineGroupId: Int): SalesSummary
        encashmentsSummaries: [EncashmentSalesSummary!]!
        logs: [MachineLog!]!
        lastSaleTime: Timestamp
        controller: Controller
        encashments: [Encashment!]!
        lastEncashment: Encashment
        kkt: Kkt
    }

    type MachineLog {
        message: String!
        type: MachineLogType!
        timestamp: Timestamp!
    }

    input CreateMachineInput {
        number: String!
        name: String!
        place: String!
        groupId: Int!
        typeId: Int!
        equipmentId: Int!
        controllerId: Int
        kktId: Int
    }

    input EditMachineInput {
        machineId: Int!
        number: String
        name: String
        place: String
        groupId: Int
        typeId: Int
        controllerId: Int
        kktId: Int
    }

    input CreateMachineGroupInput {
        name: String!
    }

    input CreateMachineTypeInput {
        name: String!
    }

    enum MachineLogType {
        CONNECTION
        COINACCEPTOR
        BILLACCEPTOR
        BUS_ERROR
        REGISTRATION
        ENABLED
    }

    type Query {
        getController(id: Int!): Controller
        getControllerByUID(uid: String!): Controller
        getControllers: [Controller]
        getAllControllers: [Controller]
        getMachineById(id: Int!): Machine
        getMachines: [Machine]
        getMachineGroups: [MachineGroup]
        getMachineTypes: [MachineType]
        getEquipments: [Equipment]
        getRevisions: [Revision]
        getItemMatrix(id: Int!): ItemMatrix
        getProfile: User
        getKktById(id: Int!): Kkt
        getUserKkts: [Kkt]
        getAllKkts: [Kkt]
        getAllUsers: [User]
        getLegalInfoByUserId(id: Int!): LegalInfo
        getSales(offset: Int!, limit: Int!, machineId: Int, itemId: Int): [Sale!]!
        getItemSales(machineGroupId: Int, period: Period): [ItemsSales]
        getMachineSales(machineGroupId: Int, period: Period): [MachineSales]
        getNews: [News]
        getNewsById(id: Int!): News
        getAllNews: [News]
    }

    input AuthControllerInput {
        controllerUid: String!
        firmwareId: String!
    }

    input Registration1StepInput {
        phone: String!
    }
    input ChangeUserBalanceInput {
        id: Int!
        sum: Float!
    }

    enum UserActionType {
        CONFIRM_EMAIL
        EDIT_EMAIL_CONFIRM
        EDIT_PASSWORD_CONFIRM
    }

    enum EventType {
        ENCASHMENT
    }
    
    input pdfInput {
    amount: Float!
    inn: String!
    companyName: String!
    }
    
    input UserActionConfirmation {
        token: String!
        type: UserActionType!
    }

    input RegisterEventInput {
        timestamp: Timestamp!
        controllerUid: String!
        eventType: EventType!
    }

    input RememberInput {
        phone: String!
        email: String!
    }

    input ChangePasswordInput {
        token: String!
        password: String!
    }

    type Mutation {
        authController(input: AuthControllerInput!): Controller
        registerControllerError(input: ControllerErrorInput!): ControllerError
        registerControllerState(input: ControllerStateInput!): Controller
        registerSale(input: SaleEventInput!): Sale
        registerEvent(input: RegisterEventInput!): Controller
        registerUser(input: CreateUserInput!): User
        editEmail(email: String!): Boolean
        editPassword(password: String!): Boolean
        confirmUserAction(input: UserActionConfirmation!): User
        requestToken(input: RequestTokenInput!): String
        createEquipment(input: CreateEquipmentInput!): Equipment
        createController(input: CreateControllerInput!): Controller
        deleteController(id: Int!): Machine
        createMachine(input: CreateMachineInput!): Machine
        editMachine(input: EditMachineInput!): Machine
        deleteMachine(id: Int!): Machine
        createMachineType(input: CreateMachineTypeInput!): MachineType
        createMachineGroup(input: CreateMachineGroupInput!): MachineGroup
        createItem(input: CreateItemInput!): Item
        addButtonToItemMatrix(input: AddButtonToItemMatrixInput!): ItemMatrix
        editButtonToItemMatrix(input: EditButtonToItemMatrixInput!): ItemMatrix
        removeButtonFromItemMatrix(input: RemoveButtonFromItemMatrixInput!): ItemMatrix
        createRevision(input: CreateRevisionInput!): Revision
        editController(id:Int, input: EditControllerInput!): Controller
        updateNotificationSetting(input: UpdateNotificationSettingInput!): NotificationSetting
        createNotificationSetting(input: CreateNotificationSettingInput!): NotificationSetting
        insertTelegramToNotificationSetting(input: NotificationSettingTelegramChat!): Boolean
        updateLegalInfo(input: LegalInfoInput!): LegalInfo
        requestDeposit(amount: Float!): Deposit
        generatePdf(input: pdfInput!): Pdf
        generateExcel(input: GenerateExcelInput!): ExcelReport
        requestRegistrationSms(input: Registration1StepInput!): Timestamp
        createKkt(input: CreateKktInput!): Kkt
        editKkt(input: EditKktInput!): Kkt
        kktPlusBill(fn: String!): Kkt
        deleteKkt(id: Int!): Boolean
        deleteNews(id: Int!): Boolean
        changeUserBalance(input: ChangeUserBalanceInput!): Float
        changeNews(input: NewsInput!): News
        createNews(input: NewsInput!): News
        rememberPasswordRequest(input: RememberInput!): Boolean
        changePasswordRequest(input: ChangePasswordInput!): Boolean
    }
`

module.exports = typeDefs
