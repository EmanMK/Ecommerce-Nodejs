const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: 'config.env' });
const ApiError = require('./utils/apiError');
const dbConnection = require('./config/database');

//Routes
const categoryRoute = require('./routes/categoryRoute');
const subCategoryRoute = require('./routes/subCategoryRoute');
const brandRoute = require('./routes/brandRoute');
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const { globalError } = require('./middlewares/errorMiddleware');

//db Connection
dbConnection();

//express app
const app = express();

//middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

//Mount Routes
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/subcategory', subCategoryRoute);
app.use('/api/v1/brand', brandRoute);
app.use('/api/v1/product', productRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/auth', authRoute);

app.all('*', (req, res, next) => {
  next(new ApiError(`Cant find this route: ${req.originalUrl}`, 400));
});

//global middle handling middleware
app.use(globalError);

//
const server = app.listen(process.env.PORT, () => {
  console.log('App running');
});

// handle errors out of Express
process.on('unhandledRejection', (err) => {
  console.log(`UnhandleRejection Errors: ${err}`);

  // server.close(() => {
  //   console.log('Shutting down....');
  //   process.exit(1);
  // });
});
