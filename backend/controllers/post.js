
const Post = require('../models/post');

exports.createPost =  async (req, res, next)=>{

    const url = req.protocol + '://' + req.get('host');

    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imgPath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    try {
        const savepost = await post.save();

        res.status(201).json({
            message: "post Created",
            post: {
                ...savepost,
                id: savepost._id
            }
        })

    } catch (error) {
        console.log(error);
    }
    
}

exports.updatePost = async (req, res, next)=>{

    let imgPath = req.body.imgPath;
    if(req.file){
        const url = req.protocol + '://' + req.get('host');
        imgPath = url + "/images/" + req.file.filename;
    }

    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imgPath: imgPath,
        creator: req.userData.userId
    });


    try {
        const updatepost = await Post.updateOne({_id: req.body.id, creator: req.userData.userId}, post);

        if(updatepost.n > 0){
            res.status(200).json({message: "updated successfull"});

        }else{
            res.status(401).json({message: "UnAuthorized"});

        }

    } catch (error) {
        res.json({"error": error});
    }

}

exports.getPost = async (req, res)=>{

    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;

    const postQuery = Post.find();

    if(pageSize && currentPage){
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }


    try {
        const post = await postQuery;
        const postCount = await Post.count();
        res.json({
            message: "Post fetched succesfully",
            posts: post,
            maxPosts: postCount
        });
    } catch (error) {
        console.log(error);
    }
    
}


exports.getPostbyId = async (req, res, next)=>{

    try {
        const post = await Post.findById({_id: req.params.id});
        res.status(200).json(post);    
    } catch (error) {
        res.json({"message": error})
    }


}


exports.deletePost = async (req, res)=>{

    try {
       const deletePost = await Post.deleteOne({ _id: req.params.id,  creator: req.userData.userId});
        
       if (deletePost.n > 0) {
        res.status(200).json({message: "post deleted"});
           
       } else {
       res.status(401).json({message: "Not Authorized"});
           
       }
       

        
    } catch (error) {
        res.status(200).json({message: "Something Went Wrong"});
    }

}