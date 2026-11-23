module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('Class', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    grade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    classTeacherId: {
      type: DataTypes.UUID,
      references: { model: 'Teachers', key: 'id' },
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
  }, {
    timestamps: true,
  });

  Class.associate = (models) => {
    Class.belongsTo(models.Teacher, { foreignKey: 'classTeacherId', as: 'classTeacher' });
    Class.belongsToMany(models.Subject, { through: 'ClassSubjects', foreignKey: 'classId', otherKey: 'subjectId', as: 'subjects' });
    Class.belongsToMany(models.Student, { through: 'ClassStudents', foreignKey: 'classId', otherKey: 'studentId', as: 'students' });
    Class.hasMany(models.Section, { foreignKey: 'classId', as: 'sections' });
  };

  return Class;
};