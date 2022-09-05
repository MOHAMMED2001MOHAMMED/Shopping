const mongoose = require('mongoose')
const bycrept = require('bcrypt')
    //const { reject } = require('bcrypt/promises')
const URL = 'mongodb+srv://shopiing:0597033916@cluster0.by8rqcw.mongodb.net/?retryWrites=true&w=majority'

let y
let updateuser
const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    Age: Number,
    Unfirsty: String,
    Phone: String,
    Addres: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    image: String

})

const User = mongoose.model('user', userSchema)

let getCreateUser = async(username, email, password) => {

    let user = await User.findOne({ email: email })
    try {
        if (user != null) {
            throw "User is already registered"

        } else {
            let hashpassword = await bycrept.hash(password, 10)

            let user = new User({
                username: username,
                email: email,
                password: hashpassword,
            })
            let user_save = await user.save()
            console.log(user_save);
        }
    } catch (err) {
        console.log(err);
        return err
    }

}

let login = async(email, password) => {
    try {
        let user = await User.findOne({ email: email })
        if (user == null) {
            throw "The Email not fund"

        } else {

            let same = await bycrept.compare(password, user.password)
            if (!same) {
                throw 'wrong password'
            } else {
                console.log(' The Admin : ', user.isAdmin)
                return {
                    id: user._id,
                    Admin: user.isAdmin
                }

            }


        }
    } catch (err) {
        console.log(err, 'err');
        return err
    }
}

let getprofile = async(id) => {
    try {
        console.log(id, 'idddddd')
        let id_user = await User.find({ _id: id })
        return id_user
    } catch (err) {
        console.log(err);
    }

}
let PostProfile = async(username, password1, id) => {


    try {
        let hashpassword1 = await bycrept.hash(password1, 10)
        updateuser = {
            username: username,
            password: hashpassword1
        }
        await User.findOneAndUpdate({ _id: id }, updateuser)
    } catch (err) {
        console.log(err);
    }

}


let GetUsers = async() => {

    try {
        let resulte = await User.find({})
        return resulte
    } catch (err) {
        console.log(err);
    }
}


let UpdateUser = async(id, Admin) => {

    try {
        await User.updateOne({ _id: id }, { isAdmin: Admin })
    } catch (err) {
        console.log(err);
    }
}

let deleteuser = async(id) => {
    try {
        await User.deleteOne({ _id: id })
    } catch (err) {
        console.log(err);
    }
}


let deleteAll = async() => {
    try {
        await User.deleteMany({ isAdmin: false })
    } catch (err) {
        console.log(err);
    }
}


module.exports = {
    login,
    getCreateUser,
    getprofile,
    GetUsers,
    deleteAll,
    deleteuser,
    UpdateUser,
    PostProfile
}