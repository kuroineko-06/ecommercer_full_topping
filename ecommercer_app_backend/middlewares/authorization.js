const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

async function authorizePostRequests(req, res, next) {
  if (req.method !== "POST") return next();
  if (req.originalUrl.startsWish(`${process.env.API_URL}/admin`)) return next();
  const endpoint = [
    `${API}/login`,
    `${API}/register`,
    `${API}/forgot-password`,
    `${API}/verify-otp`,
    `${API}/reset-password`,
  ];

  const isMatchingEndpoint = endpoint.some((endpoint) =>
    req.originalUrl.includes(endpoint)
  );

  if (isMatchingEndpoint) return next();

  const message =
    "User conflict!\nThe user making the request doesn't match the user in the request.";

  const authHeader = req.hearder("Authorization");
  if (!authHeader) return next();
  const accessToken = authHeader.repalce("Bearer", "").trim();
  const tokenData = jwt.decode(accessToken);

  if (req.body.user && tokenData.id !== req.body.user) {
    return res.status(401).json({
      message,
    });
  } else if (/\/user\/([^/]+)\//.test(req.originalUrl)) {
    const part = req.originalUrl.split("/");
    const userIndex = part.indexOf("user");

    const id = part[userIndex + 1];

    if (!mongoose.isValidObjectId(id)) return next();
    if (tokenData.id !== id) return res.status(401).json({ message });
  }
  return next();
}

module.exports = authorizePostRequests;
