const jwt = require("jsonwebtoken");
const { User, resetToken, Sequelize } = require("../models");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/sendEmail")


module.exports.resetLink = async (req,res) => {
    let { email } = req.body
    try {
        const user =await User.findOne( { where: { email: email } } )
        if(!user) throw new Error('Email cannot be found')

        let token = await resetToken.findOne( { where: { UserId: user.id } } )
        if(!token) {
            token = await resetToken.create({
                UserId: user.id,
                token: jwt.sign({
                    id: user.id,
                    exp: Math.floor(Date.now() / 1000) + (60 * 1),
                    iss: 'toDoApp'
                  }, process.env.JWT_RESET),
                expires: Date.now() + (1000 * 60 * 1)
            })
        }
    const link = `${process.env.BASE_URL}/reset/${user.id}/${token.token}`
    await sendEmail(user.email, "Password Reset for ToDoApp", link)
    let success = "Link has been sent to your email"
    res.render('password', { success})
    } catch (error) {
        let errorObject = error.message
        res.status(400).render('password', { errorObject })
    }
}

module.exports.resetPassword = async (req,res,next) => {
    try {
        const user = await User.findOne({ where: { id : req.params.userId}})
        if(!user) throw new Error ('Invalid link or expired')

        const token = await resetToken.findOne(
            {
                where:
                {
            UserId: user.id,
            token: req.params.token
        }
    });
        if(!token) throw new Error ('Invalid link or expired')
        console.log('eloooooooooooooooo')
        const params = {
            userId: req.params.userId,
            token: req.params.token
        }
        res.render('resetPassword', {params})
    } catch(err) {
        let errorObject = err.message
        return res.status(400).redirect('/');
    }
}

module.exports.changePassword = async (req,res) => {
    const { password, confirmation } = req.body
    const { userId, token } = req.params
try {
    if(password != confirmation) throw new Error ('Passwords does not match')
    let  token  = await resetToken.findOne( { where: { UserId: userId } } )
    if(!token) throw new Error ('Invalid link or expired')
    let decode = jwt.verify(token.token, process.env.JWT_RESET)
    
    if(!decode) throw new Error ('Invalid link or expired')
    await User.update( { password : bcrypt.hashSync(password, Number(process.env.SALT), process.env.JWT_RESET) }, { where: { id: userId } } )
    await resetToken.destroy({ where: { token : token.token }})

    res.send("Password reset succesfully")
} catch(err) {
    const params = { userId, token }
    let errorObject = err.message
    return res.status(400).render('resetPassword', { errorObject, params });
}
}