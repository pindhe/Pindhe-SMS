module.exports = (sequelize, DataTypes) => {
  const Parent = sequelize.define('Parent', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    parentId: {
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
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    address: {
      type: DataTypes.TEXT,
    },
    occupation: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
    userId: {
      type: DataTypes.UUID,
      references: { model: 'Users', key: 'id' },
    },
  }, {
    timestamps: true,
  });

  Parent.associate = (models) => {
    Parent.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Parent.belongsToMany(models.Student, { through: 'ParentStudents', foreignKey: 'parentId', otherKey: 'studentId', as: 'children' });
  };

  return Parent;
};