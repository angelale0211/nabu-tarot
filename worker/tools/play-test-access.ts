// Use existing secret provisioning; never pass service-account JSON as a CLI argument.
import { sweepPlayTests } from "../src/play-tests";

const args = process.argv.slice(2);
if (args.some(arg => arg !== "--apply")) throw Error("Usage: npm run audit:play-tests -- [--apply]");
if (!process.env.PLAY_SERVICE_ACCOUNT || !process.env.FIREBASE_PROJECT_ID) {
  throw Error("PLAY_SERVICE_ACCOUNT and FIREBASE_PROJECT_ID must be supplied through the environment");
}
const apply = args.includes("--apply");
const result = await sweepPlayTests({
  PLAY_SERVICE_ACCOUNT: process.env.PLAY_SERVICE_ACCOUNT,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  ANDROID_PACKAGE: process.env.ANDROID_PACKAGE,
}, apply);
console.log(JSON.stringify({ mode: apply ? "apply" : "dry-run", ...result }));
if (result.failed || !result.complete) process.exitCode = 1;
