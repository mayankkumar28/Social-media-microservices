const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const updateLike = async (contentId) => {
  const response = await fetch("http://localhost:3002/content/updateLikes", {
    method: "PUT",
    headers: {
      id: contentId,
    },
  });
  return response;
};

const updateRead = async (contentId) => {
  const response = await fetch("http://localhost:3002/content/updateReads", {
    method: "PUT",
    headers: {
      id: contentId,
    },
  });
  return response;
};

module.exports = { updateLike, updateRead };
