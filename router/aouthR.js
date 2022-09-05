const route = require('express').Router()
const check = require('express-validator').check
const aouthC = require('../controller/aouthC')
const authgurds = require('./gurdes/auth.gurds')
const aouthM = require('../models/aouthM')

const { GetUsers } = require('../models/aouthM')
const multer = require('multer')

route.get('/Suinup', authgurds.notAuth, aouthC.getSuinup)
route.post('/Suinup',
    check('username').not().isEmpty().withMessage("The username is Empty"),
    check('password').isLength({ min: 5 }).withMessage('Please enter more than 5 items '),
    aouthC.postSuinup)


route.get('/login', authgurds.notAuth, aouthC.getlogin)
route.post('/login',
    check('password').isLength({ min: 5 }).withMessage('Please enter more then 5 items '), aouthC.Postlogin)

route.get('/profile', aouthC.getProfile)

route.post('/profile',
    check('username').not().isEmpty().withMessage('The Enter in Email is Empty'),
    check('password').not().isEmpty().withMessage('The Enter in Password is Empty'),
    check('password').isLength({ min: 5 }).withMessage('please enter more from 5 element '), aouthC.postprofile)
route.all('/logout', aouthC.logout)


route.get('/User', async(req, res, next) => {
    let resulte = await GetUsers()
    res.render('user', {
        isUser: req.session.userId,
        isAdmin: req.session.AdminId,
        result: resulte
    })


})


route.post('/User/Save/:id', (req, res, next) => {
    const id = req.params.id
    const Admin = req.body.Admin
    aouthM.UpdateUser(id, Admin).then(() => {
        res.redirect('/User')
    }).catch(err => {
        res.redirect('/User')
    })
})


route.post('/User/Delete/:id', (req, res, next) => {
    const id = req.params.id
    aouthM.deleteuser(id).then(() => {
        res.redirect('/User')
    }).catch(err => {
        res.redirect('/User')
    })
})


route.post('/User/DeleteAll', (req, res, next) => {
    aouthM.deleteAll().then(() => {
        res.redirect('/User')
    }).catch(err => {
        res.redirect('/User')
    })
})

module.exports = route