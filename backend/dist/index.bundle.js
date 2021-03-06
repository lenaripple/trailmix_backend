module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var devConfig = {
  MONGO_URL: 'mongodb://localhost/trailmix_final-dev',
  JWT_SECRET: 'secret'
};
var testConfig = {
  MONGO_URL: 'mongodb://localhost/trailmix_final-test'
};
var prodConfig = {
  MONGO_URL: 'mongodb://heroku_g6cmp0qw:ee953ghad3t5pp149m7etmilef@ds157702.mlab.com:57702/heroku_g6cmp0qw',
  JWT_SECRET: 'secret'
};
var defaultConfig = {
  PORT: process.env.PORT || 3000
};

function envConfig(env) {
  switch (env) {
    case 'development':
      return devConfig;
    case 'test':
      return testConfig;
    default:
      return prodConfig;
  }
}

exports.default = Object.assign({}, defaultConfig, envConfig(process.env.NODE_ENV));

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = __webpack_require__(2);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _validator2 = __webpack_require__(22);

var _validator3 = _interopRequireDefault(_validator2);

var _bcryptNodejs = __webpack_require__(23);

var _jsonwebtoken = __webpack_require__(24);

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _user = __webpack_require__(7);

var _constants = __webpack_require__(0);

var _constants2 = _interopRequireDefault(_constants);

var _mongooseUniqueValidator = __webpack_require__(9);

var _mongooseUniqueValidator2 = _interopRequireDefault(_mongooseUniqueValidator);

var _post = __webpack_require__(10);

var _post2 = _interopRequireDefault(_post);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserSchema = new _mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Please enter a valid email!'],
    trim: true,
    validate: {
      validator: function validator(email) {
        return _validator3.default.isEmail(email);
      },

      message: '{VALUE} is not a valid email'
    }
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    trim: true,
    minlength: [6, 'Password must be at least six characters'],
    validate: {
      validator: function validator(password) {
        return _user.passwordReg.test(password);
      },

      message: '{VALUE} is not a valid password'
    }
  },
  savedTrips: {
    posts: [{
      type: _mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }]
  }
});

UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = this._hashPassword(this.password);
  }
  return next();
});

UserSchema.plugin(_mongooseUniqueValidator2.default, {
  message: '{VALUE} already taken.'
});

UserSchema.methods = {
  _hashPassword: function _hashPassword(password) {
    return (0, _bcryptNodejs.hashSync)(password);
  },
  authenticateUser: function authenticateUser(password) {
    return (0, _bcryptNodejs.compareSync)(password, this.password);
  },
  createToken: function createToken() {
    return _jsonwebtoken2.default.sign({
      _id: this._id
    }, _constants2.default.JWT_SECRET);
  },
  toAuthJSON: function toAuthJSON() {
    return {
      _id: this._id,
      username: this.username,
      token: 'JWT ' + this.createToken()
    };
  },
  toJSON: function toJSON() {
    return {
      _id: this._id,
      username: this.username
    };
  },


  _savedTrips: {
    posts: async function posts(postId) {
      if (this.savedTrips.posts.indexOf(postId) >= 0) {
        this.savedTrips.posts.remove(postId);
        await _post2.default.decMembersCount(postId);
      } else {
        this.savedTrips.posts.push(postId);
        await _post2.default.incMembersCount(postId);
      }
      return this.save();
    },
    isSaved: function isSaved(postId) {
      if (this.savedTrips.posts.indexOf(postId) >= 0) {
        return true;
      }
      return false;
    }
  }
};

exports.default = _mongoose2.default.model('User', UserSchema);

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("express-validation");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authJwt = exports.authLocal = undefined;

var _passport = __webpack_require__(4);

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = __webpack_require__(20);

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _passportJwt = __webpack_require__(21);

var _user = __webpack_require__(3);

var _user2 = _interopRequireDefault(_user);

