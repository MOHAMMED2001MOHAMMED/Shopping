const route = require('express').Router()
const ProdectC = require('../controller/prodectcC')


route.get('/:id', ProdectC.getProdectId)

module.exports = route