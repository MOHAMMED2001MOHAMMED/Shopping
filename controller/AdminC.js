const { validationResult } = require('express-validator')
const prodectM = require('../models/prodect')

const AWS = require('aws-sdk')

let getAddProdect = (req, res, next) => {
    res.render('Add-prodect', {
        isUser: true,
        isAdmin: true,
        isUser: req.session.userId,

    })

}

const s3 = new AWS.S3({
    accessKeyId: 'AKIAWDTAFJN2LIK7AF7G',
    secretAccessKey: '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',
    //signatureVersion: '4',
    //region: 'us-east-1'
})

let postProdect = (req, res, next) => {




    if (validationResult(req).isEmpty()) {

        console.log("The File :  PostProdect", req.file)

        let myfile = req.file.originalname.split(".")
        console.log(myfile);
        const filetype = myfile[myfile.length - 1]
        console.log(filetype);

        let params = {
            Bucket: 'jalhoom2001',
            Key: `${req.file.originalname}-${Date.now()}.${filetype}`,
            Body: req.file.buffer
        }

        s3.upload(params, (err, doc) => {
            if (err) {
                console.log(err);
            } else {
                console.log(doc);
                let data = {
                    name: req.body.name,
                    image: doc.Location,
                    type: req.body.type,
                    description: req.body.Description,
                    category: req.body.Category,
                    prise: req.body.price,

                }
                prodectM.Createprodect(data).then((resulte) => {
                    console.log('The Resulte : ', resulte)
                    res.redirect('/Admin/Add-prodect')
                })
            }
        })


    } else {
        res.redirect('/Admin/Add-prodect')
    }
}



module.exports = {
    postProdect,
    getAddProdect
}