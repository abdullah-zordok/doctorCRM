const testFiles = [
  "../tests/contract/auth-login.test",
  "../tests/contract/auth-protected.test",
  "../tests/contract/admin-secretaries.test",
  "../tests/contract/admin-clinics.test",
  "../tests/contract/admin-patients.test",
  "../tests/contract/admin-appointments.test",
  "../tests/contract/medical-visits.test",
  "../tests/contract/medical-prescriptions.test",
  "../tests/contract/financial-payments.test",
  "../tests/contract/dashboards.test",
  "../tests/integration/doctor-login.test",
  "../tests/integration/protected-access.test",
  "../tests/integration/health-readiness.test",
  "../tests/integration/seed-idempotency.test",
  "../tests/integration/doctor-administration.test",
  "../tests/integration/secretary-admin-forbidden.test",
  "../tests/integration/secretary-patients.test",
  "../tests/integration/staff-appointments.test",
  "../tests/integration/doctor-visits.test",
  "../tests/integration/secretary-clinical-forbidden.test",
  "../tests/integration/doctor-prescriptions-pdf.test",
  "../tests/integration/secretary-payments.test",
  "../tests/integration/dashboard-rbac.test",
  "../tests/integration/docker-compose-smoke.test",
  "../tests/unit/auth.service.test",
  "../tests/unit/role.middleware.test",
  "../tests/unit/patients.service.test",
  "../tests/unit/appointments.service.test",
  "../tests/unit/decimal.test",
  "../tests/unit/visits.service.test",
  "../tests/unit/prescriptions.service.test",
  "../tests/unit/prescriptions.pdf.test",
  "../tests/unit/payments.service.test",
  "../tests/unit/dashboards.service.test"
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
