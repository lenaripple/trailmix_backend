import Joi from 'joi';

export default {
  createPost: {
    body:{
      title: Joi.string().min(3).required(),
      date: Joi.date().required(),
      location: Joi.string(),
      description: Joi.string().required(),
      extra: Joi.string(),
      rating: Joi.number()
    },
  },
  updatePost: {
    body:{
      title: Joi.string().min(3),
      date: Joi.date(),
      location: Joi.string(),
      description: Joi.string(),
      extra: Joi.string(),
      rating: Joi.number(),
    },
  },
};
