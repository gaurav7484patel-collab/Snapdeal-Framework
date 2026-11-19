import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export interface FailureReportEntry {
  testName: string;
  errorMessage: string;
  stackTrace: string;
  analysis: string;
  status: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderEntry(entry: FailureReportEntry, index: number): string {
  return `
    <article class="failure-card" data-page="${index + 1}" aria-labelledby="test-${index}">
      <div class="card-header">
        <span class="failure-number">Failure ${index + 1}</span>
        <span class="status status-${escapeHtml(entry.status.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}">
          ${escapeHtml(entry.status)}
        </span>
      </div>
      <div class="failure-grid">
        <section class="report-column">
          <h2 id="test-${index}">Test name</h2>
          <p class="test-name">${escapeHtml(entry.testName)}</p>
        </section>
        <section class="report-column">
          <h2>Error message</h2>
          <pre>${escapeHtml(entry.errorMessage)}</pre>
        </section>
        <section class="report-column">
          <h2>Stack trace</h2>
          <pre>${escapeHtml(entry.stackTrace)}</pre>
        </section>
        <section class="report-column analysis-column">
          <h2>Analysis</h2>
          <div class="analysis">${escapeHtml(entry.analysis)}</div>
        </section>
      </div>
    </article>`;
}

function buildHtml(entries: FailureReportEntry[]): string {
  const generatedAt = new Date().toLocaleString();
  const failureCards = entries.map(renderEntry).join('');
  const emptyState = entries.length === 0
    ? '<div class="empty-state">No failure analysis entries were provided.</div>'
    : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Failure Analysis Report</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #1f2937;
      --muted: #64748b;
      --line: #dbe4ef;
      --surface: #ffffff;
      --background: #f4f7fb;
      --accent: #2457d6;
      --accent-soft: #e8efff;
      --danger: #b42318;
      --danger-soft: #fff0ee;
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: linear-gradient(135deg, #f8fbff 0%, var(--background) 100%);
      color: var(--ink);
      font: 15px/1.6 "Segoe UI", Arial, sans-serif;
    }
    .page { width: min(1500px, calc(100% - 40px)); margin: 0 auto; padding: 38px 0 52px; }
    .report-heading {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 28px;
    }
    h1 { margin: 0; color: #172554; font-size: clamp(28px, 4vw, 42px); font-weight: 800; letter-spacing: -.03em; }
    .subtitle, .generated { color: var(--muted); margin: 6px 0 0; }
    .summary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 15px;
      border: 1px solid #cbd9f8;
      border-radius: 12px;
      background: var(--accent-soft);
      color: #1e3a8a;
      font-weight: 700;
      white-space: nowrap;
    }
    .failure-card {
      display: none;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 18px;
      background: var(--surface);
      box-shadow: 0 12px 30px rgba(30, 64, 110, .09);
    }
    .failure-card.active { display: block; }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 17px 22px;
      border-bottom: 1px solid var(--line);
      background: #fbfdff;
    }
    .failure-number { color: var(--muted); font-size: 13px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
    .status { padding: 5px 12px; border-radius: 999px; background: var(--danger-soft); color: var(--danger); font-size: 12px; font-weight: 800; }
    .failure-grid { display: grid; grid-template-columns: minmax(170px, .8fr) minmax(220px, 1fr) minmax(260px, 1.25fr) minmax(300px, 1.5fr); }
    .report-column { min-width: 0; padding: 22px; border-right: 1px solid var(--line); }
    .report-column:last-child { border-right: 0; }
    h2 { margin: 0 0 12px; color: #334155; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
    .test-name { margin: 0; color: #172554; font-size: 17px; font-weight: 700; overflow-wrap: anywhere; }
    pre, .analysis { margin: 0; color: #334155; white-space: pre-wrap; overflow-wrap: anywhere; font: 13px/1.65 Consolas, "Courier New", monospace; }
    .analysis { font-family: "Segoe UI", Arial, sans-serif; font-size: 14px; }
    .empty-state { padding: 35px; border: 1px dashed var(--line); border-radius: 14px; background: var(--surface); color: var(--muted); text-align: center; }
    .pagination { display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 24px; }
    button { border: 1px solid #b8c8ed; border-radius: 9px; padding: 9px 16px; background: #fff; color: #1e40af; cursor: pointer; font: inherit; font-weight: 700; }
    button:hover:not(:disabled) { background: var(--accent-soft); }
    button:disabled { cursor: not-allowed; opacity: .45; }
    #page-info { min-width: 100px; color: var(--muted); text-align: center; font-weight: 700; }
    @media (max-width: 1050px) { .failure-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .report-column:nth-child(2) { border-right: 0; } }
    @media (max-width: 650px) { .page { width: min(calc(100% - 24px), 1500px); padding-top: 24px; } .report-heading { display: block; } .summary { margin-top: 18px; } .failure-grid { display: block; } .report-column, .report-column:nth-child(2) { border-right: 0; border-bottom: 1px solid var(--line); } .report-column:last-child { border-bottom: 0; } }
  </style>
</head>
<body>
  <main class="page">
    <header class="report-heading">
      <div>
        <h1>Failure Analysis Report</h1>
        <p class="subtitle">A focused view of every failed test and its root-cause analysis.</p>
        <p class="generated">Generated ${escapeHtml(generatedAt)}</p>
      </div>
      <div class="summary">${entries.length} ${entries.length === 1 ? 'failure' : 'failures'} analyzed</div>
    </header>
    <section aria-label="Failure analysis entries">
      ${emptyState}
      ${failureCards}
    </section>
    <nav class="pagination" aria-label="Failure report pages">
      <button id="previous" type="button">Previous</button>
      <span id="page-info"></span>
      <button id="next" type="button">Next</button>
    </nav>
  </main>
  <script>
    (function () {
      const cards = Array.from(document.querySelectorAll('.failure-card'));
      const previous = document.getElementById('previous');
      const next = document.getElementById('next');
      const pageInfo = document.getElementById('page-info');
      let page = 1;

      function showPage() {
        cards.forEach(function (card, index) {
          card.classList.toggle('active', index === page - 1);
        });
        pageInfo.textContent = cards.length ? 'Page ' + page + ' of ' + cards.length : 'No pages';
        previous.disabled = page <= 1 || cards.length === 0;
        next.disabled = page >= cards.length || cards.length === 0;
      }

      previous.addEventListener('click', function () { if (page > 1) { page -= 1; showPage(); } });
      next.addEventListener('click', function () { if (page < cards.length) { page += 1; showPage(); } });
      showPage();
    }());
  </script>
</body>
</html>`;
}

/**
 * Writes a standalone HTML report. Each entry is rendered as its own page in
 * the report so an analysis agent can inspect one failure at a time.
 */
export async function generateFailureReport(
  entries: FailureReportEntry[],
  outputPath = 'playwright-report/failure-analysis.html'
): Promise<string> {
  const reportPath = outputPath;
  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, buildHtml(entries), 'utf8');
  return reportPath;
}