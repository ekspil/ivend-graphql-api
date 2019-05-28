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

# 1.1.0 - Hotfix

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
