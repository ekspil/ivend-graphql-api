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

# 1.3.30 - Hotfix

* hotfix

# 1.3.31 - Release

* edit admin queries

# 1.3.32 - Release

* Service\commodity

# 1.3.33 - Release

* Service\commodity

# 1.3.34 - Release

* FixBug

# 1.3.35 - Release

* users list speed

# 1.3.36 - Release

* controllers list speed

# 1.3.37 - Hotfix

* controllers list speed

# 1.3.38 - Hotfix

* controllers list speed

# 1.3.39 - Hotfix

* controllers list speed

# 1.3.40 - Hotfix

* controllers list order

# 1.3.41 - Hotfix

* add sum to encashment

# 1.3.42 - Hotfix

* add sum to encashment

# 1.3.43 - Hotfix

* add new temp cash table

# 1.3.44 - Hotfix

* add fast sales summury

# 1.3.45 - Release

* 7 steps, speed


# 1.3.46 - Hotfix

* hotfix


# 1.3.47 - Hotfix

* delete fix


# 1.3.48 - Hotfix

* delete fix



# 1.3.49 - Hotfix

* delete fix

# 1.3.50 - Hotfix

* delete fix


# 1.4.1 - Release

* add partner service

# 1.4.2 - Release

* new terminals

# 1.4.3 - Release

* fix logs

# 1.4.4 - Release

* fix controller filter


# 1.4.5 - Release

* new period


# 1.4.6 - Release

* fix

# 1.4.8 - Hotfix

* fix kkt selection error

# 1.4.9 - Hotfix

* fix sale reject error

# 1.4.10 - Hotfix

* fix kkt status error

# 1.4.11 - Hotfix

* fix aggregate role

# 1.4.12 - Hotfix

* fix aggregate role



# 1.4.13 - Hotfix

* fix auto create item error




# 1.4.14 - Hotfix

* fix auto create item error


# 1.4.15 - Hotfix

* new controller columns



# 1.4.16 - Hotfix

* new machine columns


# 1.4.17 - Hotfix

* new machine columns

# 1.5.1 - Release

* new fiches

# 1.5.2 - Release

* new fiches


# 1.5.3 - Hotfix

* add machine error

# 1.5.4 - Hotfix

* reload

# 1.5.5 - Hotfix

* change qr options

# 1.5.6 - Hotfix

* change qr options

# 1.5.7 - Hotfix

* change groupSettings options

# 1.5.8 - Hotfix

* fix bugs

# 1.5.9 - Hotfix

* fix bugs


# 1.5.10 - Hotfix

* fix bugs


# 1.5.11 - Hotfix

* Move to yandex

# 1.5.12 - Hotfix

* Disable fiscal

# 1.5.13 - Hotfix

* Disable fiscal

# 1.5.14 - Hotfix

* Add postgres acquire and idle environments

# 1.5.15 - Hotfix

* hotfix

# 1.5.16 - Hotfix

* 7 replicas

# 1.5.17 - Hotfix

* 10 replicas

# 1.5.18 - Hotfix

* sequelize conf

# 1.5.19 - Hotfix

* return fiscal

# 1.5.20 - Hotfix

* 7 replicas

# 1.5.21 - Hotfix

* delete group mutation


# 1.5.22 - Hotfix

* kkt hot fix

# 1.5.23 - Hotfix

* kkt not wait ofg

# 1.5.24 - Hotfix

* kkt status write


# 1.5.25 - Hotfix

* hotfix


# 1.5.26 - Hotfix

* hotfix

# 1.5.27 - Hotfix

* hotfix


# 1.5.28 - Hotfix

* hotfix


# 1.5.29 - Hotfix

* hotfix



# 1.5.30 - Release

* Add rekassa suppurt


# 1.5.31 - Release

* Fiscal status


# 1.5.32 - Hotfix

* Fix doubles


# 1.5.33 - Hotfix

* Fix doubles


# 1.6.0 - Release

* PArtner functions


# 1.6.1 - Hotfix

* hotfix


# 1.6.2 - Hotfix

* bill new data


# 1.6.3 - Hotfix

* fix bugs


# 1.6.4 - Hotfix

* fix stats


# 1.6.5 - Hotfix

* resends


# 1.6.6 - Hotfix

* resends


# 1.6.7 - Hotfix

