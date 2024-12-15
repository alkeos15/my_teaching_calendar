const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

// Student model
const Student = sequelize.define('Student', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, validate: { isEmail: true } },
  phone: { type: DataTypes.STRING, allowNull: false },
  languageLevel: { type: DataTypes.STRING, allowNull: false },
});

// Lesson model
const Lesson = sequelize.define('Lesson', {
  title: { type: DataTypes.STRING, allowNull: false },
  start: { type: DataTypes.DATE, allowNull: false },
  end: { type: DataTypes.DATE, allowNull: false },
  studentId: { type: DataTypes.INTEGER, allowNull: false },
  recurrence: { type: DataTypes.STRING }, // 'none', 'daily', 'weekly'
});

// Relationships
Lesson.belongsTo(Student, { foreignKey: 'studentId' });

// Sync models
sequelize.sync();

module.exports = { sequelize, Student, Lesson };