module.exports = (sequelize, DataTypes) => {
  const Announcement = sequelize.define('Announcement', {
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
      allowNull: false,
    },
    targetAudience: {
      type: DataTypes.ENUM('all', 'students', 'teachers', 'parents', 'staff'),
      defaultValue: 'all',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium',
    },
    createdBy: {
      type: DataTypes.UUID,
      references: { model: 'Users', key: 'id' },
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'archived'),
      defaultValue: 'active',
    },
  }, {
    timestamps: true,
  });

  Announcement.associate = (models) => {
    Announcement.belongsToMany(models.Class, { through: 'AnnouncementClasses', foreignKey: 'announcementId', otherKey: 'classId', as: 'classes' });
    Announcement.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  };

  return Announcement;
};