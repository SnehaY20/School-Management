const base64Encoder = (file) => {
  const base64Image = file.data.toString("base64");
  const base64ImageURI = `data:${file.mimetype};base64,${base64Image}`;

  return { base64Image, base64ImageURI };
};

module.exports = base64Encoder;
