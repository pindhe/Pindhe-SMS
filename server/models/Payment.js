module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    receiptNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.UUID,
      references: { model: 'Students', key: 'id' },
      allowNull: false,
    },
    feeId: {
      type: DataTypes.UUID,
      references: { model: 'Fees', key: 'id' },
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'mobile_money', 'bank_transfer', 'check', 'online'),
      allowNull: false,
    },
    paymentDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('completed', 'pending', 'failed', 'refunded'),
      defaultValue: 'completed',
    },
    transactionId: {
      type: DataTypes.STRING,
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receivedBy: {
      type: DataTypes.UUID,
      references: { model: 'Users', key: 'id' },
    },
    remarks: {
      type: DataTypes.STRING,
    },
  }, {
    timestamps: true,
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    Payment.belongsTo(models.Fee, { foreignKey: 'feeId', as: 'fee' });
    Payment.belongsTo(models.User, { foreignKey: 'receivedBy', as: 'receiver' });
  };

  return Payment;
};