const express = require("express");

const router = express.Router();

const { ensureAuth } = require("../middleware/auth");

const Blogs = require("../models/blogs");
const Users = require("../models/Users");


// @ desc show public stories
// @ route  GET /stories

router.get("/", async function(req, res) {
    try {

        const blogs = await Blogs.find({ status: "public" });
        const users = [];
        const requestedUser = req.user.id;
        // console.log(requestedUser);
        for (let i = 0; i < blogs.length; i++) {
            const _user = await Users.find({ _id: blogs[i].user });
            // console.log(_user);
            const object = {
                user: _user[0],
                blog: blogs[i],
                author_id: requestedUser
            }
            users.push(object);
        }
        // console.log(users[0].user.displayName);
        res.render("stories/index", { layout: 'main_layout', users: users });

    } catch (error) {
        console.log(error.message);
    }
})

// @ desc add story page
// @ route  GET /stories/add

router.get("/add", ensureAuth, function(req, res) {
    res.render("stories/add", { layout: 'main_layout' });
});

// @ desc  save story to database
// @ route  POST /stories

router.post("/", ensureAuth, async function(req, res) {
    try {

        // console.log(req);
        // console.log(req.body);
        req.body.user = req.user;
        await Blogs.create(req.body);
        res.redirect("/dashboard");

    } catch (error) {
        console.log(error.message);
    }
});

// @ desc  edit specific blog
// @ route  GET /stories/edit/:id

router.post("/edit/:id", ensureAuth, async function(req, res) {

    try {

        const blog = await Blogs.findOne({ _id: req.params.id });
        console.log(blog);
        res.render("stories/edit", { layout: 'main_layout', blog: blog });

    } catch (error) {
        console.log(error.message);
    }
});


module.exports = router;