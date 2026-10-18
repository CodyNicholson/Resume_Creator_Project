/**
 * =============================================================================
 *  RESUME PDF BUILDER
 *  Generates a PDF that matches the CodyResume.pdf layout pixel-for-pixel.
 *
 *  Usage:
 *    npx tsx resumeBuilder.ts                         # outputs Cody_Nicholson_Resume.pdf
 *    npx tsx resumeBuilder.ts my_resume.pdf           # custom output filename
 *
 *  To customise content, edit resumeData.ts
 * =============================================================================
 */

import { PDFDocument, PDFFont, PDFPage, rgb, PDFImage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import resumeData, { ResumeData } from './resumeData';

// ─── COLOUR PALETTE ──────────────────────────────────────────────────────────
const COLORS = {
  darkNavy: rgb(0.192, 0.235, 0.306),   // #313C4E
  teal: rgb(0.267, 0.576, 0.600),        // #449399
  black: rgb(0, 0, 0),
  white: rgb(1, 1, 1),
  grey: rgb(0.486, 0.486, 0.486),        // #7C7C7C
};

// ─── PAGE DIMENSIONS ─────────────────────────────────────────────────────────
const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;

// ─── COLUMN LAYOUT ───────────────────────────────────────────────────────────
const LEFT_MARGIN = 38.9;
const LEFT_COL_TEXT_WIDTH = 255;
const RIGHT_COL_X = 323.9;
const RIGHT_COL_TEXT_WIDTH = 250;
const BULLET_INDENT = 9;

// ─── LEFT SIDEBAR TAB ───────────────────────────────────────────────────────
const SIDEBAR_TAB_WIDTH = 24;
const SIDEBAR_TAB_HEIGHT = 36.8;

// ─── FONT SIZES ──────────────────────────────────────────────────────────────
const FONT_SIZE = {
  name: 23.1,
  title: 12.1,
  tagline: 8.9,
  sectionHeader: 13.9,
  jobTitle: 12.1,
  company: 12.1,
  dateRange: 8.0,
  bulletText: 8.9,
  contactText: 8.9,
  skillPill: 8.9,
  projectTitle: 10.1,
  projectBullet: 8.0,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  for (const word of words) {
    const test = currentLine ? `${currentLine} ${word}` : word;
    if (font.widthOfTextAtSize(test, fontSize) > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = test;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function yFromTop(topY: number): number {
  return PAGE_HEIGHT - topY;
}

function drawBulletDot(page: PDFPage, x: number, y: number, radius = 1.94) {
  page.drawCircle({ x, y, size: radius, color: COLORS.teal });
}

/**
 * Create a circular-cropped PNG buffer from the input image using sharp.
 */
async function createCircularPhotoBuffer(inputPath: string, size = 400): Promise<Buffer> {
  const circleSvg = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/></svg>`
  );
  return sharp(inputPath)
    .resize(size, size, { fit: 'cover' })
    .composite([{ input: circleSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

// ─── Contact Icon Drawing ───────────────────────────────────────────────────

function drawEnvelopeIcon(page: PDFPage, cx: number, cy: number) {
  const w = 11.8, h = 8.2;
  const x0 = cx - w / 2, y0 = cy - h / 2;
  page.drawRectangle({ x: x0, y: y0, width: w, height: h, borderColor: COLORS.darkNavy, borderWidth: 1.0, opacity: 0 });
  page.drawLine({ start: { x: x0, y: y0 + h }, end: { x: cx, y: cy - 1.5 }, thickness: 1.0, color: COLORS.darkNavy });
  page.drawLine({ start: { x: x0 + w, y: y0 + h }, end: { x: cx, y: cy - 1.5 }, thickness: 1.0, color: COLORS.darkNavy });
}

function drawLinkedInIcon(page: PDFPage, cx: number, cy: number) {
  const s = 11;
  const x0 = cx - s / 2, y0 = cy - s / 2;
  page.drawRectangle({ x: x0, y: y0, width: s, height: s, color: COLORS.darkNavy });
  page.drawRectangle({ x: x0 + 2.2, y: y0 + 2, width: 1.8, height: 5, color: COLORS.white });
  page.drawCircle({ x: x0 + 3.1, y: y0 + 8.2, size: 1.1, color: COLORS.white });
  page.drawRectangle({ x: x0 + 5, y: y0 + 2, width: 1.6, height: 5, color: COLORS.white });
  page.drawRectangle({ x: x0 + 5, y: y0 + 5.5, width: 3.5, height: 1.6, color: COLORS.white });
  page.drawRectangle({ x: x0 + 7.2, y: y0 + 2, width: 1.6, height: 5, color: COLORS.white });
}

function drawGitHubIcon(page: PDFPage, cx: number, cy: number) {
  page.drawCircle({ x: cx, y: cy, size: 5.9, borderColor: COLORS.darkNavy, borderWidth: 1.5, color: COLORS.white });
  page.drawCircle({ x: cx, y: cy + 0.5, size: 3.5, color: COLORS.darkNavy });
  page.drawCircle({ x: cx, y: cy - 0.5, size: 2.5, color: COLORS.white });
  page.drawCircle({ x: cx - 1.2, y: cy + 0.2, size: 0.6, color: COLORS.white });
  page.drawCircle({ x: cx + 1.2, y: cy + 0.2, size: 0.6, color: COLORS.white });
  page.drawRectangle({ x: cx - 3.8, y: cy + 2.5, width: 2.5, height: 2.5, color: COLORS.darkNavy });
  page.drawRectangle({ x: cx + 1.3, y: cy + 2.5, width: 2.5, height: 2.5, color: COLORS.darkNavy });
}

// ═════════════════════════════════════════════════════════════════════════════
//  MAIN BUILDER
// ═════════════════════════════════════════════════════════════════════════════

export async function buildResume(data: ResumeData, outPath: string) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // ── Load fonts ──
  const fontDir = path.join(__dirname, 'fonts');
  const fontRegular = await pdfDoc.embedFont(fs.readFileSync(path.join(fontDir, 'Ubuntu-Regular.ttf')));
  const fontBold = await pdfDoc.embedFont(fs.readFileSync(path.join(fontDir, 'Ubuntu-Bold.ttf')));
  const fontItalic = await pdfDoc.embedFont(fs.readFileSync(path.join(fontDir, 'Ubuntu-Italic.ttf')));

  // ── Load & circularise profile photo ──
  let profileImage: PDFImage | null = null;
  const photoPath = path.resolve(data.contact.profilePhotoPath);
  if (fs.existsSync(photoPath)) {
    const circularPngBuffer = await createCircularPhotoBuffer(photoPath);
    profileImage = await pdfDoc.embedPng(circularPngBuffer);
  }

  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // ═══════════════════════════════════════════════════════════════════════════
  //  HEADER
  // ═══════════════════════════════════════════════════════════════════════════

  // Left sidebar accent tab
  page.drawRectangle({
    x: 0, y: yFromTop(61.7), width: SIDEBAR_TAB_WIDTH, height: SIDEBAR_TAB_HEIGHT,
    color: COLORS.darkNavy,
  });

  // Horizontal divider line
  page.drawRectangle({
    x: 0, y: yFromTop(116.8), width: PAGE_WIDTH, height: 0.91,
    color: COLORS.darkNavy,
  });

  // Profile photo (circular)
  if (profileImage) {
    const photoCx = 305.7;
    const photoCy_top = 62;
    const photoRadius = 39.55;

    // Teal ring behind photo
    page.drawCircle({
      x: photoCx, y: yFromTop(photoCy_top), size: photoRadius + 1.5,
      color: COLORS.teal,
    });

    const imgSize = photoRadius * 2;
    page.drawImage(profileImage, {
      x: photoCx - photoRadius,
      y: yFromTop(photoCy_top) - photoRadius,
      width: imgSize,
      height: imgSize,
    });
  }

  // Name
  page.drawText(data.contact.name, {
    x: LEFT_MARGIN - 1, y: yFromTop(42.5),
    size: FONT_SIZE.name, font: fontRegular, color: COLORS.darkNavy,
  });

  // Title
  page.drawText(data.contact.title, {
    x: LEFT_MARGIN, y: yFromTop(59.9),
    size: FONT_SIZE.title, font: fontRegular, color: COLORS.teal,
  });

  // Tagline
  data.contact.tagline.forEach((line, i) => {
    page.drawText(line, {
      x: LEFT_MARGIN, y: yFromTop(78.4 + i * 11),
      size: FONT_SIZE.tagline, font: fontRegular, color: COLORS.black,
    });
  });

  // Contact info (right-aligned)
  const contactRightEdge = 566.2;
  const iconOffsetX = 12;

  const emailW = fontRegular.widthOfTextAtSize(data.contact.email, FONT_SIZE.contactText);
  page.drawText(data.contact.email, {
    x: contactRightEdge - emailW, y: yFromTop(31.5),
    size: FONT_SIZE.contactText, font: fontRegular, color: COLORS.black,
  });
  drawEnvelopeIcon(page, contactRightEdge + iconOffsetX, yFromTop(28));

  const linkedinW = fontRegular.widthOfTextAtSize(data.contact.linkedin, FONT_SIZE.contactText);
  page.drawText(data.contact.linkedin, {
    x: contactRightEdge - linkedinW, y: yFromTop(55.3),
    size: FONT_SIZE.contactText, font: fontRegular, color: COLORS.black,
  });
  drawLinkedInIcon(page, contactRightEdge + iconOffsetX, yFromTop(52));

  const githubW = fontRegular.widthOfTextAtSize(data.contact.github, FONT_SIZE.contactText);
  page.drawText(data.contact.github, {
    x: contactRightEdge - githubW, y: yFromTop(79.1),
    size: FONT_SIZE.contactText, font: fontRegular, color: COLORS.black,
  });
  drawGitHubIcon(page, contactRightEdge + iconOffsetX, yFromTop(75.5));

  // ═══════════════════════════════════════════════════════════════════════════
  //  LEFT COLUMN — WORK EXPERIENCE
  // ═══════════════════════════════════════════════════════════════════════════

  let leftY = 142.2;

  page.drawText('WORK EXPERIENCE', {
    x: LEFT_MARGIN, y: yFromTop(leftY),
    size: FONT_SIZE.sectionHeader, font: fontBold, color: COLORS.black,
  });
  leftY += 18;

  for (const job of data.workExperiences) {
    const sidebarCenterY = leftY + 14;
    page.drawRectangle({
      x: 0, y: yFromTop(sidebarCenterY + SIDEBAR_TAB_HEIGHT / 2),
      width: SIDEBAR_TAB_WIDTH, height: SIDEBAR_TAB_HEIGHT,
      color: COLORS.teal,
    });

    page.drawText(job.jobTitle, {
      x: LEFT_MARGIN, y: yFromTop(leftY),
      size: FONT_SIZE.jobTitle, font: fontBold, color: COLORS.black,
    });
    leftY += 13.7;

    page.drawText(job.company, {
      x: LEFT_MARGIN, y: yFromTop(leftY),
      size: FONT_SIZE.company, font: fontRegular, color: COLORS.black,
    });
    leftY += 13.2;

    page.drawText(job.dateRange, {
      x: LEFT_MARGIN, y: yFromTop(leftY),
      size: FONT_SIZE.dateRange, font: fontItalic, color: COLORS.teal,
    });
    if (job.location) {
      const dateW = fontItalic.widthOfTextAtSize(job.dateRange, FONT_SIZE.dateRange);
      page.drawText(',', {
        x: LEFT_MARGIN + dateW, y: yFromTop(leftY),
        size: FONT_SIZE.dateRange, font: fontRegular, color: COLORS.black,
      });
      const locW = fontItalic.widthOfTextAtSize(job.location, FONT_SIZE.dateRange);
      page.drawText(job.location, {
        x: LEFT_MARGIN + LEFT_COL_TEXT_WIDTH - locW + 10, y: yFromTop(leftY),
        size: FONT_SIZE.dateRange, font: fontItalic, color: COLORS.teal,
      });
    }
    leftY += 14;

    for (const bullet of job.bullets) {
      const lines = wrapText(bullet, fontRegular, FONT_SIZE.bulletText, LEFT_COL_TEXT_WIDTH - BULLET_INDENT);
      drawBulletDot(page, LEFT_MARGIN + 2, yFromTop(leftY) - 3);
      for (const line of lines) {
        page.drawText(line, {
          x: LEFT_MARGIN + BULLET_INDENT, y: yFromTop(leftY),
          size: FONT_SIZE.bulletText, font: fontRegular, color: COLORS.black,
        });
        leftY += 11;
      }
      leftY += 3.8;
    }
    leftY += 8;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  RIGHT COLUMN
  // ═══════════════════════════════════════════════════════════════════════════

  let rightY = 142.2;

  // ── SKILLS ──────────────────────────────────────────────────────────────────
  page.drawText('SKILLS', {
    x: RIGHT_COL_X, y: yFromTop(rightY),
    size: FONT_SIZE.sectionHeader, font: fontBold, color: COLORS.black,
  });
  rightY += 22;

  const PILL_H = 16.9;
  const PILL_GAP_X = 4.8;
  const PILL_GAP_Y = 8.1;
  const PILL_PADDING_X = 6.9;
  const SKILL_AREA_WIDTH = PAGE_WIDTH - RIGHT_COL_X - 30;

  let pillX = RIGHT_COL_X;
  let pillRowY = rightY;

  for (const skill of data.skills) {
    const textWidth = fontRegular.widthOfTextAtSize(skill.name, FONT_SIZE.skillPill);
    const pillWidth = textWidth + PILL_PADDING_X * 2;

    if (pillX + pillWidth > RIGHT_COL_X + SKILL_AREA_WIDTH && pillX > RIGHT_COL_X) {
      pillX = RIGHT_COL_X;
      pillRowY += PILL_H + PILL_GAP_Y;
    }

    page.drawRectangle({
      x: pillX, y: yFromTop(pillRowY + 6),
      width: pillWidth, height: PILL_H,
      color: COLORS.darkNavy,
    });
    page.drawText(skill.name, {
      x: pillX + PILL_PADDING_X, y: yFromTop(pillRowY),
      size: FONT_SIZE.skillPill, font: fontRegular, color: COLORS.white,
    });

    pillX += pillWidth + PILL_GAP_X;
  }

  rightY = pillRowY + PILL_H + 30;

  // ── PERSONAL PROJECTS ──────────────────────────────────────────────────────
  page.drawText('PERSONAL PROJECTS', {
    x: RIGHT_COL_X, y: yFromTop(rightY),
    size: FONT_SIZE.sectionHeader, font: fontBold, color: COLORS.black,
  });
  rightY += 16.5;

  for (const project of data.personalProjects) {
    page.drawText(project.title, {
      x: RIGHT_COL_X, y: yFromTop(rightY),
      size: FONT_SIZE.projectTitle, font: fontRegular, color: COLORS.black,
    });
    rightY += 11;

    for (const bullet of project.bullets) {
      const lines = wrapText(bullet, fontRegular, FONT_SIZE.projectBullet, RIGHT_COL_TEXT_WIDTH - BULLET_INDENT);
      drawBulletDot(page, RIGHT_COL_X + 2, yFromTop(rightY) - 2.5);
      for (const line of lines) {
        page.drawText(line, {
          x: RIGHT_COL_X + BULLET_INDENT, y: yFromTop(rightY),
          size: FONT_SIZE.projectBullet, font: fontRegular, color: COLORS.black,
        });
        rightY += 9;
      }
      rightY += 2.8;
    }
    rightY += 12;
  }

  // ── VOLUNTEER EXPERIENCE ───────────────────────────────────────────────────
  page.drawText('VOLUNTEER EXPERIENCE', {
    x: RIGHT_COL_X, y: yFromTop(rightY),
    size: FONT_SIZE.sectionHeader, font: fontBold, color: COLORS.black,
  });
  rightY += 18;

  for (const vol of data.volunteerExperiences) {
    page.drawText(vol.role, {
      x: RIGHT_COL_X, y: yFromTop(rightY),
      size: FONT_SIZE.jobTitle, font: fontBold, color: COLORS.black,
    });
    rightY += 13.8;

    page.drawText(vol.organization, {
      x: RIGHT_COL_X, y: yFromTop(rightY),
      size: FONT_SIZE.company, font: fontRegular, color: COLORS.black,
    });
    rightY += 13.2;

    page.drawText(vol.dateRange, {
      x: RIGHT_COL_X, y: yFromTop(rightY),
      size: FONT_SIZE.dateRange, font: fontItalic, color: COLORS.teal,
    });
    if (vol.location) {
      const dateW = fontItalic.widthOfTextAtSize(vol.dateRange, FONT_SIZE.dateRange);
      page.drawText(',', {
        x: RIGHT_COL_X + dateW, y: yFromTop(rightY),
        size: FONT_SIZE.dateRange, font: fontRegular, color: COLORS.black,
      });
      const locW = fontItalic.widthOfTextAtSize(vol.location, FONT_SIZE.dateRange);
      page.drawText(vol.location, {
        x: PAGE_WIDTH - 45 - locW, y: yFromTop(rightY),
        size: FONT_SIZE.dateRange, font: fontItalic, color: COLORS.teal,
      });
    }
    rightY += 24.7;

    for (const bullet of vol.bullets) {
      const lines = wrapText(bullet, fontRegular, FONT_SIZE.bulletText, RIGHT_COL_TEXT_WIDTH - BULLET_INDENT);
      drawBulletDot(page, RIGHT_COL_X + 2, yFromTop(rightY) - 3);
      for (const line of lines) {
        page.drawText(line, {
          x: RIGHT_COL_X + BULLET_INDENT, y: yFromTop(rightY),
          size: FONT_SIZE.bulletText, font: fontRegular, color: COLORS.black,
        });
        rightY += 10.9;
      }
      rightY += 3.9;
    }
    rightY += 15;
  }

  // ── EDUCATION ──────────────────────────────────────────────────────────────
  page.drawText('EDUCATION', {
    x: RIGHT_COL_X, y: yFromTop(rightY),
    size: FONT_SIZE.sectionHeader, font: fontBold, color: COLORS.black,
  });
  rightY += 18;

  for (const edu of data.education) {
    page.drawText(edu.institution, {
      x: RIGHT_COL_X, y: yFromTop(rightY),
      size: FONT_SIZE.jobTitle, font: fontBold, color: COLORS.black,
    });
    rightY += 13.7;

    page.drawText(edu.degree, {
      x: RIGHT_COL_X, y: yFromTop(rightY),
      size: FONT_SIZE.company, font: fontRegular, color: COLORS.black,
    });
    rightY += 14.4;

    for (const activity of edu.activities) {
      drawBulletDot(page, RIGHT_COL_X + 2, yFromTop(rightY) - 3);
      page.drawText(activity, {
        x: RIGHT_COL_X + BULLET_INDENT, y: yFromTop(rightY),
        size: FONT_SIZE.bulletText, font: fontRegular, color: COLORS.black,
      });
      rightY += 14.9;
    }
    rightY += 10;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  SAVE
  // ═══════════════════════════════════════════════════════════════════════════

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outPath, pdfBytes);
  console.log(`✅ Resume saved to "${outPath}" (${(pdfBytes.length / 1024).toFixed(1)} KB)`);
}

// ─── CLI Entry Point ─────────────────────────────────────────────────────────

async function main() {
  const outPath = process.argv[2] || 'Cody_Nicholson_Resume.pdf';
  await buildResume(resumeData, outPath);
}

if (require.main === module) {
  main().catch((err) => {
    console.error('❌ Error building resume:', err);
    process.exit(1);
  });
}
