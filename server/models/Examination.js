module.exports = (sequelize, DataTypes) => {
  const Examination = sequelize.define('Examination', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('unit_test', 'mid_term', 'final_term', 'mock', 'annual'),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'ongoing', 'completed', 'cancelled'),
      defaultValue: 'scheduled',
    },
    createdBy: {
      type: DataTypes.UUID,
      references: { model: 'Users', key: 'id' },
    },
  }, {
    timestamps: true,
  });

  Examination.associate = (models) => {
    Examination.belongsToMany(models.Class, { through: 'ExamClasses', foreignKey: 'examinationId', otherKey: 'classId', as: 'classes' });
    Examination.belongsToMany(models.Subject, { through: 'ExamSubjects', foreignKey: 'examinationId', otherKey: 'subjectId', as: 'subjects' });
    Examination.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  };

  return Examination;
};