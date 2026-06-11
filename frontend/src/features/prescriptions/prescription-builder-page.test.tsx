import { createPrescription, fetchPrescriptionBuilderContext } from "@/features/shared/workflow-api";

export async function verifyPrescriptionBuilderScenario() {
  const context = await fetchPrescriptionBuilderContext("vis-001");
  const prescription = await createPrescription("vis-001", {
    medicines: [
      { name: "Paracetamol", dosage: "500mg every 8 hours", duration: "3 days", notes: "After food" },
      { name: "Saline spray", dosage: "2 sprays twice daily", duration: "5 days", notes: "As needed" }
    ],
    instructions: "Hydration and rest. Return if symptoms worsen.",
    notes: "Routine prescription scenario."
  });

  return {
    hasVisitContext: Boolean(context.visit.id && context.patient?.id),
    supportsMultipleMedicines: prescription.medicines.length === 2,
    hasPrintableOutput: prescription.printableLabel.length > 0
  };
}
