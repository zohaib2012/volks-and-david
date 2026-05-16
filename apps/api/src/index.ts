import "dotenv/config";
import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/database";

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected");

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();
