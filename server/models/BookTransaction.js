module.exports = (sequelize, DataTypes) => {
  const BookTransaction = sequelize.define('BookTransaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookId: {
      type: DataTypes.UUID,
      references: { model: 'Books', key: 'id' },
      allowNull: false,
    },
    borrowerType: {
      type: DataTypes.ENUM('student', 'teacher'),
      allowNull: false,
    },
    borrowerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    borrowDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    returnDate: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM('borrowed', 'returned', 'overdue'),
      defaultValue: 'borrowed',
    },
    fine: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    remarks: {
      type: DataTypes.STRING,
    },
  }, {
    timestamps: true,
  });

  BookTransaction.associate = (models) => {
    BookTransaction.belongsTo(models.Book, { foreignKey: 'bookId', as: 'book' });
  };

  return BookTransaction;
};