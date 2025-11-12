'use strict';
const Joi = require('joi');

const email = Joi.string().email().required();
const password = Joi.string().min(6).required();
const name = Joi.string().min(1).max(120);
const productId = Joi.string().min(1).required();
const qty = Joi.number().integer().min(1).required();

const productBase = {
  name: Joi.string().min(1).required(),
  sku: Joi.string().min(1).required(),
  price: Joi.number().min(0).required(),
  currency: Joi.string().min(1).max(6).required(),
  stock: Joi.number().integer().min(0).required(),
  images: Joi.array().items(Joi.string()),
  description: Joi.string().allow(''),
  category: Joi.string().allow(''),
  tags: Joi.array().items(Joi.string()),
  active: Joi.boolean(),
};

const Validators = {
  // PUBLIC_INTERFACE
  validateRegister(body) {
    /** Validate register input */
    return Joi.object({ email, password, name }).validate(body);
  },
  // PUBLIC_INTERFACE
  validateLogin(body) {
    /** Validate login input */
    return Joi.object({ email, password }).validate(body);
  },
  // PUBLIC_INTERFACE
  validateProductCreate(body) {
    /** Validate product create */
    return Joi.object(productBase).validate(body);
  },
  // PUBLIC_INTERFACE
  validateProductUpdate(body) {
    /** Validate product update (partial) */
    return Joi.object(productBase).fork(Object.keys(productBase), (s) => s.optional()).min(1).validate(body);
  },
  // PUBLIC_INTERFACE
  validateCartAdd(body) {
    /** Validate adding item to cart */
    return Joi.object({ productId, qty }).validate(body);
  },
  // PUBLIC_INTERFACE
  validateCartUpdate(body) {
    /** Validate updating quantity of a cart line */
    return Joi.object({ qty }).validate(body);
  },
};

module.exports = Validators;
