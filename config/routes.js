const express = require('express');
const router = express.Router();

const statics = require('../controllers/statics');
const plants = require('../controllers/plants');
const registrations = require('../controllers/registrations');
const sessions = require('../controllers/sessions');
const user = require('../controllers/users');

const upload = require('../lib/s3-upload');

function secureRoute(req, res, next) {
  if(!req.session.userId) {
    return req.session.regenerate(() => {
      req.flash('danger', 'You must be logged in to view this page');
      res.redirect('/login');
    });
  }
  return next();
}

router.route('/')
  .get(statics.index);

router.route('/login')
  .get(sessions.new)
  .post(sessions.create);

router.route('/logout')
  .get(sessions.delete);

router.route('/register')
  .get(registrations.new)
  .post(registrations.create);

router.route('/plants')
  .get(secureRoute, plants.index)
  .post(secureRoute, upload.single('file'), plants.create);
router.route('/plants/all')
  .get(secureRoute, plants.all);
router.route('/plants/new')
  .get(secureRoute, plants.new);
router.route('/plants/:id')
  .get(secureRoute, plants.show)
  .post(secureRoute, upload.single('file'), plants.update)
  .delete(secureRoute, plants.delete);
router.route('/plants/:id/edit')
  .get(secureRoute, plants.edit);
router.route('/plants/:id/watered/')
  .get(secureRoute, plants.watered);
router.route('/plants/:id/gallery')
  .get(secureRoute, plants.galleryIndex)
  .post(secureRoute, upload.single('file'), plants.galleryUpdate);
router.route('/plants/:id/picture/:picture_id')
  .delete(secureRoute, plants.galleryImageDelete);



router.route('/plants/:id/comments')
  .post(secureRoute, plants.commentCreate);
router.route('/plants/:id/comments/:commentId')
  .delete(secureRoute, plants.commentDelete);

router.route('/user/:id')
  .get(secureRoute, user.show);

module.exports = router;
