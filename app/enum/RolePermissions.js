const Permission = require("./Permission")

const RolePermissions = {
    "USER": [
        Permission.FIND_BANK_TERMINAL_BY_ID,
        Permission.GET_SELF_DEPOSITS,
        Permission.GET_DAILY_BILL,
        Permission.GET_DAYS_LEFT,
        Permission.GET_BALANCE,
        Permission.REQUEST_DEPOSIT,
        Permission.CREATE_CONTROLLER,
        Permission.EDIT_CONTROLLER,
        Permission.GET_ALL_CONTROLLERS_OF_CURRENT_USER,
        Permission.GET_CONTROLLER_BY_ID,
        Permission.GET_CONTROLLER_BY_UID,
        Permission.GET_CONTROLLER_ERRORS,
        Permission.FIND_EQUIPMENT_BY_ID,
        Permission.GET_ALL_EQUIPMENTS,
        Permission.FIND_FISCAL_REGISTRAR_BY_ID,
        Permission.CREATE_ITEM_MATRIX,
        Permission.ADD_BUTTON_ITEM_TO_ITEM_MATRIX,
        Permission.REMOVE_BUTTON_ITEM_FROM_ITEM_MATRIX,
        Permission.GET_ITEM_MATRIX_BY_ID,
        Permission.CREATE_ITEM,
        Permission.GET_ITEM_BY_ID,
        Permission.GET_USER_ITEMS,
        Permission.CREATE_LEGAL_INFO,
        Permission.UPDATE_LEGAL_INFO,
        Permission.CREATE_NOTIFICATION_SETTING,
        Permission.FIND_ALL_NOTIFICATION_SETTINGS,
        Permission.FIND_NOTIFICATION_SETTING_BY_TYPE,
        Permission.UPDATE_NOTIFICATION_SETTING,
        Permission.GET_ALL_REVISIONS,
        Permission.GET_REVISION_BY_ID,
        Permission.GET_LAST_SALE,
        Permission.GET_LAST_SALE_OF_ITEM,
        Permission.GET_ITEM_SALE_STATS,
        Permission.GET_SALES_SUMMARY,
        Permission.FIND_SERVICE_BY_ID,
        Permission.GET_SERVICES_FOR_CONTROLLER,
        Permission.GET_CONTROLLER_SERVICES,
        Permission.GET_PROFILE,
        Permission.CREATE_MACHINE,
        Permission.EDIT_MACHINE,
        Permission.CREATE_MACHINE_GROUP,
        Permission.GET_MACHINE_GROUP_BY_ID,
        Permission.GET_MACHINE_TYPE_BY_ID,
        Permission.GET_ALL_SELF_MACHINES,
        Permission.GET_ALL_SELF_MACHINE_GROUPS,
        Permission.GET_ALL_MACHINE_TYPES,
        Permission.GET_MACHINE_BY_ID,
        Permission.GET_MACHINE_BY_CONTROLLER_ID
    ],
    //ADMIN ROLE does not need permissions at all, he have access to all methods
    "ADMIN": [],
    "AGGREGATE": [
        Permission.CREATE_ITEM,
        Permission.GET_CONTROLLER_BY_ID,
        Permission.GET_CONTROLLER_BY_UID,
        Permission.AUTH_CONTROLLER,
        Permission.REGISTER_CONTROLLER_STATE,
        Permission.REGISTER_SALE,
        Permission.REGISTER_CONTROLLER_ERROR,
        Permission.GET_MACHINE_BY_CONTROLLER_ID
    ]
}


module.exports = RolePermissions
