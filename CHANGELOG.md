# 1.0.2 - Pre release version
* First version

# 1.0.3 - Release
* First release version
* Many changes
* Refactored controllers into machine / controllers


# 1.0.4 - Release
* Added default data (machine types, revisions etc) in Migrations
* Added SMS registration
* Added Machine Logs
* Removed Services
* Added removal of Controllers and Machines
* Added logging error/ok of buses

# 1.0.5 - Hotfix
* Permission is not set to itemUser caused to fail to registerSale when no item exist


# 1.0.6 - Release
* Pass phone and userId on requestDeposit

# 1.0.7 - Hotfix
* Change role to VENDOR when LegalInfo is set

# 1.0.8 - Hotfix
* Replace unsetting itemMatrixId by removing button items mapping in ItemMatrixService

# 1.0.9 - Hotfix
* Filter out by all of user machines in salesSummary of the whole profile.

# 1.1.0 - Release

* Added new GraphQL types (Kkt, EditKktInput, CreateKktInput)
* Added new GraphQL queries (getKktById, getUsersKkts, getAllKkts)
* Added new GraphQL mutations (createKkt, editKkt, kktPlusBill, deleteKkt)
* Added resolvers for queries (getKktById, getUsersKkts, getAllKkts)
* Added resolvers for mutations (createKkt, editKkt, kktPlusBill, deleteKkt)
* Added sequelize model (Kkt). It belongs to User
* Added integration with Umka fiscal service (SaleService.js)
* Added special functions for Umka service (FiscalService.js)
* Added migrations (040-043) which create 'kkts' table
* Added new package(axios)
* Changed default resolver (User), added Kkts.
* Removed OFD Services from SaleService.js

# 1.1.1 - Hotfix
* Add machineId arg for salesSummary in type Item

# 1.1.2 - Release

* Add CONFIRM_USER_ACTION to role VENDOR_NOT_CONFIRMED
* Throw NotAuthorized if trying to confirm other user

# 1.1.3 - Release

* Fix user is not defined

# 1.1.4 - Release

* Remove that NotAuthorized throw

# 1.1.5 - Release

* Added kkt server field
* Added sno in legalInfo
* Added KKT_EDIT permission for VENDOR
* Fixed umka send service
* Fixed fiscal string (added sno)
* Fixed billing query string (userId added)

# 1.1.6 - Release

* Added RemotePrinting implementation

# 1.1.7 - Release

* Fix passing sqr

# 1.1.8 - Release

* Change remotePrinting to remotePrinterId

# 1.1.9 - Release

* Added changeUserBalance mutation
* Added getLegalInfoByUserId query
* Added getAllUsers query
* Changed createMachine mutation (kktId added)
* Changed editMachine mutation (kktId added)
* Changed default user resolver (legalInfo)

# 1.1.10 - Release

* Added centralized logging (graylog)
* Added GET_LEGAL_INFO to role VENDOR_NO_LEGAL_INFO


# 1.1.11 - Release

* fix prepareData logging


# 1.1.12 - Release

* Bumped sequelize connection pool to (min 5, max 20)

# 1.1.13 - Release

* Moved out connection limits to the environment (min 5, max 15 default)


# 1.1.14 - Hotfix

* Add logging prefix on sale service error


# 1.1.15 - Hotfix

* Fix logging prefix [object Object]


# 1.2.0 - Release

* Receipt handling refactored: moved out to external microservice
* Added Encashment type
* Added return types and mutations with queries for the Receipt and Encashment

# 1.2.1 - Release

* Fixed logging saleService registerSale error
* Added more vebose logging for debugging prod

# 1.2.2 - Release

* Added filtering by machine group in salesSummary
* addeduserId in graphql type Billing

# 1.2.3 - Release

* Added new environment APOLLO_ENABLE_TRACING for enabling Apollo Tracing
* Bumpled production number of replicas to 2


# 1.2.4 - Release

* Added migration for index on field machine_id in Sales

# 1.3.0 - Release

* Unset controller from machine before controller delete
* When creating controller, trim whitespaces from uid
* When return ItemMatrix with buttons, sort by buttonId
* Unset controller from machine before machine delete
* Added payment type to the type Receipt
* Added ENABLED value to MachineLogType in GraphQL enum
* Unset controllerId if passed to editController

# 1.3.1 - Release

* Add sorting of ButtonItems
* Add paymentType to ReceiptDTO

# 1.3.2 - Release

* Fix missing leading zeros in qr code

# 1.3.3 - Release

* Fix missing leading zeros in qr code typo

# 1.3.4 - Release

* Fix missing leading zeros in qr code typo bug

# 1.3.5 - Release

* Added telegram and email to notification settings
* Added new resolvers for news on home page
* Added new resolvers for pdf service
* Added multipliers in buttons

# 1.3.6 - Release

* PG timeout to 90000

# 1.3.7 - Release

* Fix checking before replace
* PG timeout to 50000

# 1.3.8 - Release

* Added password change system
* Fix sql query in items sale report

# 1.3.9 - Release

* Change sales query(machines)

# 1.3.10 - Release

* Fix billing query

# 1.3.11 - Release

* Fix orderNumber in pdf generate

# 1.3.12 - Release

* Fix column in equipment

# 1.3.13 - Release

* New admin functions

# 1.3.14 - Release

* Fix fiscal price

# 1.3.15 - Release

* Fix fiscal price

# 1.3.16 - Release

* Fix fiscal price

# 1.3.17 - Release

* Fix NO_LEGAL_INFO balance

# 1.3.18 - Release

* Fix NO_LEGAL_INFO balance

# 1.3.19 - Release

* Fix Item sales summary speed

# 1.3.20 - Release

* Fix email in env

# 1.3.21 - Release

* Fix email in env

# 1.3.22 - Hotfix

* Fix registration bag


# 1.3.23 - Hotfix

* Fix registration bag


# 1.3.24 - Hotfix

* Fix problem

# 1.3.25 - Hotfix

* New admin functions


# 1.3.26 - Hotfix

* disable sales in disabled controllers

# 1.3.27 - Hotfix

* Hotfix

# 1.3.28 - Release

* IMSI added
* new sorting parameters


# 1.3.29 - Hotfix

* hotfix


