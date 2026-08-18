import { describe, expect, it } from "vitest";

import {
  composeMessage,
  contactFormSpec,
  formSpecs,
  landlordMaintenanceFormSpec,
  readValues,
  repairFormSpec,
  validate,
} from "@/lib/forms/messages";

describe("form specs", () => {
  it("every form has a privacy note, a submit label and at least one required field", () => {
    for (const spec of Object.values(formSpecs)) {
      expect(spec.privacyNote.length).toBeGreaterThan(20);
      expect(spec.submitLabel).toMatch(/Prepare/);
      expect(spec.fields.some((f) => f.required)).toBe(true);
      // No promise of a response time or 24/7 cover anywhere in the wording.
      const text = JSON.stringify(spec).toLowerCase();
      expect(text).not.toMatch(/24\/7|within \d+ (hours|minutes)|guarantee/);
    }
  });
});

describe("validate", () => {
  it("reports every missing required field with a specific message", () => {
    const errors = validate(repairFormSpec, readValues(repairFormSpec, {}));
    expect(Object.keys(errors).sort()).toEqual(["category", "description", "name", "property", "urgency"]);
    expect(errors.name).toBe("Please enter your name.");
    expect(errors.urgency).toBe("Please choose how urgent it feels.");
  });

  it("rejects unknown option values and over-long text, accepts a complete report", () => {
    const base = { name: "Sam", property: "Belsize Avenue, PE2", category: "leak-plumbing", urgency: "urgent", description: "Water under the sink." };
    expect(validate(repairFormSpec, readValues(repairFormSpec, base))).toEqual({});
    expect(validate(repairFormSpec, readValues(repairFormSpec, { ...base, category: "nope" })).category).toMatch(/listed options/);
    expect(validate(repairFormSpec, readValues(repairFormSpec, { ...base, description: "x".repeat(1501) })).description).toMatch(/1500/);
    expect(validate(repairFormSpec, readValues(repairFormSpec, { ...base, name: "123" })).name).toBe("Please enter your name.");
  });

  it("reads FormData and trims / normalises line endings", () => {
    const fd = new FormData();
    fd.set("role", "tenant");
    fd.set("name", "  Alex  ");
    fd.set("message", "Line one\r\nLine two");
    const values = readValues(contactFormSpec, fd);
    expect(values).toEqual({ role: "tenant", name: "Alex", message: "Line one\nLine two" });
    expect(validate(contactFormSpec, values)).toEqual({});
  });
});

describe("composeMessage", () => {
  it("writes a plain-text WhatsApp message with human labels, one field per line", () => {
    const values = readValues(repairFormSpec, {
      name: "Sam",
      property: "Belsize Avenue, PE2",
      category: "heating-hot-water",
      urgency: "urgent",
      description: "No hot water since this morning.",
      access: "Weekday mornings; text first.",
    });
    const message = composeMessage(repairFormSpec, values);
    expect(message.split("\n")).toEqual([
      "Hello Red Brick, I'd like to report a repair.",
      "Name: Sam",
      "Property: Belsize Avenue, PE2",
      "Problem: Heating or hot water",
      "Urgency: Urgent",
      "What has happened: No hot water since this morning.",
      "Access and contact: Weekday mornings; text first.",
    ]);
  });

  it("omits optional lines that are empty and composes the other forms", () => {
    const repair = composeMessage(repairFormSpec, readValues(repairFormSpec, { name: "Sam", property: "P", category: "other", urgency: "routine", description: "D" }));
    expect(repair).not.toMatch(/Access and contact/);
    const landlord = composeMessage(landlordMaintenanceFormSpec, readValues(landlordMaintenanceFormSpec, { name: "Jo", property: "Ellindon, PE3", description: "Boiler service due." }));
    expect(landlord).toContain("maintenance question about my property");
    expect(landlord).toContain("Details: Boiler service due.");
    const contact = composeMessage(contactFormSpec, readValues(contactFormSpec, { role: "landlord", name: "Jo", message: "Hi" }));
    expect(contact.startsWith("Hello Red Brick, I own a property.")).toBe(true);
  });
});
