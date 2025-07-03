import express from 'express';
import * as schoolContact from '##/src/controller/schoolContactForm.controller.js';
const schoolContactRoute = express.Router();
import { isRouteAllowed, isAuthenticated } from '##/src/middleware/auth.middleware.js';

schoolContactRoute.route('/saveschoolcontactform/:userId').post(schoolContact.saveContactData);

schoolContactRoute
  .route('/getschoolcontactform/:userId')
  .get(isAuthenticated, isRouteAllowed(['admin']), schoolContact.getAllSchoolContactData);

export default schoolContactRoute;
