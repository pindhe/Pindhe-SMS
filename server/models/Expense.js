module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define('Expense', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    category: {
      type: DataTypes.ENUM('salary', 'utility', 'maintenance', 'office_supplies', 'transport', 'other'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'bank_transfer', 'check', 'online'),
      defaultValue: 'cash',
    },
    receiptNumber: {
      type: DataTypes.STRING,
    },
    recordedBy: {
      type: DataTypes.UUID,
      references: { model: 'Users', key: 'id' },
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
  });

  Expense.associate = (models) => {
    Expense.belongsTo(models.User, { foreignKey: 'recordedBy', as: 'recorder' });
  };

  return Expense;
};