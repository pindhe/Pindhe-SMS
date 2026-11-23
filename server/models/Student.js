module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    admissionNumber: {
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
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    address: {
      type: DataTypes.TEXT,
    },
    parentName: {
      type: DataTypes.STRING(100),
    },
    parentPhone: {
      type: DataTypes.STRING(20),
    },
    parentEmail: {
      type: DataTypes.STRING,
    },
    classId: {
      type: DataTypes.UUID,
      references: { model: 'Classes', key: 'id' },
      allowNull: false,
    },
    sectionId: {
      type: DataTypes.UUID,
      references: { model: 'Sections', key: 'id' },
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admissionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    photo: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'graduated', 'suspended'),
      defaultValue: 'active',
    },
    userId: {
      type: DataTypes.UUID,
      references: { model: 'Users', key: 'id' },
    },
    bloodGroup: {
      type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'),
    },
    religion: {
      type: DataTypes.STRING,
    },
    nationality: {
      type: DataTypes.STRING,
    },
  }, {
    timestamps: true,
  });

  Student.associate = (models) => {
    Student.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
    Student.belongsTo(models.Section, { foreignKey: 'sectionId', as: 'section' });
    Student.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Student;
};