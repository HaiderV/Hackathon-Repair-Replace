import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import dns from 'node:dns';
import { startCleanupScheduler } from "./services/cleanup.scheduler.js";

dns.setServers(['8.8.8.8', '1.1.1.1']); // Forces Node to use Google & Cloudflare DNS

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    startCleanupScheduler();
    app.listen(PORT, () => {
        console.log(`Server is runnning on port ${PORT}`);
    });
};

startServer();