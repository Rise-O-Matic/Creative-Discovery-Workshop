import { saveAs } from 'file-saver';
import TurndownService from 'turndown';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

interface BriefSections {
  projectName: string;
  overview: string;
  audience: string;
  keyMessage: string;
  objectives: string;
  deliverables: string;
  toneAndStyle: string;
  timeline: string;
  successMetrics: string;
}

// Convert HTML to plain text
function htmlToText(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

// Export as Markdown
export function exportAsMarkdown(brief: BriefSections) {
  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
  });

  const markdown = `# ${brief.projectName}

## Project Overview
${turndown.turndown(brief.overview)}

## Target Audience
${turndown.turndown(brief.audience)}

## Key Message & Value Proposition
${turndown.turndown(brief.keyMessage)}

## Objectives & Goals
${turndown.turndown(brief.objectives)}

## Deliverables
${turndown.turndown(brief.deliverables)}

## Tone & Style
${turndown.turndown(brief.toneAndStyle)}

## Timeline & Milestones
${turndown.turndown(brief.timeline)}

## Success Metrics
${turndown.turndown(brief.successMetrics)}
`;

  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, `${brief.projectName.replace(/\s+/g, '-').toLowerCase()}-brief.md`);
}

// Export as Word (DOCX)
export async function exportAsDocx(brief: BriefSections) {
  const sections = [
    { title: 'Project Overview', content: brief.overview },
    { title: 'Target Audience', content: brief.audience },
    { title: 'Key Message & Value Proposition', content: brief.keyMessage },
    { title: 'Objectives & Goals', content: brief.objectives },
    { title: 'Deliverables', content: brief.deliverables },
    { title: 'Tone & Style', content: brief.toneAndStyle },
    { title: 'Timeline & Milestones', content: brief.timeline },
    { title: 'Success Metrics', content: brief.successMetrics },
  ];

  const children: Paragraph[] = [
    new Paragraph({
      text: brief.projectName,
      heading: HeadingLevel.TITLE,
    }),
  ];

  sections.forEach(section => {
    children.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
      })
    );
    
    const plainText = htmlToText(section.content);
    const lines = plainText.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
      children.push(
        new Paragraph({
          children: [new TextRun(line)],
        })
      );
    });
    
    children.push(new Paragraph({ text: '' })); // Empty line between sections
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${brief.projectName.replace(/\s+/g, '-').toLowerCase()}-brief.docx`);
}

// Export as PDF
export function exportAsPdf(brief: BriefSections) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to add text with word wrap
  const addText = (text: string, fontSize: number, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    if (isBold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    
    const plainText = htmlToText(text);
    const lines = doc.splitTextToSize(plainText, maxWidth);
    
    lines.forEach((line: string) => {
      if (yPosition > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += fontSize * 0.5;
    });
    
    yPosition += 5;
  };

  // Title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235); // Blue color
  doc.text(brief.projectName, margin, yPosition);
  yPosition += 15;

  // Sections
  const sections = [
    { title: 'Project Overview', content: brief.overview },
    { title: 'Target Audience', content: brief.audience },
    { title: 'Key Message & Value Proposition', content: brief.keyMessage },
    { title: 'Objectives & Goals', content: brief.objectives },
    { title: 'Deliverables', content: brief.deliverables },
    { title: 'Tone & Style', content: brief.toneAndStyle },
    { title: 'Timeline & Milestones', content: brief.timeline },
    { title: 'Success Metrics', content: brief.successMetrics },
  ];

  sections.forEach(section => {
    doc.setTextColor(30, 64, 175); // Darker blue
    addText(section.title, 16, true);
    doc.setTextColor(0, 0, 0); // Black
    addText(section.content, 11, false);
    yPosition += 5;
  });

  doc.save(`${brief.projectName.replace(/\s+/g, '-').toLowerCase()}-brief.pdf`);
}
