module.exports = (sequelize, DataTypes) => {
  const Timetable = sequelize.define('Timetable', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    day: {
      type: DataTypes.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
      allowNull: false,
    },
    period: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subjectId: {
      type: DataTypes.UUID,
      references: { model: 'Subjects', key: 'id' },
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.UUID,
      references: { model: 'Teachers', key: 'id' },
      allowNull: false,
    },
    classroom: {
      type: DataTypes.STRING,
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    semester: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
  }, {
    timestamps: true,
  });

  Timetable.associate = (models) => {
    Timetable.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
    Timetable.belongsTo(models.Section, { foreignKey: 'sectionId', as: 'section' });
    Timetable.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
    Timetable.belongsTo(models.Teacher, { foreignKey: 'teacherId', as: 'teacher' });
  };

  return Timetable;
};