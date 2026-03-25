import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const RISK_COLORS = {
  High:   [220, 38, 38],
  Medium: [217, 119, 6],
  Low:    [22, 163, 74],
}

const addPageHeader = (doc, pageNum, totalPages) => {
  doc.setFillColor(18, 18, 18)
  doc.rect(0, 0, 210, 12, 'F')
  doc.setFontSize(7)
  doc.setTextColor(120, 120, 120)
  doc.text('CLEARCLAUSE — CONFIDENTIAL ANALYSIS REPORT', 14, 8)
  doc.text(`Page ${pageNum} of ${totalPages}`, 196, 8, { align: 'right' })
}

const addDisclaimer = (doc, y) => {
  doc.setFillColor(245, 245, 245)
  doc.roundedRect(14, y, 182, 14, 2, 2, 'F')
  doc.setFontSize(7)
  doc.setTextColor(130, 130, 130)
  doc.text(
    'CAUTION: This report is for informational purposes only and does not constitute legal advice.',
    14 + 3, y + 5,
    { maxWidth: 176 }
  )
}

export const generateReport = (doc) => {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = pdf.internal.pageSize.getWidth()

  const scoreColor = doc.safetyScore >= 75
    ? [22, 163, 74]
    : doc.safetyScore >= 50
    ? [217, 119, 6]
    : [220, 38, 38]

  const scoreLabel = doc.safetyScore >= 75
    ? 'SAFE'
    : doc.safetyScore >= 50
    ? 'REVIEW ADVISED'
    : 'HIGH RISK'

  // ── Cover section ──────────────────────────────
  pdf.setFillColor(12, 12, 12)
  pdf.rect(0, 0, 210, 60, 'F')

  pdf.setFontSize(20)
  pdf.setTextColor(255, 255, 255)
  pdf.setFont('helvetica', 'bold')
  pdf.text('CLEARCLAUSE', 14, 22)

  pdf.setFontSize(8)
  pdf.setTextColor(100, 100, 100)
  pdf.setFont('helvetica', 'normal')
  pdf.text('AI LEGAL DOCUMENT ANALYSIS REPORT', 14, 29)

  // Score badge
  pdf.setFillColor(...scoreColor)
  pdf.roundedRect(148, 14, 48, 22, 3, 3, 'F')
  pdf.setFontSize(22)
  pdf.setTextColor(255, 255, 255)
  pdf.setFont('helvetica', 'bold')
  pdf.text(`${doc.safetyScore}`, 172, 25, { align: 'center' })
  pdf.setFontSize(7)
  pdf.setFont('helvetica', 'normal')
  pdf.text(scoreLabel, 172, 31, { align: 'center' })

  // File info
  pdf.setFillColor(25, 25, 25)
  pdf.rect(0, 44, 210, 16, 'F')
  pdf.setFontSize(9)
  pdf.setTextColor(200, 200, 200)
  pdf.setFont('helvetica', 'bold')
  pdf.text(doc.fileName, 14, 52, { maxWidth: 120 })
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.setTextColor(100, 100, 100)
  pdf.text(
    `Analysed: ${new Date(doc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}  ·  ${doc.clauses.length} clauses  ·  ${doc.fileType.toUpperCase()}`,
    14, 57
  )

  let y = 72

  // ── Summary ────────────────────────────────────
  pdf.setFontSize(10)
  pdf.setTextColor(20, 20, 20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('EXECUTIVE SUMMARY', 14, y)
  y += 5

  pdf.setDrawColor(37, 99, 235)
  pdf.setLineWidth(0.4)
  pdf.line(14, y, 196, y)
  y += 5

  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(60, 60, 60)
  const summaryLines = pdf.splitTextToSize(doc.summary || 'No summary available.', 182)
  pdf.text(summaryLines, 14, y)
  y += summaryLines.length * 4.5 + 6

  // ── Risk breakdown ─────────────────────────────
  const high   = doc.clauses.filter(c => c.riskLevel === 'High').length
  const medium = doc.clauses.filter(c => c.riskLevel === 'Medium').length
  const low    = doc.clauses.filter(c => c.riskLevel === 'Low').length

  const boxW = 56
  const boxes = [
    { label: 'HIGH RISK',   count: high,   color: [220, 38, 38],   bg: [254, 242, 242] },
    { label: 'MEDIUM RISK', count: medium, color: [217, 119, 6],   bg: [255, 251, 235] },
    { label: 'LOW RISK',    count: low,    color: [22, 163, 74],   bg: [240, 253, 244] },
  ]

  boxes.forEach((b, i) => {
    const x = 14 + i * (boxW + 5)
    pdf.setFillColor(...b.bg)
    pdf.roundedRect(x, y, boxW, 18, 2, 2, 'F')
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...b.color)
    pdf.text(`${b.count}`, x + boxW / 2, y + 10, { align: 'center' })
    pdf.setFontSize(7)
    pdf.setFont('helvetica', 'normal')
    pdf.text(b.label, x + boxW / 2, y + 15, { align: 'center' })
  })
  y += 26

  // ── Flagged keywords ───────────────────────────
  if (doc.flaggedKeywords?.length > 0) {
    pdf.setFontSize(10)
    pdf.setTextColor(20, 20, 20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('FLAGGED LEGAL TERMS', 14, y)
    y += 5
    pdf.setDrawColor(220, 38, 38)
    pdf.line(14, y, 196, y)
    y += 4

    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(80, 80, 80)
    const kwLine = doc.flaggedKeywords.join('  ·  ')
    const kwLines = pdf.splitTextToSize(kwLine, 182)
    pdf.text(kwLines, 14, y)
    y += kwLines.length * 4 + 8
  }

  // ── Named entities ─────────────────────────────
  const { parties = [], dates = [], amounts = [], jurisdictions = [] } = doc.namedEntities || {}
  if (parties.length || dates.length || amounts.length || jurisdictions.length) {
    pdf.setFontSize(10)
    pdf.setTextColor(20, 20, 20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('KEY ENTITIES', 14, y)
    y += 5
    pdf.setDrawColor(150, 150, 150)
    pdf.line(14, y, 196, y)
    y += 4

    const entityRows = []
    if (parties.length)       entityRows.push(['Parties',       parties.join(', ')])
    if (dates.length)         entityRows.push(['Dates',         dates.join(', ')])
    if (amounts.length)       entityRows.push(['Amounts',       amounts.join(', ')])
    if (jurisdictions.length) entityRows.push(['Jurisdictions', jurisdictions.join(', ')])

    autoTable(pdf, {
      startY: y,
      head: [],
      body: entityRows,
      theme: 'plain',
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [80, 80, 80], cellWidth: 30 },
        1: { textColor: [60, 60, 60] },
      },
      margin: { left: 14, right: 14 },
    })
    y = pdf.lastAutoTable.finalY + 8
  }

  // ── Clause table ───────────────────────────────
  pdf.setFontSize(10)
  pdf.setTextColor(20, 20, 20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('CLAUSE-BY-CLAUSE ANALYSIS', 14, y)
  y += 5
  pdf.setDrawColor(37, 99, 235)
  pdf.line(14, y, 196, y)
  y += 3

  const clauseRows = doc.clauses.map((c, i) => [
    `${i + 1}`,
    c.section || 'General',
    c.originalText?.substring(0, 120) + (c.originalText?.length > 120 ? '…' : ''),
    c.plainEnglish || '—',
    c.riskLevel || 'Low',
  ])

  autoTable(pdf, {
    startY: y,
    head: [['#', 'Section', 'Original Clause', 'Plain English', 'Risk']],
    body: clauseRows,
    theme: 'striped',
    headStyles: {
      fillColor: [18, 18, 18],
      textColor: [255, 255, 255],
      fontSize: 7,
      fontStyle: 'bold',
    },
    bodyStyles: { fontSize: 7, cellPadding: 2.5 },
    columnStyles: {
      0: { cellWidth: 8,  halign: 'center' },
      1: { cellWidth: 28 },
      2: { cellWidth: 68 },
      3: { cellWidth: 68 },
      4: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      if (data.column.index === 4 && data.section === 'body') {
        const risk = data.cell.raw
        const colors = RISK_COLORS[risk]
        if (colors) data.cell.styles.textColor = colors
      }
    },
    margin: { left: 14, right: 14 },
  })

  // ── Disclaimer on last page ────────────────────
  const lastY = pdf.lastAutoTable.finalY + 6
  const pageH = pdf.internal.pageSize.getHeight()
  if (lastY + 20 < pageH) {
    addDisclaimer(pdf, lastY)
  } else {
    pdf.addPage()
    addDisclaimer(pdf, 20)
  }

  // ── Page headers on all pages ──────────────────
  const totalPages = pdf.internal.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p)
    addPageHeader(pdf, p, totalPages)
  }

  pdf.save(`${doc.fileName.replace(/\.[^.]+$/, '')}_clearclause_report.pdf`)
}