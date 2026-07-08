const User = require('../models/user.model');

async function getUsers(req, res) {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(500).send('Server error');
        console.log(error);
    }
}

module.exports = { getUsers };
