const router = require('express').Router();
const Post = require('../models/post');

const Postcontollers = require("../controllers/post"); 

const checkAuth = require("../middleware/check-auth")
const uploadImg = require("../middleware/upload-img")



router.post("" ,checkAuth, uploadImg , Postcontollers.createPost );

router.put("/:id",checkAuth , uploadImg ,Postcontollers.updatePost)

router.get("/:id", Postcontollers.getPostbyId)

router.get("", Postcontollers.getPost)

router.delete("/:id",checkAuth, Postcontollers.deletePost)


module.exports = router