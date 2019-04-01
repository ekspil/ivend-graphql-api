const Permission = {
    // BankTerminalService
    "CREATE_BANK_TERMINAL": "CREATE_BANK_TERMINAL",
    "FIND_BANK_TERMINAL_BY_ID": "FIND_BANK_TERMINAL_BY_ID",

    // BillingService
    "GET_SELF_DEPOSITS": "GET_SELF_DEPOSITS",
    "GET_DAILY_BILL": "GET_DAILY_BILL",
    "GET_DAYS_LEFT": "GET_DAYS_LEFT",
    "GET_BALANCE": "GET_BALANCE",
    "REQUEST_DEPOSIT": "REQUEST_DEPOSIT",

    // ControllerService
    "CREATE_CONTROLLER": "CREATE_CONTROLLER",
    "EDIT_CONTROLLER": "EDIT_CONTROLLER",
    "GET_ALL_CONTROLLERS": "GET_ALL_CONTROLLERS",
    "GET_ALL_CONTROLLERS_OF_CURRENT_USER": "GET_ALL_CONTROLLERS_OF_CURRENT_USER",
    "GET_CONTROLLER_BY_ID": "GET_CONTROLLER_BY_ID",
    "GET_CONTROLLER_BY_UID": "GET_CONTROLLER_BY_UID",
    "GET_CONTROLLER_ERRORS": "GET_CONTROLLER_ERRORS",
    "REGISTER_CONTROLLER_ERROR": "REGISTER_CONTROLLER_ERROR",
    "REGISTER_CONTROLLER_STATE": "REGISTER_CONTROLLER_STATE",
    "AUTH_CONTROLLER": "AUTH_CONTROLLER",

    // EquipmentService
    "CREATE_EQUIPMENT": "CREATE_EQUIPMENT",
    "FIND_EQUIPMENT_BY_ID": "FIND_EQUIPMENT_BY_ID",
    "GET_ALL_EQUIPMENTS": "GET_ALL_EQUIPMENTS",

    // FiscalRegistrarService
    "CREATE_FISCAL_REGISTRAR": "CREATE_FISCAL_REGISTRAR",
    "FIND_FISCAL_REGISTRAR_BY_ID": "FIND_FISCAL_REGISTRAR_BY_ID",

    // ItemMatrixService
    "CREATE_ITEM_MATRIX": "CREATE_ITEM_MATRIX",
    "ADD_BUTTON_ITEM_TO_ITEM_MATRIX": "ADD_BUTTON_ITEM_TO_ITEM_MATRIX",
    "REMOVE_BUTTON_ITEM_FROM_ITEM_MATRIX": "REMOVE_BUTTON_ITEM_FROM_ITEM_MATRIX",
    "GET_ITEM_MATRIX_BY_ID": "GET_ITEM_MATRIX_BY_ID",

    // ItemService
    "CREATE_ITEM": "CREATE_ITEM",
    "GET_ITEM_BY_ID": "GET_ITEM_BY_ID",
    "GET_USER_ITEMS": "GET_USER_ITEMS",

    // LegalInfoService
    "CREATE_LEGAL_INFO": "CREATE_LEGAL_INFO",
    "UPDATE_LEGAL_INFO": "UPDATE_LEGAL_INFO",

    // NotificationSettingsService
    "CREATE_NOTIFICATION_SETTING": "CREATE_NOTIFICATION_SETTING",
    "FIND_ALL_NOTIFICATION_SETTINGS": "FIND_ALL_NOTIFICATION_SETTINGS",
    "FIND_NOTIFICATION_SETTING_BY_TYPE": "FIND_NOTIFICATION_SETTING_BY_TYPE",
    "UPDATE_NOTIFICATION_SETTING": "UPDATE_NOTIFICATION_SETTING",

    // RevisionService
    "CREATE_REVISION": "CREATE_REVISION",
    "GET_ALL_REVISIONS": "GET_ALL_REVISIONS",
    "GET_REVISION_BY_ID": "GET_REVISION_BY_ID",

    // SaleService
    "CREATE_SALE": "CREATE_SALE",
    "REGISTER_SALE": "REGISTER_SALE",
    "GET_LAST_SALE": "GET_LAST_SALE",
    "GET_LAST_SALE_OF_ITEM": "GET_LAST_SALE_OF_ITEM",
    "GET_ITEM_SALE_STATS": "GET_ITEM_SALE_STATS",
    "GET_SALES_SUMMARY": "GET_SALES_SUMMARY",

    // ServiceService
    "CREATE_SERVICE": "CREATE_SERVICE",
    "FIND_SERVICE_BY_ID": "FIND_SERVICE_BY_ID",
    "GET_SERVICES_FOR_CONTROLLER": "GET_SERVICES_FOR_CONTROLLER",
    "GET_CONTROLLER_SERVICES": "GET_CONTROLLER_SERVICES",

    // UserService
    "GET_PROFILE": "GET_PROFILE",

    // MachineService
    "CREATE_MACHINE": "CREATE_MACHINE",
    "EDIT_MACHINE": "EDIT_MACHINE",
    "CREATE_MACHINE_GROUP": "CREATE_MACHINE_GROUP",
    "GET_MACHINE_BY_ID": "GET_MACHINE_BY_ID",
    "GET_MACHINE_BY_CONTROLLER_ID": "GET_MACHINE_BY_CONTROLLER_ID",
    "GET_ALL_SELF_MACHINES": "GET_ALL_SELF_MACHINES",
    "GET_MACHINE_GROUP_BY_ID": "GET_MACHINE_GROUP_BY_ID",
    "GET_ALL_SELF_MACHINE_GROUPS": "GET_ALL_SELF_MACHINE_GROUPS",
    "CREATE_MACHINE_TYPE": "CREATE_MACHINE_TYPE",
    "GET_MACHINE_TYPE_BY_ID": "GET_MACHINE_TYPE_BY_ID",
    "GET_ALL_MACHINE_TYPES": "GET_ALL_MACHINE_TYPES"

}

module.exports = Permission
