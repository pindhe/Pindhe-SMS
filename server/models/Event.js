module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.STRING,
    },
    endTime: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.ENUM('holiday', 'exam', 'sports', 'cultural', 'meeting', 'other'),
      defaultValue: 'other',
    },
    targetAudience: {
      type: DataTypes.ENUM('all', 'students', 'teachers', 'parents', 'staff'),
      defaultValue: 'all',
    },
    createdBy: {
      type: DataTypes.UUID,
      references: { model: 'Users', key: 'id' },
    },
    status: {
      type: DataTypes.ENUM('upcoming', 'ongoing', 'completed', 'cancelled'),
      defaultValue: 'upcoming',
    },
  }, {
    timestamps: true,
  });

  Event.associate = (models) => {
    Event.belongsToMany(models.Class, { through: 'EventClasses', foreignKey: 'eventId', otherKey: 'classId', as: 'classes' });
    Event.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  };

  return Event;
};