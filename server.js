import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
let proyectosCollection;

async function conectarDB() {
  try {
    await client.connect();
    const db = client.db(); // se asume que la DB viene en el URI
    proyectosCollection = db.collection('proyectos');
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err);
  }
}

conectarDB();

app.get('/api/proyectos', async (req, res) => {
  const proyectos = await proyectosCollection.find().toArray();
  res.json(proyectos);
});

app.post('/api/proyectos', async (req, res) => {
  const resultado = await proyectosCollection.insertOne({ texto: req.body.texto });
  res.json({ _id: resultado.insertedId, texto: req.body.texto });
});

app.delete('/api/proyectos/:id', async (req, res) => {
  await proyectosCollection.deleteOne({ _id: new ObjectId(req.params.id) });
  res.sendStatus(204);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`))
