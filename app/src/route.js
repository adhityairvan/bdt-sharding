const express = require('express')

const router = express.Router();

const { getRecords, findId, getCategories, appsOnCategory, getMostReviewed, findName, deletebyId, createApp, updateApp } = require('./controllers/AppsController')

router.get('/Apps', getRecords)
router.post('/Apps/create', createApp)
router.put('/Apps/update/:id', updateApp)
router.get('/findApp/:id', findId)
router.delete('/Apps/delete/:id', deletebyId )
router.get('/findName', findName)
router.get('/categories', getCategories)
router.get('/categories/:category', appsOnCategory)
router.get('/mostReviewed/:category', getMostReviewed)

module.exports = router;