import { runSandbox } from "./_sandbox/main.sandbox.js";

process.on('uncaughtException', (err) => {
  console.error('CRITICAL ERROR:', err);
});

console.log('Initialize!');

runSandbox();
