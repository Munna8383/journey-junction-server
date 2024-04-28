const express = require("express")
const cors = require("cors")
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.akl91ab.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    // await client.connect();

    const spotCollection = client.db("spotDB").collection("allSpot")
    const countryCollection = client.db("spotDB").collection("country")

    app.get("/spot",async(req,res)=>{
      const cursor = spotCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get("/details/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await spotCollection.findOne(query)
      res.send(result)
    })

    app.get("/spot/:email",async(req,res)=>{
      const email = req.params.email;
      const result = await spotCollection.find({email:email}).toArray()
      res.send(result)

    })

    app.get("/countries/:country",async(req,res)=>{
      const country = req.params.country;
      const result = await spotCollection.find({country:country}).toArray()
      res.send(result)

    })

    app.post("/allSpot",async(req,res)=>{
      const spot = req.body;
      console.log(spot)
      const result = await spotCollection.insertOne(spot)
      res.send(result)
    })

    app.put("/update/:id",async(req,res)=>{

      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const option = {upsert:true}
      const updatedSpot = req.body;
      const spot = {
        $set: {
          photo: updatedSpot.photo,
          spotName: updatedSpot.spotName,
          country: updatedSpot.country,
          location: updatedSpot.location,
          description:updatedSpot.description,
          cost: updatedSpot.cost,
          season: updatedSpot.season,
          travelTime: updatedSpot.travelTime,
          visitorPerYear: updatedSpot.visitorPerYear
        }
      }

      const result = await spotCollection.updateOne(filter,spot,option)

      res.send(result)


    })

    app.delete("/spot/:id",async(req,res)=>{
      const id = req.params.id
      const query =  {_id: new ObjectId(id)}
      const result = await spotCollection.deleteOne(query)
      res.send(result)
    })

    app.get("/country",async(req,res)=>{
      const cursor = countryCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/",(req,res)=>{
    res.send("journey junction server is running")
})

app.listen(port,()=>{
    console.log(`journey juction server is running on port ${port}`)
})