import { deleteMedia } from "../api/utils/deleteMedia.js";

export const cronConfig = {
  jobs: {
    myFirstJob: {
      // schedule: '*/10 * * * * *',
      schedule: "00 00 00 * * *",
      start: process.env.ENABLE_CRON === "Y", // Controlled by env variable
      onTick: async () => {
        console.log('Running myFirstJob - every 2 seconds!');
        try {
          // ... your asynchronous task logic here ...
          await deleteMedia();
        } catch (error) {
          console.error("Error in myFirstJob:", error);
        }
      },
    },
    // ... other cron jobs
  },
};
