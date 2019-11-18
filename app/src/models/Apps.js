const mongoose = require('mongoose')
require('mongoose-double')(mongoose);

const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const AppsSchema = new Schema({
    App: {
        type: String,
        unique: true,
        required: true,
    },
    Category: {
        type: String,
        uppercase: true,
    },
    Rating: {
        type: Number,
        default: 0,
    },
    Reviews: {
        type: Number,
        default: 0,
    },
    Size: {
        type: String,
        required: true,
        uppercase: true
    },
    Installs: {
        type: String,
    },
    Type: {
        type: String,
        default: "Free",
    },
    Price: {
        type: Number,
        default: 0,
    },
    Content_Rating: {
        type: String,
    },
    Genres: {
        type: String,
    },
    Last_Updated: {
        type: String,
    },
    Current_Ver: {
        type: String,
    },
    Android_Ver: {
        type: String,
    }
},
{
    shardKey: { "_id": 'hashed' }
});

const Apps = mongoose.model('Apps', AppsSchema, 'Apps')

module.exports = Apps