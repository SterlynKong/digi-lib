// Require AuthenticationError from Apollo Server
const {AuthenticationError} = require('apollo-server-express');

// Require user model
const {User} = require('../models');

// Require signToken method from auth utility - auth.js
const {signToken} = require('../utils/auth');

// Define resolvers
const resolvers = { // Define query to find user initiating query and return error if not found
    Query: {
        me: async (parent, args, context) => { // Search for user by supplied id being carefult to not return the password to client
            if (context.user) {
                const userData = await User.findOne({_id: context.user}).select('-__v -password');
                return userData;
            }

            throw new AuthenticationError('You are not logged in!');
        }
    },

    // Define mutations
    Mutation: { // Create user
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
        },

        // Login user
        loginUser: async (parent, {email, password}) => {
            const user = await User.findOne({email});

            // Validate user supplied by client actally exists and throw error if not found
            if (! user) {
                throw new AuthenticationError('Credentials incorrect! Please try again.')
            }

            const validPassword = await user.isCorrectPassword(password);

            if (! validPassword) {
                throw new AuthenticationError('Credentials incorrect! Please try again.')
            }

            const token = signToken(user);
            return {token, user};
        },

        // Save Book
        saveBook: async (parent, {
            bookData
        }, context) => { // Check that user is logged in before allowing saving of books and throw error if not logged in
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate({
                    _id: context.user._id
                }, {
                    $push: {
                        savedBooks: bookData
                    }
                }, {new: true});

                return updatedUser;
            }

            throw new AuthenticationError('This action is only allowed for logged in users!')
        },

        // Remove Book
        removeBook: async (parent, {
            bookId
        }, context) => { // Check that user is logged in before allowing saving of books and throw error if not logged in
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate({
                    _id: context.user._id
                }, {
                    $push: {
                        savedBooks: {
                            bookId
                        }
                    }
                }, {new: true});

                return updatedUser;
            }

            throw new AuthenticationError('This action is only allowed for logged in users!')
        }
    }
};

module.exports = resolvers;
