const testFiles = [
  "../tests/contract/auth-login.test",
  "../tests/contract/auth-protected.test",
  "../tests/contract/admin-secretaries.test",
  "../tests/contract/admin-clinics.test",
  "../tests/contract/admin-patients.test",
  "../tests/contract/admin-appointments.test",
  "../tests/integration/doctor-login.test",
  "../tests/integration/protected-access.test",
  "../tests/integration/health-readiness.test",
  "../tests/integration/seed-idempotency.test",
  "../tests/integration/doctor-administration.test",
  "../tests/integration/secretary-admin-forbidden.test",
  "../tests/integration/secretary-patients.test",
  "../tests/integration/staff-appointments.test",
  "../tests/integration/docker-compose-smoke.test",
  "../tests/unit/auth.service.test",
  "../tests/unit/role.middleware.test",
  "../tests/unit/patients.service.test",
  "../tests/unit/appointments.service.test"
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
