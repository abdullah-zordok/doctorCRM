const testFiles = [
  "../tests/contract/auth-login.test",
  "../tests/contract/auth-protected.test",
  "../tests/integration/doctor-login.test",
  "../tests/integration/protected-access.test",
  "../tests/integration/health-readiness.test",
  "../tests/integration/seed-idempotency.test",
  "../tests/integration/docker-compose-smoke.test",
  "../tests/unit/auth.service.test",
  "../tests/unit/role.middleware.test"
];

async function main() {
  for (const file of testFiles) {
    const testModule = await import(file);
    await testModule.run();
    console.log(`PASS ${file.replace("../", "")}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
