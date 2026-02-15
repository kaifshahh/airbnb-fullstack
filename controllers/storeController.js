const Home = require("../models/home");
const User = require("../models/user");

exports.getIndex = (req, res, next) => {
  Home.find()
    .then((registeredHomes) => {
      res.json({
        homes: registeredHomes,
        pageTitle: "airbnb Home",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch homes" });
    });
};

exports.getHomes = (req, res, next) => {
  Home.find()
    .then((registeredHomes) => {
      res.json({
        homes: registeredHomes,
        pageTitle: "Homes List",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch homes" });
    });
};

exports.getBookings = (req, res, next) => {
  res.json({
    pageTitle: "My Bookings",
  });
};

exports.getFavouriteList = async (req, res, next) => {
  try {
    const userId = req.userId;
    console.log("Fetching favorites for userId:", userId);
    const user = await User.findById(userId).populate("favourites");

    if (!user) {
      console.log("User not found in getFavouriteList");
      return res.status(404).json({ error: "User not found" });
    }

    // Filter out any favorites that might have failed to populate or are null
    const validFavourites = user.favourites.filter((fav) => fav != null);

    res.json({
      favouriteHomes: validFavourites,
      pageTitle: "My Favourites",
    });
  } catch (err) {
    console.error("[getFavouriteList] Error occurred:", err.message);
    console.error("[getFavouriteList] Stack trace:", err.stack);
    res.status(500).json({ error: "Failed to fetch favourites" });
  }
};

exports.postAddToFavourite = async (req, res, next) => {
  try {
    const homeId = req.body.homeId;
    const userId = req.userId;
    const user = await User.findById(userId);
    console.log("Adding to favorite. homeId:", homeId, "userId:", userId);

    if (!homeId) {
      return res.status(400).json({ error: "Home ID is required" });
    }

    // Robust check and cleanup of nulls
    const exists = user.favourites.some(
      (fav) => fav && fav.toString() === homeId,
    );

    // Automatic cleanup of potential nulls/undefineds that poisoned the array
    const originalLength = user.favourites.length;
    user.favourites = user.favourites.filter((fav) => fav != null);

    if (!exists) {
      user.favourites.push(homeId);
      await user.save();
      console.log("Added successfully");
    } else if (user.favourites.length !== originalLength) {
      // If we didn't add but we did clean up, still save
      await user.save();
      console.log("Cleaned up nulls from favorites");
    } else {
      console.log("Already in favorites");
    }
    res.status(200).json({ message: "Added to favourites" });
  } catch (err) {
    console.error("[postAddToFavourite] Error occurred:", err.message);
    console.error("[postAddToFavourite] Stack trace:", err.stack);
    res.status(500).json({ error: "Failed to add to favourites" });
  }
};

exports.postRemoveFromFavourite = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;
    const userId = req.userId;
    const user = await User.findById(userId);
    console.log("Removing from favorite. homeId:", homeId, "userId:", userId);

    // Clean up nulls while we are at it
    const originalLength = user.favourites.length;
    user.favourites = user.favourites.filter(
      (fav) => fav != null && fav.toString() !== homeId,
    );

    if (user.favourites.length !== originalLength) {
      await user.save();
      console.log("Removed/Cleaned favorites");
    }
    res.status(200).json({ message: "Removed from favourites" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to remove from favourites" });
  }
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId)
    .then((home) => {
      if (!home) {
        console.log("Home not found");
        res.status(404).json({ error: "Home not found" });
      } else {
        res.json({
          home: home,
          pageTitle: "Home Detail",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch home details" });
    });
};
