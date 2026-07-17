const config = require("./config");

function shouldProcess(text = "") {
  const content = text.toLowerCase();

  return config.keywords.some(keyword =>
    content.includes(keyword.toLowerCase())
  );
}

module.exports = {
  shouldProcess
};
