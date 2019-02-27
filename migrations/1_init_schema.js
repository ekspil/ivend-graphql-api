"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {

        // LegalInfo
        await queryInterface.createTable("legal_infos", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            company_name: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            city: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            actual_address: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            inn: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            ogrn: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            legal_address: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            director: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            director_phone: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            director_email: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            contact_person: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            contact_phone: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            contact_email: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            }
        })

        // Revisions
        await queryInterface.createTable("revisions", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            name: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            }
        })

        // User
        await queryInterface.createTable("users", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            email: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true
            },
            phone: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true
            },
            passwordHash: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            role: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            legal_info_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
                unique: true,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "legal_infos",
                    key: "id"
                }
            }
        })

        // Equipments
        await queryInterface.createTable("equipments", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            name: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            }
        })

        // FiscalRegistrar
        await queryInterface.createTable("fiscal_registrars", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            name: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            }
        })

        // BankTerminals
        await queryInterface.createTable("bank_terminals", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            name: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            }
        })

        // ControllerState
        await queryInterface.createTable("controller_states", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            firmware_id: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            coin_acceptor_status: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            bill_acceptor_status: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            coin_amount: {
                type: Sequelize.DECIMAL,
                allowNull: false
            },
            bill_amount: {
                type: Sequelize.DECIMAL,
                allowNull: false
            },
            dex1_status: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            dex2_status: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            exe_status: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            mdb_status: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            signal_strength: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            registration_time: {
                type: Sequelize.DATE,
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            controller_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false
            }
        })

        // Controller
        await queryInterface.createTable("controllers", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            name: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            uid: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            mode: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            status: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            access_key: {
                type: Sequelize.TEXT,
                allowNull: true,
                unique: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            equipment_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "equipments",
                    key: "id"
                }
            },
            revision_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "revisions",
                    key: "id"
                }
            },
            bank_terminal_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "bank_terminals",
                    key: "id"
                }
            },
            fiscal_registrar_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "fiscal_registrars",
                    key: "id"
                }
            },
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "users",
                    key: "id"
                }
            },
            last_state_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
                unique: true,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "controller_states",
                    key: "id"
                }
            }
        })

        // NotificationSettings
        await queryInterface.createTable("notification_settings", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            type: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            email: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                unique: false
            },
            sms: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                unique: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "users",
                    key: "id"
                }
            }
        })

        // PaymentRequest
        await queryInterface.createTable("payment_requests", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            to: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            idempotence_key: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true
            },
            payment_id: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true
            },
            redirect_url: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true
            },
            status: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            }
        })

        // Transaction
        await queryInterface.createTable("transactions", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            amount: {
                type: Sequelize.DECIMAL,
                allowNull: false,
                unique: false
            },
            meta: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "users",
                    key: "id"
                }
            }
        })

        // Service
        await queryInterface.createTable("services", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            name: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            price: {
                type: Sequelize.DECIMAL,
                allowNull: false,
                unique: false
            },
            type: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            billing_type: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            }
        })

        // Item
        await queryInterface.createTable("items", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            name: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "users",
                    key: "id"
                }
            }
        })

        // Sale
        await queryInterface.createTable("sales", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            type: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: false
            },
            price: {
                type: Sequelize.DECIMAL,
                allowNull: false,
                unique: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            item_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "items",
                    key: "id"
                }
            },
            controller_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "controllers",
                    key: "id"
                }
            }
        })

        // Deposit
        await queryInterface.createTable("deposits", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            amount: {
                type: Sequelize.DECIMAL,
                allowNull: false,
                unique: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "users",
                    key: "id"
                }
            },
            payment_request_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "payment_requests",
                    key: "id"
                }
            }
        })

        // ItemMatrix
        await queryInterface.createTable("item_matrixes", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "users",
                    key: "id"
                }
            },
            controller_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "controllers",
                    key: "id"
                }
            },
        })

        // ButtonItem
        await queryInterface.createTable("button_items", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            button_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false
            },
            item_matrix_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "item_matrixes",
                    key: "id"
                }
            },
            item_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "items",
                    key: "id"
                }
            },
        })


        // ControllerError
        await queryInterface.createTable("controller_errors", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            error_time: {
                type: Sequelize.DATE,
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            controller_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "controllers",
                    key: "id"
                }
            }
        })

        // ControllerServices
        await queryInterface.createTable("controller_services", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn("NOW")
            },
            controller_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "controllers",
                    key: "id"
                }
            },
            service_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: false,
                onUpdate: "restrict",
                onDelete: "restrict",
                references: {
                    model: "services",
                    key: "id"
                }
            },
        })

        await queryInterface.addConstraint("controller_services", {
            type: "unique",
            fields: ["controller_id", "service_id"]
        })

    },
    down: async () => {
        throw new Error("All failed migrations have to be resolved manually")
    }
}
