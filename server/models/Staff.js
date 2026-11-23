module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define('Staff', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    staffId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    address: {
      type: DataTypes.TEXT,
    },
    department: {
      type: DataTypes.STRING,
    },
    jobTitle: {
      type: DataTypes.STRING,
    },
    joiningDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    salary: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'on_leave', 'resigned'),
      defaultValue: 'active',
    },
    profilePicture: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    userId: {
      type: DataTypes.UUID,
      references: { model: 'Users', key: 'id' },
    },
    dateOfBirth: {
      type: DataTypes.DATE,
    },
  }, {
    timestamps: true,
  });

  Staff.associate = (models) => {
    Staff.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Staff;
};