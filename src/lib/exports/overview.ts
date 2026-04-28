import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface OverviewStats {
  monthly_views: number;
  growth_pct: number;
  posts_published: number;
  posts_draft: number;
  pages_total: number;
  portfolios_total: number;
  activity: { day: string; views: number }[];
  top_posts: { id: string; title: string; views: number; status: string }[];
}

function downloadBlob(content: string | Blob, filename: string, mime: string) {
  const blob = typeof content === "string" ? new Blob([content], { type: mime }) : content;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportOverviewCsv(stats: OverviewStats) {
  const today = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];
  lines.push("Atelier CMS — Overview report");
  lines.push(`Generated,${today}`);
  lines.push("");
  lines.push("Summary");
  lines.push("Metric,Value");
  lines.push(`Monthly views,${stats.monthly_views}`);
  lines.push(`Growth %,${stats.growth_pct}`);
  lines.push(`Published posts,${stats.posts_published}`);
  lines.push(`Drafts,${stats.posts_draft}`);
  lines.push(`Live pages,${stats.pages_total}`);
  lines.push(`Portfolio cases,${stats.portfolios_total}`);
  lines.push("");
  lines.push("Weekly views");
  lines.push("Day,Views");
  stats.activity.forEach((a) => lines.push(`${a.day},${a.views}`));
  lines.push("");
  lines.push("Top posts");
  lines.push("Rank,Title,Views,Status");
  stats.top_posts.forEach((p, i) =>
    lines.push(`${i + 1},"${p.title.replace(/"/g, '""')}",${p.views},${p.status}`)
  );
  downloadBlob(lines.join("\n"), `overview-${today}.csv`, "text/csv;charset=utf-8");
}

export function exportOverviewPdf(stats: OverviewStats) {
  const today = new Date().toISOString().slice(0, 10);
  const doc = new jsPDF({ unit: "pt", format: "letter" });

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Overview report", 40, 60);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Atelier CMS · Generated ${today}`, 40, 78);
  doc.setTextColor(0);

  autoTable(doc, {
    startY: 100,
    head: [["Metric", "Value"]],
    body: [
      ["Monthly views", stats.monthly_views.toLocaleString()],
      ["Growth", `${stats.growth_pct}%`],
      ["Published posts", String(stats.posts_published)],
      ["Drafts", String(stats.posts_draft)],
      ["Live pages", String(stats.pages_total)],
      ["Portfolio cases", String(stats.portfolios_total)],
    ],
    theme: "grid",
    headStyles: { fillColor: [99, 102, 241] },
  });

  autoTable(doc, {
    head: [["Day", "Views"]],
    body: stats.activity.map((a) => [a.day, a.views.toLocaleString()]),
    theme: "grid",
    headStyles: { fillColor: [99, 102, 241] },
    margin: { top: 20 },
  });

  autoTable(doc, {
    head: [["#", "Title", "Views", "Status"]],
    body: stats.top_posts.map((p, i) => [i + 1, p.title, p.views.toLocaleString(), p.status]),
    theme: "grid",
    headStyles: { fillColor: [99, 102, 241] },
    columnStyles: { 1: { cellWidth: 280 } },
  });

  doc.save(`overview-${today}.pdf`);
}
