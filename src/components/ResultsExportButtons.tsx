"use client";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Form } from "@/types/form";

export default function ResultsExportButtons({ form }: { form: Form }) {

  if (!form || !form.submissions?.length) return null;

  function handleExportCSV() {
    if (!form.submissions?.length) return;
    const headers = [
      "Response #",
      "Submitted At",
      ...form.questions.map((q) => q.text || "").map((h) => h.replace(/\n/g, " ")),
    ];
    const rows = form.submissions.map((submission, idx) => [
      `#${idx + 1}`,
      submission.submittedAt
        ? new Date(submission.submittedAt).toLocaleString("en-US")
        : "N/A",
      ...form.questions.map((q) => {
        const answer = submission.answers?.find((a) => a.questionId === q.id);
        if (!answer) return "";
        if (answer.fieldOptions) return answer.fieldOptions.text;
        return answer.value || "-";
      }),
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\r\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.name || "form"}-responses.csv`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  function handleExportPDF() {
    if (!form.submissions?.length) return;
    const doc = new jsPDF();
    const headers = [
      "Response #",
      "Submitted At",
      ...form.questions.map((q) => q.text || "").map((h) => h.replace(/\n/g, " ")),
    ];
    const rows = form.submissions.map((submission, idx) => [
      `#${idx + 1}`,
      submission.submittedAt
        ? new Date(submission.submittedAt).toLocaleString("en-US")
        : "N/A",
      ...form.questions.map((q) => {
        const answer = submission.answers?.find((a) => a.questionId === q.id);
        if (!answer) return "";
        if (answer.fieldOptions) return answer.fieldOptions.text;
        return answer.value || "-";
      }),
    ]);
    autoTable(doc, {
      head: [headers],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [16, 185, 129] },
      margin: { top: 20 },
    });
    doc.save(`${form.name || "form"}-responses.pdf`);
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="sm"
        className="hover:bg-emerald-50 hover:border-emerald-200"
        type="button"
        onClick={handleExportCSV}
      >
        Export CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="hover:bg-teal-50 hover:border-teal-200"
        type="button"
        onClick={handleExportPDF}
      >
        Download PDF
      </Button>
    </div>
  );
}