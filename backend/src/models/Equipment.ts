import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../config/db";

export enum EquipmentStatus {
  ACTIVE = "Active",
  WARNING = "Warning",
  MAINTENANCE = "Maintenance",
  DECOMMISSIONED = "Decommissioned",
}

class Equipment extends Model<
  InferAttributes<Equipment>,
  InferCreationAttributes<Equipment>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare serial_number: string;
  declare status: CreationOptional<EquipmentStatus>;
  declare next_maintenance: Date | string;
}

Equipment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    serial_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(EquipmentStatus)),
      defaultValue: EquipmentStatus.ACTIVE,
    },
    next_maintenance: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "equipment",
    timestamps: false,
  },
);

export default Equipment;
