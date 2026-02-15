exports.pageNotFound = (req, res, next) => {
  res
    .status(404)
    .json({ error: "Page Not Found", pageTitle: "Page Not Found" });
};
