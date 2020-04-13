
var commonConfig = {
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialect: "postgres",
    operatorsAliases: false
}

const useSSL = !(/false/i.test(process.env.HK_DB_SSL || ''))

const config = {
    "development": Object.assign({}, commonConfig, {
        username: (process.env.HK_DB_USERNAME || "postgres"),
        password: (process.env.HK_DB_PASSWORD || "password"),
        database: (process.env.HK_DB_NAME || "development"),
        host: (process.env.HK_DB_HOST || 'localhost'),
        port: (process.env.HK_DB_PORT || 5432),
        ssl: useSSL,
        dialectOptions: { ssl: useSSL },
    }),
    "test": Object.assign({}, commonConfig, {
        username: (process.env.HK_DB_USERNAME || "postgres"),
        password: (process.env.HK_DB_PASSWORD),
        database: "test",
        host: process.env.HK_DB_HOST,
    }),
    "staging": Object.assign({}, commonConfig, {
        username: "postgres",
        password: "password",
        database: "staging",
        host: process.env.HK_STAGING_DB_HOST,
        port: (process.env.HK_DB_PORT || 5432),
        ssl: useSSL,
        dialectOptions: { ssl: useSSL },
    }),
    "production": Object.assign({}, commonConfig, {
        username: process.env.HK_DB_USERNAME,
        password: process.env.HK_DB_PASSWORD,
        database: (process.env.HK_DB_NAME || "production"),
        host: process.env.HK_DB_HOST,
        port: (process.env.HK_DB_PORT || 5432),
        ssl: useSSL,
        dialectOptions: { ssl: useSSL },
    })
}

console.log("DB CONFIG:", config[process.env.NODE_ENV])

module.exports = config

