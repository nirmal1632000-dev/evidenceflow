/**
 * Client-side Word (.docx) export from EvidenceFlow Markdown drafts.
 * Uses the subset of Markdown our builders emit: headings, bullets,
 * checklists, bold, tables, blockquotes, code fences, hr.
 */
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  LevelFormat,
  Packer,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  type IBorderOptions,
} from "docx";

const PAGE_WIDTH = 12240; // US Letter
const PAGE_HEIGHT = 15840;
const MARGIN = 1080; // 0.75"
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2; // 10080

const thinBorder: IBorderOptions = {
  style: BorderStyle.SINGLE,
  size: 4,
  color: "CBD5E1",
};
const borders = {
  top: thinBorder,
  bottom: thinBorder,
  left: thinBorder,
  right: thinBorder,
};
function stripMdInline(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .trim();
}

/** Parse simple **bold**, *italic*, `code` into TextRuns */
function runsFromInline(text: string, opts?: { size?: number; color?: string }): TextRun[] {
  const size = opts?.size ?? 22; // 11pt
  const color = opts?.color;
  const runs: TextRun[] = [];
  // Tokenize: **bold**, *italic*, `code`
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      runs.push(
        new TextRun({ text: text.slice(last, m.index), size, font: "Arial", color })
      );
    }
    const tok = m[0];
    if (tok.startsWith("**")) {
      runs.push(
        new TextRun({
          text: tok.slice(2, -2),
          bold: true,
          size,
          font: "Arial",
          color,
        })
      );
    } else if (tok.startsWith("`")) {
      runs.push(
        new TextRun({
          text: tok.slice(1, -1),
          font: "Consolas",
          size: size - 2,
          color: color ?? "334155",
        })
      );
    } else if (tok.startsWith("*")) {
      runs.push(
        new TextRun({
          text: tok.slice(1, -1),
          italics: true,
          size,
          font: "Arial",
          color,
        })
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) {
    runs.push(
      new TextRun({ text: text.slice(last), size, font: "Arial", color })
    );
  }
  if (runs.length === 0) {
    runs.push(new TextRun({ text: text || " ", size, font: "Arial", color }));
  }
  return runs;
}

function heading(level: 1 | 2 | 3, text: string): Paragraph {
  const map = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
  } as const;
  return new Paragraph({
    heading: map[level],
    spacing: { before: level === 1 ? 0 : 280, after: 120 },
    children: [
      new TextRun({
        text: stripMdInline(text),
        bold: true,
        font: "Arial",
        size: level === 1 ? 32 : level === 2 ? 26 : 24,
      }),
    ],
  });
}

function bodyPara(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 120, line: 276 },
    children: runsFromInline(text),
  });
}

function quotePara(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 120 },
    indent: { left: 360 },
    border: {
      left: { style: BorderStyle.SINGLE, size: 12, color: "0D9488", space: 8 },
    },
    children: runsFromInline(text, { size: 20, color: "475569" }),
  });
}

function codePara(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 60 },
    shading: { type: ShadingType.CLEAR, fill: "F1F5F9" },
    children: [
      new TextRun({
        text: text || " ",
        font: "Consolas",
        size: 18,
        color: "1E293B",
      }),
    ],
  });
}

function hrPara(): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "E2E8F0", space: 1 },
    },
    children: [],
  });
}

function parseTableRows(lines: string[]): string[][] {
  return lines
    .filter((l) => !/^\|?\s*:?-{2,}/.test(l.replace(/\|/g, "").trim() || l))
    .filter((l) => {
      // skip pure separator rows like |---|---|
      const cells = l.split("|").map((c) => c.trim());
      const meaningful = cells.filter(Boolean);
      return !meaningful.every((c) => /^:?-{2,}:?$/.test(c));
    })
    .map((l) => {
      let row = l.trim();
      if (row.startsWith("|")) row = row.slice(1);
      if (row.endsWith("|")) row = row.slice(0, -1);
      return row.split("|").map((c) => c.trim());
    })
    .filter((r) => r.some((c) => c.length > 0));
}

function buildTable(rows: string[][]): Table {
  const colCount = Math.max(...rows.map((r) => r.length), 1);
  const colW = Math.floor(CONTENT_WIDTH / colCount);
  const widths = Array.from({ length: colCount }, () => colW);

  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: widths,
    rows: rows.map((row, ri) => {
      const cells = [...row];
      while (cells.length < colCount) cells.push("");
      return new TableRow({
        children: cells.map(
          (cell, ci) =>
            new TableCell({
              borders,
              width: { size: widths[ci], type: WidthType.DXA },
              shading:
                ri === 0
                  ? { type: ShadingType.CLEAR, fill: "F0FDFA" }
                  : undefined,
              margins: { top: 60, bottom: 60, left: 80, right: 80 },
              children: [
                new Paragraph({
                  children:
                    ri === 0
                      ? [
                          new TextRun({
                            text: stripMdInline(cell || "—"),
                            bold: true,
                            size: 18,
                            font: "Arial",
                          }),
                        ]
                      : runsFromInline(cell || "—", { size: 18 }),
                }),
              ],
            })
        ),
      });
    }),
  });
}

