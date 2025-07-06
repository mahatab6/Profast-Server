require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.SERVER_PASS}@cluster0.kakgslm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db('deliveryDB'); 
    const parcelCollection = db.collection('parcels'); 

    // all parcel data 
    app.get('/parcels', async (req, res) => {
      const result = await parcelCollection.find().toArray();
      res.send(result);
    });

    // parcel booking post on database

    app.post('/parcel-booking', async(req, res)=> {
      const newBooking = req.body;
      const result = await parcelCollection.insertOne(newBooking);
      res.send(result);
    })

    // user parcel get on database

    app.get('/parcels-info', async(req, res) =>{
      const email = req.query.email;
      console.log( typeof email)
      if(!email){
        return res.status(400).send({ error: 'Email query is required.' });
      }
      const parcels = await parcelCollection
        .find({ senderEmail: email})
        .sort({ createdAt: -1 })
        .toArray();
      res.send(parcels)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





// Sample route
    app.get('/', (req, res) => {
      res.send('Delivery Server is Running');
    });

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});