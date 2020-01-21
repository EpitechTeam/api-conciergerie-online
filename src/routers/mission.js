const express = require('express')

const router = express.Router()
const missionService = require('../services/algolia/mission')

router.put('/mission', missionService.insertMission)
router.post('/getmissionbycity', missionService.findMissionByCity)
router.delete('/mission', missionService.deleteMissionById)

module.exports = router