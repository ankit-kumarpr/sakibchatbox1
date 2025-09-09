const express = require('express');
const router = express.Router();
const {
    createGroup,
    getGroups,
    removeUsersFromGroup,
    addUsersToGroup,
    GetgroupBYId
} = require('../controllers/groupController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

router.post(
  '/create',
  authenticateToken,
  authorizeRole('admin'),
  createGroup
);

router.post(
  '/add-users',
  authenticateToken,
  authorizeRole('admin'),
  addUsersToGroup
);

router.post(
  '/remove-users',
  authenticateToken,
  authorizeRole('admin'),removeUsersFromGroup
);

router.get(
  '/getgroup',
  authenticateToken,
  getGroups
);
router.get('/getgroupdata/:groupId',GetgroupBYId)

module.exports = router;
