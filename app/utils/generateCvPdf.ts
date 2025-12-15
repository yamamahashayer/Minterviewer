import html2pdf from "html2pdf.js";

export async function generateCvReportPDF(report: any) {
  if (!report) return;

  const html = `
  <div style="
    font-family:'Segoe UI', Tahoma, sans-serif;
    padding:40px;
    color:#1f2937;
    line-height:1.7;
    background:white
  ">

    <!-- HEADER -->
    <div style="
      text-align:center;
      margin-bottom:40px;
      border-bottom:4px solid #7c3aed;
      padding-bottom:20px
    ">
      <h1 style="color:#7c3aed;font-size:38px;margin:0">
        CV Analysis Report
      </h1>
      <p style="color:#6b7280;font-size:16px;margin-top:8px">
        AI-powered resume evaluation
      </p>
    </div>

    <!-- SCORE CARDS -->
    <div style="
      display:grid;
      grid-template-columns:repeat(4,1fr);
      gap:16px;
      margin-bottom:40px;
      page-break-inside:avoid;
      break-inside:avoid;
    ">
      ${scoreCard("Overall Score", report.score)}
      ${scoreCard("ATS Score", report.atsScore)}
      ${scoreCard(
        "Keyword Match",
        (report.keywordCoverage?.matched?.length || 0) * 10
      )}
      ${scoreCard(
        "Impact Score",
        (report.strengths?.length || 1) * 10
      )}
    </div>

    <!-- DETAILED FEEDBACK -->
    <h2 style="
      color:#7c3aed;
      border-bottom:2px solid #7c3aed;
      padding-bottom:10px;
      margin-bottom:20px
    ">
      Detailed Feedback
    </h2>

    ${Object.entries(report.categories || {})
      .map(
        ([key, val]: any) => `
        <div style="
          margin-bottom:24px;
          padding:24px;
          background:#f9fafb;
          border-left:5px solid #7c3aed;
          border-radius:12px;
          page-break-inside:avoid;
          break-inside:avoid;
        ">
          <h3 style="
            margin:0 0 10px;
            text-transform:capitalize;
            font-size:18px
          ">
            ${key} (${val?.score || 0}/10)
          </h3>
          <ul style="padding-left:20px;margin:0">
            ${(val?.insights || [])
              .map((i: string) => `<li style="margin-bottom:6px">${i}</li>`)
              .join("")}
          </ul>
        </div>
      `
      )
      .join("")}

    <!-- AI RECOMMENDATIONS -->
    ${
      report.improvements?.length
        ? `
      <div style="
        margin-top:40px;
        padding:24px;
        background:#fff7ed;
        border-left:5px solid #f59e0b;
        border-radius:12px;
        page-break-inside:avoid;
        break-inside:avoid;
      ">
        <h2 style="
          color:#f59e0b;
          margin:0 0 12px
        ">
          AI Recommendations
        </h2>
        <ul style="padding-left:20px;margin:0">
          ${report.improvements
            .map((i: string) => `<li style="margin-bottom:6px">${i}</li>`)
            .join("")}
        </ul>
      </div>
    `
        : ""
    }

    <!-- FOOTER -->
    <div style="
      margin-top:50px;
      text-align:center;
      font-size:12px;
      color:#9ca3af
    ">
      Generated on ${new Date().toLocaleString()} · Minterviewer
    </div>

  </div>
  `;

  html2pdf()
    .set({
      margin: [15, 15, 15, 15],
      filename: "CV_Analysis_Report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: 0,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        compress: true,
      },
    })
    .from(html)
    .save();
}

/* ===== SCORE CARD ===== */

function scoreCard(title: string, value: number) {
  return `
    <div style="
      background:linear-gradient(135deg,#7c3aed,#ec4899);
      color:white;
      padding:22px;
      border-radius:16px;
      text-align:center;
      page-break-inside:avoid;
      break-inside:avoid;
    ">
      <p style="margin:0;font-size:14px;opacity:.9">${title}</p>
      <h2 style="margin:12px 0 0;font-size:36px">
        ${Math.min(value || 0, 100)}
      </h2>
      <p style="margin:0;font-size:13px;opacity:.85">out of 100</p>
    </div>
  `;
}
