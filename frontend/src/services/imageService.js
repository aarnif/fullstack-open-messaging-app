const uploadImage = async (name, file) => {
  const data = new FormData();
  data.append("image", file);
  data.append("name", name);

  return await fetch(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    {
      method: "POST",
      body: data,
    }
  ).then((res) => res.json());
};

export default {
  uploadImage,
};
