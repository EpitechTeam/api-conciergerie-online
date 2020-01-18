const express = require('express')

const router = express.Router()
const freelanceService = require('../services/algolia/freelance')

router.put('/freelance', freelanceService.insertFreelance)
router.get('/freelance', freelanceService.findFreelanceByCity)
router.delete('/freelance', freelanceService.deleteFreelanceById)

module.exports = router