type DocChild = Paragraph | Table;

function markdownToChildren(markdown: string): DocChild[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const out: DocChild[] = [];
  let i = 0;
  let inCode = false;
  let codeBuf: string[] = [];

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      if (inCode) {
        for (const cl of codeBuf) out.push(codePara(cl));
        if (codeBuf.length === 0) out.push(codePara(""));
        codeBuf = [];
        inCode = false;
      } else {
        inCode = true;
        codeBuf = [];
      }
      i++;
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      i++;
      continue;
    }

    // Table block
    if (line.trim().startsWith("|") && line.includes("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = parseTableRows(tableLines);
      if (rows.length) out.push(buildTable(rows));
      continue;
    }

    const t = line.trim();

    if (!t) {
      i++;
      continue;
    }

    if (/^---+$/.test(t) || /^\*\*\*+$/.test(t)) {
      out.push(hrPara());
      i++;
      continue;
    }

    if (t.startsWith("# ")) {
      out.push(heading(1, t.slice(2)));
      i++;
      continue;
    }
    if (t.startsWith("## ")) {
      out.push(heading(2, t.slice(3)));
      i++;
      continue;
    }
    if (t.startsWith("### ")) {
      out.push(heading(3, t.slice(4)));
      i++;
      continue;
    }

    if (t.startsWith("> ")) {
      out.push(quotePara(t.slice(2)));
      i++;
      continue;
    }

    // Checklist or bullet
    const check = t.match(/^- \[([ xX])\]\s+(.*)$/);
    if (check) {
      const done = check[1].toLowerCase() === "x";
      out.push(
        new Paragraph({
          spacing: { after: 60 },
          indent: { left: 180 },
          children: [
            new TextRun({
              text: done ? "☑  " : "☐  ",
              size: 22,
              font: "Segoe UI Symbol",
            }),
            ...runsFromInline(check[2]),
          ],
        })
      );
      i++;
      continue;
    }

    if (t.startsWith("- ") || t.startsWith("* ")) {
      out.push(
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 60 },
          children: runsFromInline(t.slice(2)),
        })
      );
      i++;
      continue;
    }

    out.push(bodyPara(t));
    i++;
  }

  if (inCode && codeBuf.length) {
    for (const cl of codeBuf) out.push(codePara(cl));
  }

  return out;
}

export async function markdownToDocxBlob(
  markdown: string,
  options?: { title?: string; subtitle?: string }
): Promise<Blob> {
  const children = markdownToChildren(markdown);
  const title = options?.title || "EvidenceFlow export";

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 22 },
        },
      },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 32, bold: true, font: "Arial", color: "0F172A" },
          paragraph: {
            spacing: { before: 0, after: 160 },
            outlineLevel: 0,
          },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 26, bold: true, font: "Arial", color: "0F172A" },
          paragraph: {
            spacing: { before: 280, after: 120 },
            outlineLevel: 1,
          },
        },
        {
          id: "Heading3",
          name: "Heading 3",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 24, bold: true, font: "Arial", color: "334155" },
          paragraph: {
            spacing: { before: 200, after: 80 },
            outlineLevel: 2,
          },
        },
      ],
    },
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: { indent: { left: 720, hanging: 360 } },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
            margin: {
              top: MARGIN,
              right: MARGIN,
              bottom: MARGIN,
              left: MARGIN,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                border: {
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: 6,
                    color: "E2E8F0",
                    space: 4,
                  },
                },
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: "EvidenceFlow · educational draft",
                    size: 16,
                    font: "Arial",
                    color: "64748B",
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                border: {
                  top: {
                    style: BorderStyle.SINGLE,
                    size: 6,
                    color: "E2E8F0",
                    space: 4,
                  },
                },
                spacing: { before: 80 },
                children: [
                  new TextRun({
                    text: `${title}  ·  `,
                    size: 16,
                    font: "Arial",
                    color: "94A3B8",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    font: "Arial",
                    color: "64748B",
                  }),
                ],
              }),
            ],
          }),
        },
        children:
          children.length > 0
            ? children
            : [new Paragraph({ children: [new TextRun("Empty export")] })],
      },
    ],
  });

  return Packer.toBlob(doc);
}

export async function downloadMarkdownAsDocx(
  filenameBase: string,
  markdown: string,
  options?: { title?: string }
): Promise<void> {
  const base = filenameBase.replace(/\.docx$/i, "").replace(/\.md$/i, "");
  const blob = await markdownToDocxBlob(markdown, {
    title: options?.title || base,
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${base}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadTextFile(
  filename: string,
  content: string,
  mime = "text/markdown;charset=utf-8"
): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Safe slug for filenames */
export function exportSlug(title: string): string {
  return title
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .toLowerCase()
    .slice(0, 80) || "evidenceflow-export";
}
