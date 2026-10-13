const express = require('express');
const controller = require('../controllers/opportunityController');
const { validateCreate, validateUpdate, validateId } = require('../middleware/validate');

const router = express.Router();

router.post('/', validateCreate, controller.createOpportunity);
router.get('/', controller.getAllOpportunities);
router.get('/:id', validateId, controller.getOpportunityById);
router.put('/:id', validateId, validateUpdate, controller.updateOpportunity);
router.delete('/:id', validateId, controller.deleteOpportunity);

module.exports = router;