* excel hotfix


# 1.6.8 - Hotfix

* pdf hotfix

# 1.6.9 - Hotfix

* sim reset


# 1.6.10 - Hotfix

* controller vendor filtration

# 1.6.11 - Hotfix

* controller vendor filtration

# 1.6.12 - Hotfix

* receipt resend fix


# 1.6.13 - Hotfix

* receipt resend fix

# 1.6.14 - Hotfix

* autosend email orders

# 1.6.15 - Hotfix

* fix sending sms

# 1.6.16 - Hotfix

* fix sending sms

# 1.6.17 - Hotfix

* fix billing

# 1.6.18 - Hotfix

* fix sending sms and email

# 1.6.19 - Hotfix

* fix sending sms and email

# 1.6.20 - Hotfix

* fix sending sms and email

# 1.6.21 - Hotfix

* fix generate pdf

# 1.6.22 - Hotfix

* delete controllers when user closed

# 1.6.23 - Hotfix

* fix kkt statusws

# 1.6.24 - Hotfix

* fix kkt statusws

# 1.6.25 - Hotfix

* fix kkt statusws

# 1.6.26 - Hotfix

* fix kkt statusws

# 1.6.27 - Hotfix

* fix kkt statusws

# 1.6.28 - Hotfix

* fix kkt statusws

# 1.6.29 - Hotfix

* fix sim

# 1.6.30 - Hotfix

* new kkt

# 1.6.31 - Hotfix

* root sert

# 1.6.32 - Hotfix

* root sert

# 1.6.32 - Hotfix

* root sert

# 1.6.33 - Hotfix

* sms to other countries

# 1.6.34 - Hotfix

* sms search

# 1.6.35 - Hotfix

* sms search

# 1.6.36 - Hotfix

* hotfix

# 1.6.37 - Hotfix

* hotfix

# 1.6.38 - Hotfix

* hotfix

# 1.6.40 - Hotfix

* disable terminal -1000
* mechanic mode

# 1.6.41 - Hotfix

* fix url in error

# 1.6.43 - Hotfix

* mech mode
* -1000 terminal disable

# 1.6.44 - Hotfix

* mech mode fix


# 1.6.45 - Hotfix

* mech mode fix


# 1.6.46 - Hotfix

* mech mode fix

# 1.6.48 - Hotfix

* mech mode fix


# 1.6.49 - Hotfix

* vendista send data

# 1.6.50 - Hotfix

* change cashless billing

# 1.6.51 - Hotfix

* fix vendista mdb sum


# 1.6.52 - Hotfix

* fix vendista mdb sum

# 1.6.53 - Hotfix

* fix vendista mdb sum

# 1.6.54 - Hotfix

* fix vendista commands

# 1.6.55 - Hotfix

* add search terminals

# 1.6.56 - Hotfix

* add search terminals

# 1.6.57 - Hotfix

* add commands

# 1.6.59 - Hotfix

* integrate payments
* add payments search

# 1.6.60 - Hotfix

* fix vendista commands

# 1.6.61 - Hotfix

* fix cmd

# 1.6.62 - Hotfix

* fix cmd


# 1.6.63 - Hotfix

* fix updateIntegrations

# 1.6.64 - Hotfix

* add buttons

# 1.6.66 - Hotfix

* add controller upd

# 1.6.68 - Hotfix

* add controller upd

# 1.6.69 - Hotfix

* add sale_id to fiscal


# 1.6.70 - Hotfix

* search in kkts, controllers and users


# 1.6.71 - Hotfix

* fix vendista commands


# 1.6.72 - Hotfix

* user vendista integration

# 1.6.73 - Hotfix

* getControllers and its information by other id

# 1.6.74 - Hotfix

* getControllers and its information by other id

# 1.6.75 - Hotfix

* kkt type edit

# 1.6.78 - Hotfix

* add orange fixes

# 1.6.83 - Hotfix

* add pay type in user billing history

# 1.6.84 - Hotfix

* add partner_id in getAllUsers

# 1.6.85 - Hotfix

* add orange bill information

# 1.6.86 - Hotfix

* add kkt id in sales

# 1.6.87 - Hotfix

* add managers functions

# 1.6.88 - Hotfix

* add managers functions

# 1.6.89 - Hotfix

* create partner payments

