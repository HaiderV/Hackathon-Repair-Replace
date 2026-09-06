import { cleanupExpiredAnalyses } from "./cleanup.service.js";

export const startCleanupScheduler = () => {
    const interval = 60 * 60 * 1000; // 1 hour in milliseconds

    cleanupExpiredAnalyses(); // Run immediately on startup

    setInterval(async () => {
        const interval = 15 * 60 * 1000; // 15 minutes in milliseconds
        cleanupExpiredAnalyses();
    }, interval);

    console.log("Cleanup scheduler started. Running every 15 minutes.");
}