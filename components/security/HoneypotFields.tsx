"use client";

export function HoneypotFields({
  values,
  onChange,
}: {
  values: { website: string; faxNumber: string };
  onChange: (field: "website" | "faxNumber", value: string) => void;
}) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] -top-[9999px]">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={values.website}
        onChange={(e) => onChange("website", e.target.value)}
      />
      <input
        type="text"
        name="fax_number"
        tabIndex={-1}
        autoComplete="off"
        value={values.faxNumber}
        onChange={(e) => onChange("faxNumber", e.target.value)}
      />
    </div>
  );
}
