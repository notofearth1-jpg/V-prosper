const dotenv = require("dotenv");
const { execSync } = require("child_process");
const path = require("path");

// Load environment variables from the .env file
const env = process.env.REACT_APP_ENV || "";
dotenv.config({ path: path.resolve(__dirname, `environment/.env.${env}`) });

// Determine the appropriate command to run react-scripts based on the platform
const command =
  process.platform === "win32" ? "react-scripts.cmd" : "react-scripts";

try {
  execSync(`${command} start`, { stdio: "inherit" });
} catch (error) {
  process.exit(1);
}
