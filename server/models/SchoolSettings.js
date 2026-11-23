module.exports = (sequelize, DataTypes) => {
  const SchoolSettings = sequelize.define('SchoolSettings', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    schoolName: {
      type: DataTypes.STRING,
      defaultValue: 'Pindhe SMS',
    },
    schoolLogo: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    schoolAddress: {
      type: DataTypes.TEXT,
    },
    schoolPhone: {
      type: DataTypes.STRING(20),
    },
    schoolEmail: {
      type: DataTypes.STRING,
    },
    academicYear: {
      type: DataTypes.STRING,
      defaultValue: '2024-2025',
    },
    semester: {
      type: DataTypes.STRING,
      defaultValue: 'Fall',
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
    },
    gradingSystem: {
      type: DataTypes.JSON,
      defaultValue: {
        A: '90-100',
        B: '80-89',
        C: '70-79',
        D: '60-69',
        E: '50-59',
        F: 'Below 50',
      },
    },
    minAttendancePercentage: {
      type: DataTypes.INTEGER,
      defaultValue: 75,
    },
    allowPhotoUpload: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    minPasswordLength: {
      type: DataTypes.INTEGER,
      defaultValue: 6,
    },
    requireSpecialChar: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    darkMode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: 'en',
    },
  }, {
    timestamps: true,
  });

  SchoolSettings.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
      settings = await this.create({});
    }
    return settings;
  };

  return SchoolSettings;
};