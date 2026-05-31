export default function AdminAlert({
  type = "error",
  message,
}: {
  type?: "error" | "success";
  message: string;
}) {
  if (!message) return null;

  return (
    <div
      className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
        type === "success"
          ? "border-whatsapp/30 bg-whatsapp/10 text-whatsapp"
          : "border-brand-orange/30 bg-brand-orange/10 text-brand-orange"
      }`}
      role="alert"
    >
      {message}
    </div>
  );
}
