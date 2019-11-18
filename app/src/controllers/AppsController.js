const Apps = require('../models/Apps')

const getRecords = (req, res) => {
    const apps = Apps.find().limit(20)
    .then( result => {
        res.json(result)
    })
}

const findId = (req, res) => {
    const id = req.params.id
    Apps.findById(id)
    .then(app => {
        if(!app) res.json({ status: "No document found by that id"})
        else res.json(app)
    })
    .catch(err => {
        res.json(err)
    })
}

const getCategories = (req, res) => {
    Apps.find().distinct('Category')
    .then(result => {
        return res.json(result)
    })
    .catch(err => {
        res.json(err)
    })
}

exports.appsOnCategory = async (req, res) => {
    category = req.params.category
    const appList = await Apps.find({ Category: category })
    const numberOfApps = await Apps.countDocuments({ Category: category})
    return res.json({
        numberOfApps,
        appList
    })
}

exports.getMostReviewed = async (req, res) => {
    category = req.params.category
        const apps = await Apps.find({ Category: category }).sort({ Reviews: 'desc' }).limit(10)
    return res.json(apps)
}

exports.findName = async (req, res) => {
    const name = req.query.name
    const apps = await Apps.find({ App: new RegExp(name,'i')})
    return res.json(apps)
}

exports.deletebyId = async (req, res) => {
    const id = req.params.id
    try{ 
        const app = await Apps.findByIdAndDelete(id)
    }
    catch(e){
        res.json(e)
    }
    return res.json(app)
}

exports.createApp = async (req, res) => {
    app = new Apps()
    app.App = 'SUPERMAN'
    app.Category = 'BUKU'
    app.Size = '10MB'
    try {
        app = await app.save()
    }
    catch (e){
        res.json(e)
    }
    res.json(app)
}

exports.getRecords = getRecords
exports.findId = findId
exports.getCategories = getCategories