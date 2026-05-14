import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { PropertyController } from './controllers/PropertyController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

const propertyController = new PropertyController();

// API Routes
app.get('/api/properties', (req, res) => propertyController.getProperties(req, res));
app.get('/api/properties/:id', (req, res) => propertyController.getPropertyDetails(req, res));
app.post('/api/properties', (req, res) => propertyController.create(req, res));

// Fallback route for SPA or standalone frontend serving
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Server running perfectly on http://localhost:${PORT}`);
    console.log(`🌟 EMKAN Luxury Real Estate Marketplace ready!`);
    console.log(`==================================================\n`);
});
