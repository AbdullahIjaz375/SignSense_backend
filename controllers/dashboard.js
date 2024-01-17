const express = require('express')
const User = require('../models/user')

async function loadUsers(req, res) {
    try {
        const userEmail = req.query.userEmail;

        const users = await User.findById(userEmail).populate('friends');

        if (!users) {
            res.status(400).json({ message: 'No friends for this user profile.' })
        }

        res.status(200).json({ message: 'All friends returned', data: friends })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function addFriend(req, res) {
    try {
        const { userEmail, friendEmail } = req.body;

        // Find the user and friend by email
        const user = await User.findOne({ email: userEmail });
        const friend = await User.findOne({ email: friendEmail });

        if (!user || !friend) {
            return res.status(404).json({ message: 'User or friend not found.' });
        }

        // Check if the friend is already in the user's friends list
        if (user.friends.includes(friend._id)) {
            return res.status(400).json({ message: 'User is already a friend.' });
        }

        // Add the friend to the user's friends list
        user.friends.push(friend._id);
        await user.save();

        res.status(200).json({ message: 'Friend added successfully.', data: { friendEmail, userEmail } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = {
    loadUsers, addFriend
}