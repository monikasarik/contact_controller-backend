//https://cloud.mongodb.com/v2/667ec024667c5f7e5ca10f66#/metrics/replicaSet/667ec7d065e25a27dfd445f4/explorer/mycontacts-backend/contacts/find
const express = require("express");
const errorHandler = require("./controllers/middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

connectDb();
const app = express();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
