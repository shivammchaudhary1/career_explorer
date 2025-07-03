import express from 'express';
import * as admin from '##/src/controller/admin.controller.js';
import { isRouteAllowed } from '##/src/middleware/auth.middleware.js';

const adminRoutes = express.Router();

// adminRoutes.route('/getgeneralinformation').get(admin.getGeneralInformation);
adminRoutes.route('/getgeneralinformation').get(isRouteAllowed(['admin']), admin.getGeneralInformation);
adminRoutes.route('/all-users-data').get(isRouteAllowed(['admin']), admin.getAllUsersData);
adminRoutes.route('/all-creators-data').get(isRouteAllowed(['admin']),admin.getAllCreatorsData);
adminRoutes.route('/updateStatus/:userId').patch(isRouteAllowed(['admin']),admin.updateActiveStatus);

export default adminRoutes;
