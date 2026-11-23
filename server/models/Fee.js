module.exports = (sequelize, DataTypes) => {
  const Fee = sequelize.define('Fee', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      references: { model: 'Students', key: 'id' },
      allowNull: false,
    },
    classId: {
      type: DataTypes.UUID,
      references: { model: 'Classes', key: 'id' },
    },
    category: {
      type: DataTypes.ENUM('tuition', 'registration', 'examination', 'library', 'transport', 'other'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    semester: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('paid', 'partially_paid', 'unpaid', 'overdue'),
      defaultValue: 'unpaid',
    },
    description: {
      type: DataTypes.TEXT,
    },
    createdBy: {
      type: DataTypes.UUID,
      references: { model: 'Users', key: 'id' },
    },
  }, {
    timestamps: true,
  });

  Fee.associate = (models) => {
    Fee.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    Fee.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
    Fee.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  };

  return Fee;
};