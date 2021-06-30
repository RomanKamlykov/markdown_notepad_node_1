const {
  ATLAS_USERNAME, ATLAS_PASSWORD, ATLAS_DBNAME, JWT_SECRET,
} = process.env;

module.exports = {
  uri: `mongodb+srv://${ATLAS_USERNAME}:${ATLAS_PASSWORD}@cluster0.mfo8h.gcp.mongodb.net/${ATLAS_DBNAME}?retryWrites=true&w=majority`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  secret: JWT_SECRET,
};
