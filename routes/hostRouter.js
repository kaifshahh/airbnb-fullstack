// External Module
const express = require("express");
const hostRouter = express.Router();
const upload = require("../middleware/upload");

// Local Module
const hostController = require("../controllers/hostController");
const isAuth = require("../utils/isAuth");

hostRouter.get("/add-home", isAuth, hostController.getAddHome);
hostRouter.post(
  "/add-home",
  isAuth,
  upload.single("photo"),
  hostController.postAddHome,
);
hostRouter.get("/host-home-list", isAuth, hostController.getHostHomes);
hostRouter.get("/edit-home/:homeId", isAuth, hostController.getEditHome);
hostRouter.post(
  "/edit-home",
  isAuth,
  upload.single("photo"),
  hostController.postEditHome,
);
hostRouter.post("/delete-home/:homeId", isAuth, hostController.postDeleteHome);

module.exports = hostRouter;
