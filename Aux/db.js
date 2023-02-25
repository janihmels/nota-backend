import mongo from "mongodb";

let connection;

const uri =
  "mongodb+srv://jan:db%3FNota9@notacluster.bjejs.mongodb.net/?retryWrites=true&w=majority";
const client = new mongo.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: mongo.ServerApiVersion.v1,
});


export const mongoConnect = async () => {
  console.log("Connecting to DB");
  await client.connect();
  connection = client.db("nota");
  console.log("Connected to DB");
};


export const getCollection = (collection) => {
  return connection.collection(collection);
};
