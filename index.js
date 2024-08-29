import express from 'express';
import cors from 'cors'; // Import cors
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';

// Create an instance of Express
const app = express();
const port = 4011;

// Middleware setup
app.use(cors()); // Use CORS middleware
app.use(express.json());
app.use(express.static('public'));

// Database setup and migration
(async () => {
    const db = await sqlite.open({
        filename: './data_plan.db',
        driver: sqlite3.Database
    });

    await db.migrate();

    // Routes and API endpoints
    app.get('/api/price_plans/', async (req, res) => {
        const plans = await db.all('SELECT * FROM price_plan');
        res.json(plans);
    });

    app.post('/api/phonebill/', async (req, res) => {
        const { price_plan, actions } = req.body;

        if (!price_plan || !Array.isArray(actions)) {
            return res.status(400).json({ error: 'price_plan and actions are required' });
        }

        const plan = await db.get('SELECT * FROM price_plan WHERE plan_name = ?', [price_plan]);

        if (!plan) {
            return res.status(404).json({ error: 'Price plan not found' });
        }

        const smsCount = actions.filter(action => action === 'sms').length;
        const callCount = actions.filter(action => action === 'call').length;

        const total = (smsCount * plan.sms_price) + (callCount * plan.call_price);

        res.json({ total: total.toFixed(2) });
    });

    app.post('/api/price_plan/create', async (req, res) => {
        const { name, call_cost, sms_cost } = req.body;
    
        if (!name || call_cost < 0 || sms_cost < 0) {
            return res.status(400).json({ error: 'name, call_cost, and sms_cost are required' });
        }
    
        try {
            await db.run('INSERT INTO price_plan (plan_name, call_price, sms_price) VALUES (?, ?, ?)', [name, call_cost, sms_cost]);
            res.status(201).json({ message: 'Price plan created' });
        } catch (error) {
            console.error('Error creating price plan:', error); // Log detailed error on server
            res.status(500).json({ error: 'Error creating price plan' });
        }
    });
    
    app.post('/api/price_plan/update', async (req, res) => {
        const { name, call_cost, sms_cost } = req.body;

        if (!name || call_cost < 0 || sms_cost <0) {
            return res.status(400).json({ error: 'name, call_cost, and sms_cost are required' });
        }
        console.log(sms_cost, call_cost);

        await db.run('UPDATE price_plan SET call_price = ?, sms_price = ? WHERE plan_name = ?', [call_cost, sms_cost, name]);

        res.json({ message: 'Price plan updated' });
    });

    app.post('/api/price_plan/delete', async (req, res) => {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'id is required' });
        }

        await db.run('DELETE FROM price_plan WHERE id = ?', [id]);

        res.json({ message: 'Price plan deleted' });
    });

    // Start the server after setting up routes and database
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
})();
