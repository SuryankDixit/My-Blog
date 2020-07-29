const express = require("express");

const router = express.Router();

const { ensureAuth, ensureGuest } = require("../middleware/auth");

const Blog = require("../models/blogs");


// @ desc login/landing page
// @ route  GET /

router.get("/", ensureGuest, function(req, res) {
    res.render("login", { layout: 'login_layout' });
});

// @ desc  Dashboard
// @ route  GET /dashboard

router.get("/dashboard", ensureAuth, async function(req, res) {
    // console.log(req.user);
    try {

        const blogs = await Blog.find({ user: req.user.id });
        console.log(blogs);
        const user = {
            name: req.user.displayName,
            blog: blogs
        };
        res.render("dashboard", { layout: 'main_layout', user: user });

    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;