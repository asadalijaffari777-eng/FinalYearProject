const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const app = require('./app')
const connectDB = require('./config/database')

connectDB().then(() => {
  app.listen(3001, () => {
    console.log('server is running on port 3001')
  })
}).catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
