import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbServer = process.env.DB_SERVER as string;
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;
const dbDatabase = process.env.DB_DATABASE as string;

const sequelize = new Sequelize({
  dialect: "mssql",
  host: dbServer,
  username: dbUser,
  password: dbPassword,
  database: dbDatabase,
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  },
  logging: false,
});

export default sequelize;
