// Helper functions

const User = require('../models/userModel');

async function checkDuplicateUserOrEmail(userName, email) {
    try{
        // First check if a userName is already taken
        const duplicateUser = await User.findOne({ userName: userName });
        if (duplicateUser) {
            return { error: 'Username already exists' };
        }
        // Check if the email is already taken
        const duplicateEmail = await User.findOne({ email: email });
        if (duplicateEmail) {
            return { error: 'Email already in use' };
        }
    } catch (err) {
        return { error: err };
    }
    return null;
}





module.exports = {
    checkDuplicateUserOrEmail
};