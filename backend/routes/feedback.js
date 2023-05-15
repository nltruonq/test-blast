const router = require('express').Router();

const feedbackController = require('../controllers/feedbackController');

router.post('/CallApi',feedbackController.CallApi);

module.exports = router;