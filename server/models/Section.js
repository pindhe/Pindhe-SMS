module.exports = (sequelize, DataTypes) => {
  const Section = sequelize.define('Section', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    classId: {
      type: DataTypes.UUID,
      references: { model: 'Classes', key: 'id' },
      allowNull: false,
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
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

  Section.associate = (models) => {
    Section.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
    Section.belongsTo(models.Teacher, { foreignKey: 'classTeacherId', as: 'classTeacher' });
    Section.belongsToMany(models.Student, { through: 'SectionStudents', foreignKey: 'sectionId', otherKey: 'studentId', as: 'students' });
  };

  return Section;
};