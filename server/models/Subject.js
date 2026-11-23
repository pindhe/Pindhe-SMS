module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxMarks: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },
    passingMarks: {
      type: DataTypes.INTEGER,
      defaultValue: 40,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
  }, {
    timestamps: true,
  });

  Subject.associate = (models) => {
    Subject.belongsToMany(models.Class, { through: 'ClassSubjects', foreignKey: 'subjectId', otherKey: 'classId', as: 'classes' });
    Subject.belongsToMany(models.Teacher, { through: 'TeacherSubjects', foreignKey: 'subjectId', otherKey: 'teacherId', as: 'teachers' });
  };

  return Subject;
};