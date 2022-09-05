const session = require('express-session')
const aouthM = require('../models/aouthM')
const { login, getCreateUser, getprofile } = require('../models/aouthM')
const validationResult = require('express-validator').validationResult

let errprofile = []

exports.getSuinup = (req, res, next) => {
    let errors = req.flash('ErrorSuinup')
    console.log(errors);
    res.render('Suinup', {
        errors: errors,
        isUser: req.session.userId,

    })

}

exports.postSuinup = async(req, res, next) => {
    try {
        if (validationResult(req).array().length >= 1) {
            req.flash('ErrorSuinup', validationResult(req).array())
            res.redirect('/Suinup')
        } else {
            let user_create = await getCreateUser(req.body.username, req.body.email, req.body.password)
            console.log(user_create);
            if (user_create == 'User is already registered') { throw user_create } else {
                res.redirect('/login')
            }

        }
    } catch (err) {
        console.log(err);
        req.flash('ErrorSuinup', err)
        res.redirect("/Suinup")
    }

}

exports.getlogin = (req, res, next) => {

    let error = req.flash('ErrorAouth')
    console.log(error);
    res.render('login', {
        error: error,
        isUser: req.session.userId,

    })
    err5 = []
}

exports.Postlogin = async(req, res, next) => {
    try {
        if (validationResult(req).array().length >= 1) {
            req.flash('ErrorAouth', validationResult(req).array())
            res.redirect('/login')
        } else {
            let login_user = await login(req.body.email, req.body.password)
            if (login_user == 'The Email not fund' || login_user == 'wrong password') { throw login_user } else {
                req.session.userId = login_user.id,
                    req.session.AdminId = login_user.Admin
                console.log(login_user);
                res.redirect('/')
            }
        }


    } catch (err) {
        console.log(err, 'ssssssssaaaa');
        req.flash('ErrorAouth', err)
        res.redirect('/login')
    }

}


exports.logout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}


exports.getProfile = async(req, res, next) => {
    try {
        let resualt = await getprofile(req.session.userId)
        console.log(resualt);
        console.log(req.session.userId)
        res.render('profile', {
            isUser: req.session.userId,
            profile: resualt[0],
            errprofile: errprofile,
            isAdmin: req.session.AdminId

        })
        errprofile = []

    } catch (err) {
        console.log(err);
    }
}


exports.postprofile = (req, res, next) => {

    let e = validationResult(req).array()
    for (let o = 0; o < e.length; o++) {
        errprofile[o] = e[o].msg
    }
    console.log(errprofile)



    aouthM.PostProfile(req.body.username, req.body.password, req.session.userId).then(resualt => {
        console.log(resualt)
        res.redirect('/profile')
    }).catch(err => {
        console.log(err)
        res.redirect('/profile')
    })
}