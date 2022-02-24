const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const updateLike = async (contentId) => {
  const response = await fetch(process.env.LIKESPATH, {
    method: "PUT",
    headers: {
      id: contentId,
    },
  });
  return response;
};

const updateRead = async (contentId) => {
  const response = await fetch(process.env.READPATH, {
    method: "PUT",
    headers: {
      id: contentId,
    },
  });
  return response;
};

module.exports = { updateLike, updateRead };
