const { execSync } = require("child_process");
const os = require("os");

console.log("🔄 Resetting project...");

try {
  if (os.platform() === "win32") {
    execSync("rd /s /q node_modules && del package-lock.json", { stdio: "inherit" });
  } else {
    execSync("rm -rf node_modules package-lock.json", { stdio: "inherit" });
  }

  console.log("✅ Project reset successfully!");
} catch (error) {
  console.error("❌ Error resetting project:", error);
}
