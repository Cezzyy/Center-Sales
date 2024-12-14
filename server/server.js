import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import admin from 'firebase-admin'
import { readFile } from 'fs/promises'
import path from 'path'
import process from 'process'

const serviceAccountKey = JSON.parse(
  await readFile(path.resolve('./server/serviceAccountKey.json'), 'utf8'),
)

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
})

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// Sales/Orders/Invoices Routes
app.get('/api/orders', async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('orders').get()
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      createdAt: admin.firestore.Timestamp.now(),
    }
    const docRef = await admin.firestore().collection('orders').add(orderData)
    res.status(201).json({ id: docRef.id, ...orderData })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/invoices', async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('invoices').get()
    const invoices = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json(invoices)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/invoices', async (req, res) => {
  try {
    const invoiceData = {
      ...req.body,
      createdAt: admin.firestore.Timestamp.now(),
      status: 'pending',
    }
    const docRef = await admin.firestore().collection('invoices').add(invoiceData)
    res.status(201).json({ id: docRef.id, ...invoiceData })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.patch('/api/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params
    await admin.firestore().collection('invoices').doc(id).update(req.body)
    const doc = await admin.firestore().collection('invoices').doc(id).get()
    res.json({ id: doc.id, ...doc.data() })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Products Routes
app.get('/api/products', async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('products').get()
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/products', async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdAt: admin.firestore.Timestamp.now(),
    }
    const docRef = await admin.firestore().collection('products').add(productData)
    res.status(201).json({ id: docRef.id, ...productData })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    await admin.firestore().collection('products').doc(id).update(req.body)
    const doc = await admin.firestore().collection('products').doc(id).get()
    res.json({ id: doc.id, ...doc.data() })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/products/:id', async (req, res) => {
  try {
    await admin.firestore().collection('products').doc(id).delete()
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Clients Routes
app.get('/api/clients', async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('clients').get()
    const clients = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/clients', async (req, res) => {
  try {
    const clientData = {
      ...req.body,
      createdAt: admin.firestore.Timestamp.now(),
    }
    const docRef = await admin.firestore().collection('clients').add(clientData)
    res.status(201).json({ id: docRef.id, ...clientData })
  } catch (error) {
    console.error('Error creating client:', error)
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params
    await admin.firestore().collection('clients').doc(id).update(req.body)
    const doc = await admin.firestore().collection('clients').doc(id).get()
    res.json({ id: doc.id, ...doc.data() })
  } catch (error) {
    console.error('Error updating client:', error)
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params
    await admin.firestore().collection('clients').doc(id).delete()
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting client:', error)
    res.status(500).json({ error: error.message })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
