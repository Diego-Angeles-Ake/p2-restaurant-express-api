require('dotenv').config();
const { app } = require('./app');
const { db } = require('./database/database.config');
const { initModels } = require('./helpers/init-models.helper');

const PORT = process.env.PORT || 4000;
// Testing the connection
(async () => {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Establish model relations
initModels();

// Model synchronization
(async () => {
  await db.sync({ force: true });
  console.log('All models were synchronized successfully.');
})();

// Spin-up server
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