var _constants = __webpack_require__(0);

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//local strategy
var localOpts = {
  usernameField: 'email'
};
var localStrategy = new _passportLocal2.default(localOpts, async function (email, password, done) {
  try {
    var user = await _user2.default.findOne({ email: email });

    if (!user) {
      return done(null, false);
    } else if (!user.authenticateUser(password)) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

//JWT strategy
var jwtOpts = {
  jwtFromRequest: _passportJwt.ExtractJwt.fromAuthHeader('authorization'),
  secretOrKey: _constants2.default.JWT_SECRET
};
var jwtStrategy = new _passportJwt.Strategy(jwtOpts, async function (payload, done) {
  try {
    var user = await _user2.default.findById(payload._id);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

_passport2.default.use(localStrategy);
_passport2.default.use(jwtStrategy);

var authLocal = exports.authLocal = _passport2.default.authenticate('local', { session: false });
var authJwt = exports.authJwt = _passport2.default.authenticate('jwt', { session: false });

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.passwordReg = undefined;

var _joi = __webpack_require__(8);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var passwordReg = exports.passwordReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

exports.default = {
  signup: {
    body: {
      email: _joi2.default.string().email().required(),
      firstName: _joi2.default.string().required(),
      lastName: _joi2.default.string().required(),
      username: _joi2.default.string().required(),
      password: _joi2.default.string().regex(passwordReg).required()
    }
  }
};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("joi");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("mongoose-unique-validator");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = __webpack_require__(2);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _slug = __webpack_require__(25);

var _slug2 = _interopRequireDefault(_slug);

var _mongooseUniqueValidator = __webpack_require__(9);

var _mongooseUniqueValidator2 = _interopRequireDefault(_mongooseUniqueValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PostSchema = new _mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Title is required'],
    minlength: [3, 'Title must be at least three characters'],
    unique: true
  },
  date: {
    type: Date,
    trim: true,
    required: [true, 'Date is required']
  },
  location: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Description is required']
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true
  },
  extra: {
    type: String,
    trim: true
  },
  user: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rating: {
    type: Number
  },
  membersCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

PostSchema.plugin(_mongooseUniqueValidator2.default, {
  message: '{VALUE} already taken.'
});

PostSchema.pre('validate', function (next) {
  this._slugify();
  next();
});

PostSchema.methods = {
  _slugify: function _slugify() {
    this.slug = (0, _slug2.default)(this.title);
  },
  toJSON: function toJSON() {
    return {
      _id: this._id,
      _title: this.title,
      user: this.user,
      date: this.date,
      location: this.location,
      description: this.description,
      rating: this.rating,
      slug: this.slug,
      createdAt: this.createdAt
    };
  }
};

PostSchema.statics = {
  createPost: function createPost(args, user) {
    return this.create(Object.assign({}, args, { user: user }));
  },
  list: function list() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$skip = _ref.skip,
        skip = _ref$skip === undefined ? 0 : _ref$skip;

    return this.find().sort({ createdAt: -1 }).skip(skip).populate('user');
  },
  incMembersCount: function incMembersCount(postId) {
    return this.findByIdAndUpdate(postId, { $inc: { membersCount: 1 } });
  },
  decMembersCount: function decMembersCount(postId) {
    return this.findByIdAndUpdate(postId, { $inc: { membersCount: -1 } });
  }
};

exports.default = _mongoose2.default.model('Post', PostSchema);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _constants = __webpack_require__(0);

var _constants2 = _interopRequireDefault(_constants);

__webpack_require__(12);

var _middleware = __webpack_require__(13);

var _middleware2 = _interopRequireDefault(_middleware);

var _modules = __webpack_require__(18);

var _modules2 = _interopRequireDefault(_modules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

(0, _middleware2.default)(app);

app.get('/', function (req, res) {
  res.send('Hello world');
});

(0, _modules2.default)(app);
//
// const server = app.listen(3000, ()=>{
//   const {address, port} = server.address()
//   console.log(`listening on ${address}: ${port}`);
// })

app.listen(_constants2.default.PORT, function (err) {
  if (err) {
    throw err;
  } else {
    console.log('server running on ' + _constants2.default.PORT + ', server running on ' + process.env.NODE_ENV);
  }
});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mongoose = __webpack_require__(2);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _constants = __webpack_require__(0);

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//handle warning with Promise
_mongoose2.default.Promise = global.Promise;

//connect the db to your url
try {
  _mongoose2.default.connect(_constants2.default.MONGO_URL);
} catch (err) {
  _mongoose2.default.createConnection(_constants2.default.MONGO_URL);
}
_mongoose2.default.connection.once('open', function () {
  return console.log('mongodb is running');
}).on('error', function (err) {
  throw err;
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _morgan = __webpack_require__(14);

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = __webpack_require__(15);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _compression = __webpack_require__(16);

var _compression2 = _interopRequireDefault(_compression);

var _helmet = __webpack_require__(17);

var _helmet2 = _interopRequireDefault(_helmet);

var _passport = __webpack_require__(4);

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isDev = process.env.NODE_ENV === 'development';
var isProd = process.env.NODE_ENV === 'production';

exports.default = function (app) {
  if (isProd) {
    app.use((0, _compression2.default)());
    app.use((0, _helmet2.default)());
  }
  app.use(_bodyParser2.default.json());
  app.use(_bodyParser2.default.urlencoded({ extended: true }));
  app.use(_passport2.default.initialize());
  if (isDev) {
    app.use((0, _morgan2.default)('dev'));
  }
};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("compression");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("helmet");

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = __webpack_require__(19);

var _user2 = _interopRequireDefault(_user);

var _post = __webpack_require__(27);

var _post2 = _interopRequireDefault(_post);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
  app.use('/api/v1/users', _user2.default);
  app.use('/api/v1/posts', _post2.default);
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(1);

var _expressValidation = __webpack_require__(5);

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _auth = __webpack_require__(6);

var _user = __webpack_require__(26);

var userController = _interopRequireWildcard(_user);

var _user2 = __webpack_require__(7);

var _user3 = _interopRequireDefault(_user2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = new _express.Router();

routes.post('/signup', (0, _expressValidation2.default)(_user3.default.signup), userController.signUp);
routes.post('/login', _auth.authLocal, userController.login);

exports.default = routes;

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("passport-jwt");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("validator");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("bcrypt-nodejs");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("slug");

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signUp = signUp;
exports.login = login;

var _user = __webpack_require__(3);

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function signUp(req, res) {
  try {
    var user = await _user2.default.create(req.body);
    return res.status(201).json(user.toAuthJSON());
  } catch (error) {
    return res.status(500).json(error);
  }
};

function login(req, res, next) {
  res.status(200).json(req.user.toAuthJSON());

  return next();
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(1);

var _post = __webpack_require__(28);

var postController = _interopRequireWildcard(_post);

var _auth = __webpack_require__(6);

var _expressValidation = __webpack_require__(5);

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _post2 = __webpack_require__(29);

var _post3 = _interopRequireDefault(_post2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var routes = new _express.Router();

routes.post('/', _auth.authJwt, (0, _expressValidation2.default)(_post3.default.createPost), postController.createPost);

routes.get('/:id', postController.getPostById);

routes.get('/', postController.getPostsList);

routes.patch('/:id', _auth.authJwt, (0, _expressValidation2.default)(_post3.default.updatePost), postController.updatePost);

routes.delete('/:id', _auth.authJwt, postController.deletePost);

routes.post('/:id/savetrip', _auth.authJwt, postController.saveTrip);

exports.default = routes;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPost = createPost;
exports.getPostById = getPostById;
exports.getPostsList = getPostsList;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
exports.saveTrip = saveTrip;

var _post = __webpack_require__(10);

var _post2 = _interopRequireDefault(_post);

var _user = __webpack_require__(3);

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function createPost(req, res) {
  try {
    var post = await _post2.default.createPost(req.body, req.user._id);
    return res.status(201).json(post);
  } catch (error) {
    return res.status(400).json(error);
  }
};
async function getPostById(req, res) {
  try {
    var promise = await Promise.all([_user2.default.findById(req.user._id), _post2.default.findById(req.params.id).populate('user')]);
    var saved = promise[0]._savedTrips.isSaved(req.params.id);
    var post = promise[1];
    return res.status(201).json(Object.assign({}, post.toJSON(), {
      saved: saved
    }));
  } catch (error) {
    return res.status(500).json(error);
  }
};

async function getPostsList(req, res) {
  try {
    var promise = await Promise.all([_user2.default.findById(req.user._id), _post2.default.list()]);
    var posts = promise[1].reduce(function (arr, post) {
      var saved = promise[0]._savedTrips.isSaved(post._id);
      arr.push(Object.assign({}, post.toJSON(), {
        saved: saved
      }));
      return arr;
    }, []);
    return res.status(201).json(posts);
  } catch (error) {
    return res.status(500).json(error);
  }
};

async function updatePost(req, res) {
  try {
    var post = await _post2.default.findById(req.params.id);
    if (!post.user.equals(req.user._id)) {
      return res.sendStatus(403);
    }
    Object.keys(req.body).forEach(function (key) {
      post[key] = req.body[key];
    });
    return res.status(200).json((await post.save()));
  } catch (error) {
    return res.status(500).json(error);
  }
};

async function deletePost(req, res) {
  try {
    var post = await _post2.default.findById(req.params.id);
    if (!post.user.equals(req.user._id)) {
      return res.sendStatus(403);
    }
    await post.remove();
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json(error);
  }
};

async function saveTrip(req, res) {
  try {
    var user = await _user2.default.findById(req.user._id);
    await user._savedTrips.posts(req.params.id);
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json(error);
  }
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = __webpack_require__(8);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  createPost: {
    body: {
      title: _joi2.default.string().min(3).required(),
      date: _joi2.default.date().required(),
      location: _joi2.default.string(),
      description: _joi2.default.string().required(),
      extra: _joi2.default.string(),
      rating: _joi2.default.number()
    }
  },
  updatePost: {
    body: {
      title: _joi2.default.string().min(3),
      date: _joi2.default.date(),
      location: _joi2.default.string(),
      description: _joi2.default.string(),
      extra: _joi2.default.string(),
      rating: _joi2.default.number()
    }
  }
};

/***/ })
/******/ ]);