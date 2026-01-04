import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  convertInchesToTwip,
} from 'docx';
import { saveAs } from 'file-saver';
import type { SessionState } from '../../types';

/**
 * Service for generating creative brief documents in DOCX format
 * Maps session state to a professional, agency-quality brief structure
 */
export class BriefGenerator {
  /**
   * Generate a creative brief DOCX from session state
   */
  static async generate(state: SessionState, projectName?: string): Promise<void> {
    const doc = this.createDocument(state, projectName);
    const blob = await Packer.toBlob(doc);
    const fileName = `${projectName || 'creative-brief'}-${new Date().toISOString().split('T')[0]}.docx`;
    saveAs(blob, fileName);
  }

  /**
   * Create the DOCX document structure
   */
  private static createDocument(state: SessionState, projectName?: string): Document {
    const sections = [
      ...this.createHeader(projectName || state.projectContext.projectName),
      ...this.createProjectOverview(state),
      ...this.createObjectives(state),
      ...this.createTargetAudience(state),
      ...this.createKeyMessageAndTone(state),
      ...this.createRequirements(state),
      ...this.createDeliverables(state),
      ...this.createConstraintsAndRisks(state),
      ...this.createTimeline(state),
      ...this.createStakeholders(state),
      ...this.createScope(state),
      ...this.createFooter(),
    ];

    return new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(1),
                right: convertInchesToTwip(1),
                bottom: convertInchesToTwip(1),
                left: convertInchesToTwip(1),
              },
            },
          },
          children: sections,
        },
      ],
    });
  }

  /**
   * Create document header with title
   */
  private static createHeader(projectName: string): Paragraph[] {
    return [
      new Paragraph({
        text: 'CREATIVE BRIEF',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: projectName,
            bold: true,
            size: 32,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Generated: ${new Date().toLocaleDateString()}`,
            italics: true,
            size: 20,
            color: '666666',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
    ];
  }

  /**
   * Section 1: Project Overview
   */
  private static createProjectOverview(state: SessionState): Paragraph[] {
    const { projectContext } = state;
    return [
      this.createSectionHeading('1. Project Overview'),
      new Paragraph({
        text: projectContext.projectDescription || 'No description provided.',
        spacing: { after: 200 },
      }),
      new Paragraph({ text: '' }),
    ];
  }

  /**
   * Section 2: Objectives
   */
  private static createObjectives(state: SessionState): Paragraph[] {
    const { customerDiscovery, spotExercises } = state;
    const paragraphs: Paragraph[] = [this.createSectionHeading('2. Objectives')];

    // Add key discovery insights
    const discoveryParagraphs: string[] = [];
    if (customerDiscovery.whatIsSuccess.answer) {
      discoveryParagraphs.push(customerDiscovery.whatIsSuccess.answer);
    }

    if (discoveryParagraphs.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: 'Success Criteria:', bold: true })],
          spacing: { after: 100 },
        }),
        ...discoveryParagraphs.map(text => new Paragraph({
          text,
          spacing: { after: 200 },
        }))
      );
    }

    if (spotExercises.oneSentence) {
      const { makePeopleFeel, helpOrganization, showThatWe } = spotExercises.oneSentence;
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: 'This creative work must:', bold: true })],
          spacing: { after: 100 },
        })
      );

      if (makePeopleFeel) {
        paragraphs.push(
          new Paragraph({
            text: `\u2022 Make people ${makePeopleFeel}`,
            spacing: { after: 100 },
          })
        );
      }
      if (helpOrganization) {
        paragraphs.push(
          new Paragraph({
            text: `\u2022 Help the organization ${helpOrganization}`,
            spacing: { after: 100 },
          })
        );
      }
      if (showThatWe) {
        paragraphs.push(
          new Paragraph({
            text: `\u2022 Show that we ${showThatWe}`,
            spacing: { after: 200 },
          })
        );
      }
    }

    paragraphs.push(new Paragraph({ text: '' }));
    return paragraphs;
  }

  /**
   * Section 3: Target Audience
   */
  private static createTargetAudience(state: SessionState): Paragraph[] {
    const { customerDiscovery, spotExercises } = state;
    const paragraphs: Paragraph[] = [this.createSectionHeading('3. Target Audience')];

    if (customerDiscovery.whoIsThisFor.answer) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: 'Primary Audience:', bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: customerDiscovery.whoIsThisFor.answer,
          spacing: { after: 200 },
        })
      );
    }

    if (spotExercises.viewersInMirror) {
      const { whereWatching, feelingBefore, stopWatchingIf } = spotExercises.viewersInMirror;
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: 'Audience Context:', bold: true })],
          spacing: { after: 100 },
        })
      );

      if (whereWatching) {
        paragraphs.push(
          new Paragraph({
            text: `Viewing context: ${whereWatching}`,
            spacing: { after: 100 },
          })
        );
      }
      if (feelingBefore) {
        paragraphs.push(
          new Paragraph({
            text: `Initial state: ${feelingBefore}`,
            spacing: { after: 100 },
          })
        );
      }
      if (stopWatchingIf) {
        paragraphs.push(
          new Paragraph({
            text: `Attention risks: ${stopWatchingIf}`,
            spacing: { after: 200 },
          })
        );
      }
    }

    paragraphs.push(new Paragraph({ text: '' }));
    return paragraphs;
  }

  /**
   * Section 4: Key Message & Tone
   */
  private static createKeyMessageAndTone(state: SessionState): Paragraph[] {
    const { customerDiscovery, spotExercises } = state;
    const paragraphs: Paragraph[] = [this.createSectionHeading('4. Key Message & Tone')];

    if (customerDiscovery.whatIsBeingOffered.answer) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: 'Core Message:', bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: customerDiscovery.whatIsBeingOffered.answer,
          spacing: { after: 200 },
        })
      );
    }

    if (customerDiscovery.whyNow.answer) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: 'Urgency/Relevance:', bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: customerDiscovery.whyNow.answer,
          spacing: { after: 200 },
        })
      );
    }

    if (spotExercises.story) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: 'Narrative Structure:', bold: true })],
          spacing: { after: 100 },
        })
      );

      const beats = [
        { label: 'Situation', value: spotExercises.story.situation },
        { label: 'Problem', value: spotExercises.story.problem },
        { label: 'Tension/Reveal', value: spotExercises.story.tensionReveal },
        { label: 'Product Role', value: spotExercises.story.productRole },
        { label: 'Resolution', value: spotExercises.story.resolution },
      ];

      beats.forEach((beat) => {
        if (beat.value.description) {
          paragraphs.push(
            new Paragraph({
              text: `${beat.label} (${beat.value.type}): ${beat.value.description}`,
              spacing: { after: 100 },
            })
          );
        }
      });
    }

    paragraphs.push(new Paragraph({ text: '' }));
    return paragraphs;
  }

  /**
   * Section 5: Requirements
   */
  private static createRequirements(state: SessionState): Paragraph[] {
    const { stickyNoteExercise, spotExercises } = state;
    const paragraphs: Paragraph[] = [this.createSectionHeading('5. Requirements')];

    if (stickyNoteExercise.clusters.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: 'From Requirements Discovery:', bold: true })],
          spacing: { after: 100 },
        })
      );

      stickyNoteExercise.clusters.forEach((cluster) => {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: `${cluster.title}:`, bold: true })],
            spacing: { after: 50 },
          })
        );
        if (cluster.aiSummary) {
          paragraphs.push(
            new Paragraph({
              text: cluster.aiSummary,
              spacing: { after: 150 },
            })
          );
        }
      });
    }

    if (spotExercises.failures.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Critical Success Factors (from failure analysis):', bold: true }),
          ],
          spacing: { after: 100 },
        })
      );

      spotExercises.failures.forEach((failure) => {
        paragraphs.push(
          new Paragraph({
            text: `\u2022 ${failure}`,
            spacing: { after: 100 },
          })
        );
      });
    }

    paragraphs.push(new Paragraph({ text: '' }));
    return paragraphs;
  }

  /**
   * Section 6: Deliverables
   */
  private static createDeliverables(state: SessionState): Paragraph[] {
    const paragraphs: Paragraph[] = [this.createSectionHeading('6. Deliverables')];

    const willHave = state.prioritization.willHave;
    if (willHave.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: 'Required Deliverables:', bold: true })],
          spacing: { after: 100 },
        })
      );

      willHave.forEach((item) => {
        paragraphs.push(
          new Paragraph({
            text: `\u2022 ${item.description}`,
            spacing: { after: 100 },
          })
        );
      });
    }

    const couldHave = state.prioritization.couldHave;
    if (couldHave.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: 'Optional Deliverables:', bold: true })],
          spacing: { after: 100, before: 200 },
        })
      );

      couldHave.forEach((item) => {
        paragraphs.push(
          new Paragraph({
            text: `\u2022 ${item.description}`,
            spacing: { after: 100 },
          })
        );
      });
    }

    paragraphs.push(new Paragraph({ text: '' }));
    return paragraphs;
  }

  /**
   * Section 7: Constraints & Risks
   */
  private static createConstraintsAndRisks(state: SessionState): Paragraph[] {
    const { projectContext, spotExercises } = state;
    const paragraphs: Paragraph[] = [this.createSectionHeading('7. Constraints & Risks')];

    if (projectContext.constraints) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: 'Known Constraints:', bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: projectContext.constraints,
          spacing: { after: 200 },
        })
      );
    }

    if (spotExercises.constraints.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: 'Constraint-Driven Direction:', bold: true })],
          spacing: { after: 100 },
        })
      );

      spotExercises.constraints.forEach((constraint) => {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: constraint.description, bold: true })],
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: `Style implication: ${constraint.styleImplication}`,
            spacing: { after: 150 },
          })
        );
      });
    }

    const wontHave = state.prioritization.wontHave;
    if (wontHave.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: 'Explicitly Out of Scope:', bold: true })],
          spacing: { after: 100, before: 200 },
        })
      );

      wontHave.forEach((item) => {
        paragraphs.push(
          new Paragraph({
            text: `\u2022 ${item.description}`,
            spacing: { after: 100 },
          })
        );
      });
    }

    paragraphs.push(new Paragraph({ text: '' }));
    return paragraphs;
  }

  /**
   * Section 8: Timeline
   */
  private static createTimeline(state: SessionState): Paragraph[] {
    const { projectContext, customerDiscovery } = state;
    const paragraphs: Paragraph[] = [this.createSectionHeading('8. Timeline')];

    if (projectContext.timeline) {
      paragraphs.push(
        new Paragraph({
          text: projectContext.timeline,
          spacing: { after: 200 },
        })
      );
    }

    if (customerDiscovery.whatIsSuccess.answer) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: 'Success Metrics:', bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: customerDiscovery.whatIsSuccess.answer,
          spacing: { after: 200 },
        })
      );
    }

    paragraphs.push(new Paragraph({ text: '' }));
    return paragraphs;
  }

  /**
   * Section 9: Stakeholders
   */
  private static createStakeholders(state: SessionState): Paragraph[] {
    const { projectContext } = state;
    const paragraphs: Paragraph[] = [this.createSectionHeading('9. Stakeholders')];

    if (projectContext.stakeholders) {
      paragraphs.push(
        new Paragraph({
          text: projectContext.stakeholders,
          spacing: { after: 200 },
        })
      );
    } else {
      paragraphs.push(
        new Paragraph({
          text: 'No stakeholders specified.',
          spacing: { after: 200 },
        })
      );
    }

    paragraphs.push(new Paragraph({ text: '' }));
    return paragraphs;
  }

  /**
   * Section 10: Scope (Will / Could / Won't)
   */
  private static createScope(state: SessionState): Paragraph[] {
    const { prioritization } = state;
    const paragraphs: Paragraph[] = [this.createSectionHeading('10. Scope Matrix')];

    paragraphs.push(
      new Paragraph({
        text: 'This section provides a clear prioritization of all requirements.',
        spacing: { after: 200 },
      })
    );

    // WILL HAVE
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: 'WILL HAVE (Non-Negotiable):', bold: true, underline: {} })],
        spacing: { after: 100 },
      })
    );

    if (prioritization.willHave.length > 0) {
      prioritization.willHave.forEach((item) => {
        paragraphs.push(
          new Paragraph({
            text: `\u2022 ${item.description}`,
            spacing: { after: 100 },
          })
        );
      });
    } else {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: '(None specified)', italics: true })],
          spacing: { after: 100 },
        })
      );
    }

    // COULD HAVE
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: 'COULD HAVE (Nice-to-Have):', bold: true, underline: {} })],
        spacing: { after: 100, before: 200 },
      })
    );

    if (prioritization.couldHave.length > 0) {
      prioritization.couldHave.forEach((item) => {
        paragraphs.push(
          new Paragraph({
            text: `\u2022 ${item.description}`,
            spacing: { after: 100 },
          })
        );
      });
    } else {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: '(None specified)', italics: true })],
          spacing: { after: 100 },
        })
      );
    }

    // WON'T HAVE
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: "WON'T HAVE (Out of Scope):", bold: true, underline: {} })],
        spacing: { after: 100, before: 200 },
      })
    );

    if (prioritization.wontHave.length > 0) {
      prioritization.wontHave.forEach((item) => {
        paragraphs.push(
          new Paragraph({
            text: `\u2022 ${item.description}`,
            spacing: { after: 100 },
          })
        );
      });
    } else {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: '(None specified)', italics: true })],
          spacing: { after: 100 },
        })
      );
    }

    paragraphs.push(new Paragraph({ text: '' }));
    return paragraphs;
  }

  /**
   * Create document footer
   */
  private static createFooter(): Paragraph[] {
    return [
      new Paragraph({ text: '' }),
      new Paragraph({
        text: '---',
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'This creative brief was generated using the Creative Discovery Workshop',
            italics: true,
            size: 18,
            color: '999999',
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
    ];
  }

  /**
   * Helper: Create a section heading
   */
  private static createSectionHeading(text: string): Paragraph {
    return new Paragraph({
      text,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 300, after: 200 },
    });
  }
}
