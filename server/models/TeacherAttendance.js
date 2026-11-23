module.exports = (sequelize, DataTypes) => {
  const TeacherAttendance = sequelize.define('TeacherAttendance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    teacherId: {
      type: DataTypes.UUID,
      references: { model: 'Teachers', key: 'id' },
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('present', 'absent', 'late', 'leave'),
      allowNull: false,
    },
    markedBy: {
      type: DataTypes.UUID,
      references: { model: 'Staff', key: 'id' },
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

  TeacherAttendance.associate = (models) => {
    TeacherAttendance.belongsTo(models.Teacher, { foreignKey: 'teacherId', as: 'teacher' });
    TeacherAttendance.belongsTo(models.Staff, { foreignKey: 'markedBy', as: 'markedByStaff' });
  };

  return TeacherAttendance;
};