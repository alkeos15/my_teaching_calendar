const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './students.db',
});

// Student model
const Student = sequelize.define('Student', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true } },
  phone: { type: DataTypes.STRING, allowNull: false },
  languageLevel: { type: DataTypes.STRING, allowNull: false },
});

// Lesson model
const Lesson = sequelize.define('Lesson', {
  title: { type: DataTypes.STRING, allowNull: false },
  start: { type: DataTypes.DATE, allowNull: false },
  end: { type: DataTypes.DATE, allowNull: false },
  studentId: { type: DataTypes.INTEGER, allowNull: false },
});

// Relationships
Lesson.belongsTo(Student, { foreignKey: 'studentId' });

// Sync models
sequelize.sync({ force: true }) // Use force only temporarily to rebuild the schema
  .then(() => console.log('Database synced successfully'))
  .catch(err => console.error('Error syncing database:', err));

module.exports = { sequelize, Student, Lesson };