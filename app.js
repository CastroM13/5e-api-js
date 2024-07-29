const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

mongoose.connect(process.env.DBSTRING, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Connected to MongoDB')
});

const collections = ["ability-scores","alignments","backgrounds","classes","collections","conditions","damage-types","equipment","equipment-categories","feats","features","languages","levels","magic-items","magic-schools","monsters","proficiencies","races","rule-sections","rules","skills","spells","subclasses","subraces","traits","weapon-properties"];

app.get('/query/:collectionName', async (req, res) => {
    const collectionName = req.params.collectionName;
    const collection = db.collection(collectionName);
    try {
        if (!collections.includes(collectionName)) {
            return res.status(404).send({error:"Invalid collection"})
        }
        const data = await collection.find().toArray();
        return res.json(data);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
});

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
