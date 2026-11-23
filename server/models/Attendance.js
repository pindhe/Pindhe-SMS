module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
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
      allowNull: false,
    },
    sectionId: {
      type: DataTypes.UUID,
      references: { model: 'Sections', key: 'id' },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
      allowNull: false,
    },
    markedBy: {
      type: DataTypes.UUID,
      references: { model: 'Teachers', key: 'id' },
    },
    remarks: {
      type: DataTypes.STRING,
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
  });

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    Attendance.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
    Attendance.belongsTo(models.Section, { foreignKey: 'sectionId', as: 'section' });
    Attendance.belongsTo(models.Teacher, { foreignKey: 'markedBy', as: 'markedByTeacher' });
  };

  return Attendance;
};