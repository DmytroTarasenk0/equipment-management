import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import sequelize from "../config/db";
import User from "./User";
import Equipment from "./Equipment";

class MaintenanceLog extends Model<
  InferAttributes<MaintenanceLog>,
  InferCreationAttributes<MaintenanceLog>
> {
  declare id: CreationOptional<number>;
  declare equipment_id: ForeignKey<Equipment["id"]>;
  declare user_id: ForeignKey<User["id"]>;
  declare date: Date | string;
  declare description: string;
}

MaintenanceLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "maintenance_logs",
    timestamps: false,
  },
);

export default MaintenanceLog;
