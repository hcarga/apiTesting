const joi = require('joi')

const quotesSchema = joi.object({
    id: joi.number().required(),
    dialogue: joi.boolean(),
    private: joi.boolean(),
    tags: joi.array(),
    url: joi.string(),
    favorites_count: joi.number(),
    upvotes_count: joi.number(),
    downvotes_count: joi.number(),
    author: joi.string().required(),
    author_permalink: joi.string(),
    body: joi.string().required()
})

// const userSchema = joi.object({
    
// })

module.exports = {
    quotesSchema
}