import { HelpCircle } from "lucide-react";

export default function FAQItem({ question, answer }) {
  return (
    <div className="p-4 border rounded-lg bg-[var(--section-bg)] shadow-md">
      <div className="flex items-center gap-3">
        <HelpCircle className="text-[var(--btn-bg)] w-6 h-6" />
        <h3 className="text-lg font-semibold">{question}</h3>
      </div>
      <p className="text-[var(--text-muted)] mt-2">{answer}</p>
    </div>
  );
}
