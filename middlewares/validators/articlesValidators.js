const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

function validateURL(value, helpers) {
  console.log(validator.isURL(value));
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
}

module.exports.validateCreateArticle = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    keyword: Joi.string().required(),
    source: Joi.string().required(),
    url: Joi.string().required().custom(validateURL),
    urlToImage: Joi.string().required().custom(validateURL),
    publishedAt: Joi.string().required(),
  }),
});
