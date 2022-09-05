const mongoose = require('mongoose')
const URL = 'mongodb+srv://shopiing:0597033916@cluster0.by8rqcw.mongodb.net/?retryWrites=true&w=majority'
    //const price = require('./prodect')
let idprice
const SchemaCart = mongoose.Schema({
    name: String,
    Price: Number,
    amount: Number,
    userId: String,
    ProdectId: String,
    taimstamp: Number,
    AllPrice: Number,
    deleteAll: String
})

const SchemaOrder = mongoose.Schema({
    name: String,
    Addres: String,
    Price: Number,
    amount: Number,
    taimstamp: Number,
    AllPrice: Number,
    Status: String,
    deleteAll: String,
    ProdectId: String,
    userId: String,
    AddresAll: String,
    City: String,
    Mobaile: String,
    Street_and_neighborhood: String
})

const CrateOrder = mongoose.model('Order', SchemaOrder)

const CrateItems = mongoose.model("Cart", SchemaCart)


exports.createCart = data => {
    return new Promise((resolve, reject) => {
        mongoose.connect(URL).then(() => {



            CrateItems.find({ userId: data.userId }).then((resulte) => {
                let u
                let ids
                for (let y = 0; y < resulte.length; y++) {
                    if (data.ProdectId == resulte[y].ProdectId) {
                        ids = resulte[y]._id
                        u = y
                        console.log('The index @@@@@@@@@', u)
                        console.log(ids)
                    }
                }
                console.log("The Rsulte :==============================+++++++++++++ ", resulte)


                if (resulte == null) {
                    console.log('Wwwwwwwwwwwwwwwwwwwwwwwwwww')
                    const cart = new CrateItems(data)
                    cart.save()
                    console.log('Wwwwwwwwwwwwwwwwwwwwwwwwwww')
                } else if (u == undefined) {
                    console.log(data, 'kkkkkkkkkkkkkkkk');
                    data.amount = Number(data.amount)
                    data.AllPrice = data.amount * 5
                    console.log(data, 'dddddddddddtaaaaaaaaaaat');
                    const cart = new CrateItems(data)
                    cart.save()
                } else {



                    let am = resulte[u].amount
                    console.log(am)
                    let o = parseInt(data.amount) + parseInt(am)
                    let update = {
                        amount: o,
                        taimstamp: Date.now(),
                        AllPrice: o * data.Price
                    }
                    console.log('----------------------------------------------------------')
                    CrateItems.updateMany({ _id: ids }, update).then((resulte) => {
                        console.log('----------------Update----------------')
                        console.log(resulte)
                    })






                }




            }).catch(err => {
                console.log(err)
            })



        }).then(() => {
            resolve()
        }).catch(err => { reject(err) })
    })
}


exports.FindData = async userId => {
    try {
        let resulte = await CrateItems.find({ userId: userId }, {}, { sort: { taimstamp: 1 } })
        return resulte
    } catch (err) {
        console.log(err);
    }
}



exports.edetItems = async(id, newData) => {

    try {
        let data = await CrateItems.findOneAndUpdate({ _id: id }, newData)
        return data
    } catch (err) {
        console.log(err);
    }


}

exports.deletDelete = async(id) => {
    try {
        await CrateItems.findByIdAndDelete({ _id: id })
    } catch (err) {
        console.log(err);
    }
}






exports.Delete = async(userId) => {

    try {
        await CrateItems.deleteMany({ deleteAll: 'delete', userId: userId })

    } catch (err) {
        console.log(err);
    }
}


exports.CreatOrder = (name, amount, AllPrice, addres, status, time, price, ProdectId, userId, obj) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(URL).then(() => {
            console.log(obj);
            let data = {
                name: name,
                amount: amount,
                AllPrice: AllPrice,
                Addres: addres,
                Status: status,
                taimstamp: time,
                Price: price,
                deleteAll: 'delete',
                ProdectId: ProdectId,
                userId: userId,
                Street_and_neighborhood: obj.Street_and_neighborhood,
                Mobaile: obj.Mobaile,
                City: obj.City,
                AddresAll: obj.AddresAll
            }



            CrateOrder.find({ userId: userId }).then((resulte) => {
                console.log('The Resulte :=================', resulte)

                let u
                let ids
                for (let y = 0; y < resulte.length; y++) {
                    if (data.ProdectId == resulte[y].ProdectId) {
                        ids = resulte[y]._id
                        u = y
                        console.log('The index @@@@@@@@@', u)
                        console.log(ids)
                    }
                }
                if (resulte == []) {
                    let order = new CrateOrder(data)
                    order.save();
                } else if (resulte == null) {
                    console.log('Wwwwwwwwwwwwwwwwwwwwwwwwwww')
                    let order = new CrateOrder(data)
                    order.save();
                    console.log('yes')
                    console.log('Wwwwwwwwwwwwwwwwwwwwwwwwwww')
                } else if (u == undefined) {
                    data.Price = 4
                    let order = new CrateOrder(data)
                    order.save();
                } else {
                    console.log('no')
                    let am = parseInt(amount) + resulte[u].amount
                    let pri = price * am
                    console.log(am, "  ", typeof(am))
                    console.log(pri, "   ", typeof(pri))
                    let update = {
                        amount: am,
                        AllPrice: resulte[u].AllPrice + pri,
                        Addres: addres
                    }
                    console.log('Update................')
                    CrateOrder.updateOne({ _id: ids }, update).then(() => {
                        console.log()

                    }).catch(err => {
                        console.log(err)
                    })
                }
            })



        })
    })
}


exports.Findorder = (id) => {


    console.log('the id  :', id)
    const userId = id.valueOf()
    console.log(userId + ' ')
    const y = userId + ' '


    return new Promise((resolve, reject) => {
        mongoose.connect(URL).then(() => {
            CrateOrder.find({ userId: y }).then((result) => {
                console.log('the resulte', result)
                resolve(result)
            }).catch(err => {
                console.log(err)
                reject(err)
            })
        })
    })
}


exports.FindOrder = async() => {

    try {
        let resulte = await CrateOrder.find({})
        console.log(resulte);
        return resulte
    } catch (err) {
        console.log(err);
    }
}


exports.DeleteOrder = async(id) => {

    try {
        await CrateOrder.deleteOne({ _id: id })
    } catch (err) {
        console.log(err);
    }
}

exports.DeleteAllOrder = async() => {

    try {
        await CrateOrder.deleteMany({ deleteAll: 'delete' })
    } catch (err) {
        console.log(err);
    }
}




exports.FindDataStauts = async(status) => {
    try {
        let data = await CrateOrder.find({ Status: status })
        return data
    } catch (err) {
        console.log(err);
    }
}



exports.updateOrder = async(id, data) => {
    try {

        await CrateOrder.updateMany({ _id: id }, { Status: data })
    } catch (err) {
        console.log(err);
    }
}