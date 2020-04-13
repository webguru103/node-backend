module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('builders', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            companyName: {
                type: Sequelize.STRING
            },
            mainContactName: {
                type: Sequelize.STRING
            },
            mainContactPhone: {
                type: Sequelize.STRING
            },
            mainContactEmail: {
                type: Sequelize.STRING
            },
            address1: {
                type: Sequelize.STRING
            },
            address2: {
                type: Sequelize.STRING
            },
            zipCode: {
                type: Sequelize.STRING
            },
            companyPhone: {
                type: Sequelize.STRING
            },
            city: {
                type: Sequelize.STRING
            },
            state: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        })
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('builders')
    }
}
