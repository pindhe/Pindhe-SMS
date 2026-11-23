module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    teacherId: {
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
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
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
    qualification: {
      type: DataTypes.STRING,
    },
    specialization: {
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
    experience: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    timestamps: true,
  });

  Teacher.associate = (models) => {
    Teacher.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Teacher.belongsToMany(models.Class, { through: 'TeacherClasses', foreignKey: 'teacherId', otherKey: 'classId', as: 'assignedClasses' });
    Teacher.belongsToMany(models.Subject, { through: 'TeacherSubjects', foreignKey: 'teacherId', otherKey: 'subjectId', as: 'assignedSubjects' });
  };

  return Teacher;
};