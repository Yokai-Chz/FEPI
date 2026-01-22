import express from 'express';
import http from 'http';
import depositosRoutes from './src/routes/depositos.routes.js';

const app = express();
app.use(depositosRoutes);

const server = app.listen(0, async () => {
    const port = server.address().port;
    console.log(`Test server running on port ${port}`);

    const req = http.get(`http://localhost:${port}/depositos`, (res) => {
        console.log(`Status Code: ${res.statusCode}`);
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`Response: ${data.substring(0, 100)}...`); // Print first 100 chars
            server.close();
            if (res.statusCode === 200 || res.statusCode === 500) {
                console.log("SUCCESS: Route matched (200 OK or 500 Error means route exists).");
            } else if (res.statusCode === 404) {
                console.log("FAILURE: Route not found (404).");
            } else {
                console.log(`Unexpected status: ${res.statusCode}`);
            }
        });
    });
    
    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
        server.close();
    });
});