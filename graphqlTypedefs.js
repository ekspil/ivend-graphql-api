const {gql} = require("apollo-server")

const typeDefs = gql`

    scalar Timestamp

    type Controller {
        id: Int!
        uid: String!
        imsi: String
        sim: String
        imsiTerminal: String
        services: [ControllerService!]
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
        cashless: String
        pulse: ControllerPulse
    }
    
    type ControllerService {
        id: Int!
        name: String!
        price: Float
        fixCount: Int
        billingType: String
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
        d200i
        d200s
        d200i_v
        d200i_t
        d200s_v
        d200s_t
        otiu_v
        otiu_t
        otit_v 
        otit_t
        vdk3_v
        vdk3_p
        vdk3_t
        vda1
        vdkl
        vdkx
        wvln
        
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

    type FiscalReceipt {
        id: Int!
        inn: String!
        companyName: String!
        legalAddress: String!
        email: String!
        itemType: String
        kpp: String
        sno: String
        place: String
        machineNumber: String
        sale: Sale!
        fnsSite: String!
        receiptDatetime: String!
        shiftNumber: String!
        fiscalReceiptNumber: String!
        fiscalDocumentNumber: String!
        ecrRegistrationNumber: String!
        fiscalDocumentAttribute: String!
        fnNumber: String!
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
        attentionRequired: Boolean,
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
        sim: String
        imsiTerminal: String
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
        machineTypeId: Int
    }

    type ItemMatrix {
        id: Int
        buttons: [ButtonItem!]!
    }

    type ButtonItem {
        buttonId: Int
        multiplier: Int
        type: String
        item: Item
    }
    
    type Receipt {
        id: Int!
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
        err: String
    }

    type SaleNoLimit {
        id: Int!
        type: SaleType!
        price: Float!
        item: Item!
        sqr: String
        createdAt: Timestamp!
        err: String
        status: String
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
        status: Int
        kktOFDRegKey: String
        kktLastBill: String
        kktStatus: String
        server: String
        action: String
        type: KktType
        rekassaPassword: String
        rekassaNumber: String
        rekassaKktId: String
        ofdName: String
    }

    type User {
        email: String!
        id: Int!
        step: Int
        autoSend: Boolean
        phone: String!
        role: String!
        companyName: String
        inn: String
        notificationSettings: [NotificationSetting!]!
        legalInfo: LegalInfo
        billing: Billing!
        salesSummary(period: Period): SalesSummary
        fastSummary: FastSummary
        items: [Item!]!
        kkts: [Kkt!]!
        partner: String
        partnerId: String
        controllers: [Controller!]!
        monthPay(period: Period): Float
        partnerFee(period: Period): Float
        vendors: [User!]!
        countryCode: String
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

    type FastSummary {
        amountToday: Int
        amountYesterday: Int
        countToday: Int
        countYesterday: Int
    }

    enum NotificationType {
        CONTROLLER_NO_CONNECTION
        CONTROLLER_NO_SALES
        CONTROLLER_ENCASHMENT
        USER_LOW_BALANCE
        USER_WILL_BLOCK
        GET_MONTH_SALES
        GET_WEEK_SALES
        GET_DAY_SALES
        GET_NEWS
        KKT_ERROR
        PINPAD_ERROR
        CASH_ACCEPTOR_ERROR
        MACHINE_ATTENTION_REQUIRED
        NO_CASH_24H
        NO_COINS_24H
        NO_CASHLESS_24H
        NO_RECEIPT_24H
        ALARM_SMS
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
        rekassaNumber: String
        rekassaPassword: String
        type: KktType

    }
    
    enum KktType {
        umka
        rekassa
        telemedia
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
        type: KktType
        rekassaNumber: String
        rekassaPassword: String
        rekassaKktId: String
        ofdName: String
    }

    input ControllerStateInput {
        controllerUid: String!
        coinAcceptorStatus: BusStatus!,
        billAcceptorStatus: BusStatus!,
        coinAmount: Int!,
        billAmount: Int!,
        attentionRequired: Int,
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
        machineTypeId: Int
    }


    input ErrorEventInput {
        errorTime: Timestamp,
        message: String
    }

    input TariffInput {
        telemetry: Float!
        acquiring: Float!
        fiscal: Float!
        partnerId: Int
        meta: String
        startedAt: Timestamp!
        
    }

    type Tariff {
        id: Int!
        telemetry: Float!
        acquiring: Float!
        fiscal: Float!
        partnerId: Int
        meta: String
        startedAt: Timestamp!
        
    }

    input SaleEventInput {
        controllerUid: String!
        buttonId: Int!
        price: Float!
        type: SaleType!
        timestamp: Timestamp
    }

    enum SaleType {
        CASH
        CASHLESS
    }

    input CreateUserInput {
        phone: String!
        countryCode: String!
        email: String!
        password: String!
        code: String!
        partnerId: Int
    }
    
    input UpdateUserInput {
        id: Int!
        phone: String!
        email: String!
        password: String
        role: String!
        partnerId: Int
    }

    input RequestTokenInput {
        phone: String!
        password: String!
    }
    
    input RequestTokenAdminInput {
        phone: String!
        sms: String!
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
        type: String
        itemId: Int!
    }


    input EditButtonToItemMatrixInput {
        itemMatrixId: Int!
        buttonId: Int!
        multiplier: Int!
        type: String
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
        companyName: String
        city: String
        actualAddress: String
        inn: String
        timeZone: String
        kpp: String
        ogrn: String
        legalAddress: String
        director: String
        directorPhone: String
        directorEmail: String
        contactPerson: String
        contactPhone: String
        contactEmail: String
        sno: SNO
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
        timeZone: String!
        kpp: String
    }
    input LegalInfoToUserInput {
        userId: Int!
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
        timeZone: String!
        kpp: String
    }
    
    type News {
        id: Int!
        active: Int!
        date: String!
        text: String!
        link: String
        header: String!
    }    
    
    type Instr {
        id: Int!
        active: Int!
        date: String!
        text: String!
        link: String
        header: String!
    }    
    
    type Info {
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
    
    input InstrInput {
        id: Int
        active: Int!
        date: String!
        text: String!
        link: String
        header: String!
    }    
    
    input InfoInput {
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
    
    scalar _Any

    input RowDataInput {
        cells: [_Any]
    }

    type MachineGroup {
        id: Int
        name: String
    }

    type MachineType {
        id: Int!
        name: String!
    }

    type Encashment {
        id: Int!
        sum: Int
        prevEncashment: Encashment
        timestamp: Timestamp!
        createdAt: Timestamp!
    }

    type EncashmentSalesSummary {
        encashment: Encashment!
        salesSummary: SalesSummary!
    }

    type EncashmentSalesSummaryFast {
        encashmentsAmount: Int!
    }

    type Machine {
        id: Int!
        number: String!
        name: String!
        place: String!
        kktStatus: String
        terminalStatus: String
        coinCollectorStatus: String
        banknoteCollectorStatus: String
        error: String
        encashment: String
        group: MachineGroup!
        group2: MachineGroup
        group3: MachineGroup
        equipment: Equipment!
        itemMatrix: ItemMatrix
        type: MachineType!
        salesSummaryOfItem(itemId:Int, period: Period): SalesSummary
        machineItemSales(period: Period): [MachineItemSales]
        salesSummary(machineGroupId: Int, period: Period): SalesSummary
        salesByEncashment(machineGroupId: Int): SalesSummary
        encashmentsSummaries(interval: Period): [EncashmentSalesSummary!]!
        logs(type: MachineLogType, period: Period): [MachineLog!]!
        lastSaleTime: Timestamp
        controller: Controller
        encashments(period: Period): [Encashment!]!
        lastEncashment: Encashment
        kkt: Kkt
        cashInMachine: Int!
    }
    
    type MachineItemSales {
        id: Int!
        name: String!
        lastSaleTime: Timestamp
        salesSummary: SalesSummary
    }

    type MachineLog {
        message: String!
        type: MachineLogType!
        timestamp: Timestamp!
    }

    type ControllerIntegration {
        id: Int!
        type: String!
        imei: String
        controllerId: Int
        controllerUid: String
    }

    input ControllerIntegrationInput {
        id: Int!
        controllerUid: String!
    }

    type AdminStatistic {
        id: Int!
        billingAmount: Float!
        billingBalance: Float!
        billingCredit: Float!

        controllersCount: Int!
        controllersDisabled: Int!
        controllersDisconnected: Int!

        kktsCount: Int!
        kktsNormal: Int!
        kktsError: Int!
        
        simExpense: Float
        simTraffic: Float
        simCount: Int

        informationStatus: Boolean!
    }

    input CreateMachineInput {
        number: String!
        name: String!
        place: String!
        groupId: Int!
        group2Id: Int
        group3Id: Int
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
        group2Id: Int
        group3Id: Int
        typeId: Int
        equipmentId: Int
        controllerId: Int
        kktId: Int
    }

    input GroupEditMachineInput {
        place: String
        typeId: Int
        equipmentId: Int
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
        KKT
        BUS_ERROR
        REGISTRATION
        ENABLED
        ALL
        TERMINAL
        ENCASHMENT
        SIM_CONTROLLER
    }

    type Query {
        getController(id: Int!): Controller
        getControllerUIDByIMEI(imei: String!): String
        getControllerByUID(uid: String!): Controller
        getControllers: [Controller]
        getControllerIntegrations: [ControllerIntegration]
        getAllControllers(offset: Int, limit: Int, status: String, connection: String, terminal: String, fiscalizationMode: String, bankTerminalMode: String, printer: String, registrationTime: String, terminalStatus: String, orderDesc: Boolean, orderKey: String, userRole: String  ): [Controller]
        getMachineById(id: Int!): Machine
        getMachines(machineGroupId: Int): [Machine]
        getMachineGroups: [MachineGroup]
        getMachineTypes: [MachineType]
        getEquipments: [Equipment]
        getRevisions: [Revision]
        getItemMatrix(id: Int!): ItemMatrix
        getProfile: User
        getKktById(id: Int!): Kkt
        getUserKkts: [Kkt]
        getAllKkts(offset: Int, limit: Int, status: Int): [Kkt]
        getAllUsers(input: AllUsersInput, orderDesc: Boolean, orderKey: String ): [User]
        getLegalInfoByUserId(id: Int!): LegalInfo
        getSales(offset: Int!, limit: Int!, machineId: Int, itemId: Int, period: Period): [Sale!]!
        getSalesNoLimit( machineId: Int, itemId: Int, period: Period): [SaleNoLimit!]!
        getItemSales(machineGroupId: Int, period: Period): [ItemsSales]
        getMachineSales(machineGroupId: Int, period: Period): [MachineSales]
        getNews: [News]
        getNewsById(id: Int!): News
        getAllNews: [News]
        getInfo: [Info]
        getInfoById(id: Int!): Info
        getAllInfo: [Info]
        getAllSims(input: AllSimsInput): [Sim]
        getInstr: [Instr]
        getInstrById(id: Int!): Instr
        getAllInstr: [Instr]
        getPartnerFee(userId: Int!): PartnerFee
        getAdminStatistic: AdminStatistic
        getFiscalReceipt(receiptId: String!): FiscalReceipt!
        getTariffs(partnerId: Int): [Tariff]
        getTariff(partnerId: Int!): Tariff
        getPartnerInfo(partnerId: Int!): PartnerInfo
        getAllBills(input: AllBillsInput): [BankPayment!]!
    }
    
    type BankPayment {
        id: Int
        applied: Boolean
        meta: String
        userId: Int
        startedAt: Timestamp
        createdAt: Timestamp
        userName: String
        userInn: String
    }

    input AuthControllerInput {
        controllerUid: String!
        firmwareId: String!
        imsi: String
    }
    input AllUsersInput {
        role: String
        userId: Int
        limit: Int
        offset: Int
    }
    input AllSimsInput {
        limit: Int
        offset: Int
        status: String
        search: String
    }

    input AllBillsInput {
        period: Period
        limit: Int
        offset: Int
        status: String
        search: String
    }

    input Registration1StepInput {
        phone: String!
        countryCode: String!
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
    services: String!
    prefix: String    
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

    input EmailInput {
        category: String!
        title: String!
        text: String
    }
    
    input UpdatePrinter {
        controllerId: Int!
        printerId: String!
    }
    
    input ChangePartnerFeeInput {
        userId: Int!
        kkmFee: Float!
        terminalFee: Float!
        controllerFee: Float!
    }
    
    type PartnerFee {
        userId: Int!
        kkmFee: Float!
        terminalFee: Float!
        controllerFee: Float!
    }
    
    type Sim {
    
        userId: Int
        controllerId: Int
        terminalId: Int
        number: String!
        phone: String
        terminal: String
        controllerUid: String
        imsi: String!
        traffic: Float
        expense: Float
        userName: String
        
    }
    
    type PartnerInfo {
        partnerId: Int!
        fileLogo: String
        fileOferta: String
        infoPhoneTech: String
        infoMailTech: String
        infoPhoneCom: String
        infoRequisites: String
    }
    
    input PartnerInfoInput {
        partnerId: Int!
        fileLogo: String
        fileOferta: String
        infoPhoneTech: String
        infoMailTech: String
        infoPhoneCom: String
        infoRequisites: String
    }

    
    input TelemetronEventInput {
        imei: String!
        time: String!
        s: String!
        mdb: String
        iccid: String
        reason: String
        qlt: String
        bat: String
        exe: String
        mdb_product: String
    }  
      
    type TelemetronEvent{
        imei: String!
        time: String!
        s: String!
        mdb: String
        iccid: String
        reason: String
        qlt: String
        bat: String
        exe: String
        mdb_product: String
    }
    
    type ControllerPulse {
        id: Int
        controllerId: Int
        a: Int
        b: Int
        c: Int
        o: Int
        t: Int
    }

    
    input ControllerPulseInput {
        controllerId: Int!
        a: Int
        b: Int
        c: Int
        o: Int
        t: Int
    }

    type Mutation {
        telemetronEvent(input: TelemetronEventInput!): TelemetronEvent
        updateControllerIntegration(input: ControllerIntegrationInput!): ControllerIntegration
        setControllerPulse(input: ControllerPulseInput!): ControllerPulse
        sendNewsSMS(id: Int!): Boolean
        reSendCheck(id: Int!): Boolean
        sendNewsEmail(id: Int!): Boolean
        sendEmail(input: EmailInput!): Boolean
        updatePrinterOnController(input: UpdatePrinter!): Boolean
        randomAction: Boolean
        removeDeposit(id: Int!): Boolean
        deleteMachineGroup(id: Int!): Boolean
        userAutoSend(value: Boolean!): Boolean
        authController(input: AuthControllerInput!): Controller
        registerControllerError(input: ControllerErrorInput!): ControllerError
        registerControllerState(input: ControllerStateInput!): Controller
        registerSale(input: SaleEventInput!): Sale
        registerEvent(input: RegisterEventInput!): Controller
        registerUser(input: CreateUserInput!): User
        updateUser(input: UpdateUserInput!): User
        editEmail(email: String!): Boolean
        editPassword(password: String!): Boolean
        confirmUserAction(input: UserActionConfirmation!): User
        closeUser(id: Int!): User
        requestToken(input: RequestTokenInput!): String
        requestTokenAdmin(input: RequestTokenAdminInput!): String
        createEquipment(input: CreateEquipmentInput!): Equipment
        createController(input: CreateControllerInput!): Controller
        deleteController(id: Int!): Machine
        createMachine(input: CreateMachineInput!): Machine
        editMachine(input: EditMachineInput!): Machine
        editMachineGroupSettings(id:Int, input: GroupEditMachineInput!): Boolean
        deleteMachine(id: Int!): Machine
        createMachineType(input: CreateMachineTypeInput!): MachineType
        createMachineGroup(input: CreateMachineGroupInput!): MachineGroup
        createItem(input: CreateItemInput!): Item
        addButtonToItemMatrix(input: AddButtonToItemMatrixInput!): ItemMatrix
        editButtonToItemMatrix(input: EditButtonToItemMatrixInput!): ItemMatrix
        removeButtonFromItemMatrix(input: RemoveButtonFromItemMatrixInput!): ItemMatrix
        createRevision(input: CreateRevisionInput!): Revision
        editController(id:Int, input: EditControllerInput!): Controller
        editControllerGroupSettings(id:Int, input: EditControllerInput!): Boolean
        updateNotificationSetting(input: UpdateNotificationSettingInput!): NotificationSetting
        createNotificationSetting(input: CreateNotificationSettingInput!): NotificationSetting
        insertTelegramToNotificationSetting(input: NotificationSettingTelegramChat!): Boolean
        updateLegalInfo(input: LegalInfoInput!): LegalInfo
        updateLegalInfoToUser(input: LegalInfoToUserInput!): LegalInfo
        requestDeposit(amount: Float!): Deposit
        generatePdf(input: pdfInput!): Pdf
        generateExcel(input: GenerateExcelInput!): ExcelReport
        requestRegistrationSms(input: Registration1StepInput!): Timestamp
        createKkt(input: CreateKktInput!): Kkt
        editKkt(input: EditKktInput!): Kkt
        kktPlusBill(fn: String!): Kkt
        deleteKkt(id: Int!): Boolean
        userDeleteKkt(id: Int!): Boolean
        changeUserBalance(input: ChangeUserBalanceInput!): Float
        deleteNews(id: Int!): Boolean
        changeNews(input: NewsInput!): News
        createNews(input: NewsInput!): News
        deleteInfo(id: Int!): Boolean
        changeInfo(input: InfoInput!): Info
        createInfo(input: InfoInput!): Info
        deleteInstr(id: Int!): Boolean
        changeInstr(input: InstrInput!): Instr
        createInstr(input: InstrInput!): Instr
        rememberPasswordRequest(input: RememberInput!): Boolean
        changePasswordRequest(input: ChangePasswordInput!): Boolean
        changePartnerFee(input: ChangePartnerFeeInput!): PartnerFee
        createTariff(input: TariffInput!): Tariff
        updatePartnerInfo(input: PartnerInfoInput!): PartnerInfo
        simReset(sim: String!): Boolean
    }
`


module.exports = typeDefs
