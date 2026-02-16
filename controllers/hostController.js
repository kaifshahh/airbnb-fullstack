const Home = require("../models/home");

exports.getAddHome = (req, res, next) => {
  res.json({
    pageTitle: "Add Home to airbnb",
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const hostId = req.userId;
  const editing = req.query.editing === "true";

  Home.findById(homeId)
    .then((home) => {
      if (!home) {
        console.log("Home not found for editing.");
        return res.status(404).json({ error: "Home not found" });
      }

      // Check ownership
      if (home.host.toString() !== hostId) {
        console.log(
          "[getEditHome] Unauthorized: Host",
          hostId,
          "tried to edit home owned by",
          home.host,
        );
        return res
          .status(403)
          .json({ error: "Unauthorized: You can only edit your own homes" });
      }

      console.log(homeId, editing, home);
      res.json({
        home: home,
        pageTitle: "Edit your Home",
        editing: editing,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch home for editing" });
    });
};

exports.getHostHomes = (req, res, next) => {
  const hostId = req.userId;
  console.log("[getHostHomes] Fetching homes for host:", hostId);
  Home.find({ host: hostId })
    .then((registeredHomes) => {
      res.json({
        homes: registeredHomes,
        pageTitle: "Host Homes List",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch host homes" });
    });
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;
  const hostId = req.userId;

  if (!req.file) {
    return res.status(422).json({ error: "Attached file is not an image." });
  }

  const photo = req.file.path;
  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photo,
    description,
    host: hostId,
  });

  console.log("[postAddHome] Creating home for host:", hostId);
  home
    .save()
    .then(() => {
      console.log("Home Saved successfully");
      res.status(201).json({ message: "Home added successfully", home: home });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to save home" });
    });
};

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description } = req.body;
  const hostId = req.userId;

  Home.findById(id)
    .then((home) => {
      if (!home) {
        return res.status(404).json({ error: "Home not found" });
      }

      // Check ownership
      if (home.host.toString() !== hostId) {
        console.log(
          "[postEditHome] Unauthorized: Host",
          hostId,
          "tried to edit home owned by",
          home.host,
        );
        throw new Error("Unauthorized: You can only edit your own homes");
      }

      home.houseName = houseName;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.description = description;
      if (req.file) {
        home.photo = req.file.path;
      }
      return home.save();
    })
    .then((result) => {
      console.log("Home updated ", result);
      res.json({ message: "Home updated successfully", home: result });
    })
    .catch((err) => {
      console.log("Error while updating ", err);
      if (err.message && err.message.includes("Unauthorized")) {
        return res.status(403).json({ error: err.message });
      }
      res.status(500).json({ error: "Failed to update home" });
    });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const hostId = req.userId;
  console.log(
    "[postDeleteHome] Attempting to delete home:",
    homeId,
    "by host:",
    hostId,
  );

  Home.findById(homeId)
    .then((home) => {
      if (!home) {
        return res.status(404).json({ error: "Home not found" });
      }

      // Check ownership
      if (home.host.toString() !== hostId) {
        console.log(
          "[postDeleteHome] Unauthorized: Host",
          hostId,
          "tried to delete home owned by",
          home.host,
        );
        return res
          .status(403)
          .json({ error: "Unauthorized: You can only delete your own homes" });
      }

      return Home.findByIdAndDelete(homeId);
    })
    .then(() => {
      res.json({ message: "Home deleted successfully" });
    })
    .catch((error) => {
      console.log("Error while deleting ", error);
      res.status(500).json({ error: "Failed to delete home" });
    });
};
