import { Router } from 'express';
import * as postController from './post.controller';
import { authJwt } from '../../services/auth.services';
import validate from 'express-validation';
import postValidation from './post.validation';

const routes = new Router();

routes.post('/', authJwt, validate(postValidation.createPost), postController.createPost);

export default routes;
