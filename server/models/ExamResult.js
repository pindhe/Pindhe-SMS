module.exports = (sequelize, DataTypes) => {
  const ExamResult = sequelize.define('ExamResult', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    examinationId: {
      type: DataTypes.UUID,
      references: { model: 'Examinations', key: 'id' },
      allowNull: false,
    },
    studentId: {
      type: DataTypes.UUID,
      references: { model: 'Students', key: 'id' },
      allowNull: false,
    },
    subjectId: {
      type: DataTypes.UUID,
      references: { model: 'Subjects', key: 'id' },
      allowNull: false,
    },
    classId: {
      type: DataTypes.UUID,
      references: { model: 'Classes', key: 'id' },
      allowNull: false,
    },
    marksObtained: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxMarks: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },
    grade: {
      type: DataTypes.STRING,
    },
    percentage: {
      type: DataTypes.FLOAT,
    },
    rank: {
      type: DataTypes.INTEGER,
    },
    remarks: {
      type: DataTypes.STRING,
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    enteredBy: {
      type: DataTypes.UUID,
      references: { model: 'Teachers', key: 'id' },
    },
    enteredAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: true,
  });

  ExamResult.associate = (models) => {
    ExamResult.belongsTo(models.Examination, { foreignKey: 'examinationId', as: 'examination' });
    ExamResult.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    ExamResult.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
    ExamResult.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
    ExamResult.belongsTo(models.Teacher, { foreignKey: 'enteredBy', as: 'enteredByTeacher' });
  };

  return ExamResult;
};