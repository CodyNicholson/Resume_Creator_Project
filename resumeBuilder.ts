import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';

/** Strategy 1: Creating the resume from scratch */
export async function createResume(outPath = 'Cody_Nicholson_Resume.pdf') {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  page.drawRectangle({ x: 0, y: height - 120, width, height: 120, color: rgb(0.14, 0.22, 0.33) });
  page.drawText('Cody Nicholson', { x: 40, y: height - 55, size: 28, font: helveticaBold, color: rgb(1, 1, 1) });
  page.drawText('Software Engineer', { x: 40, y: height - 80, size: 16, font: helveticaFont, color: rgb(0.38, 0.76, 0.77) });

  page.drawRectangle({ x: 35, y: height - 180, width: 150, height: 25, color: rgb(0.18, 0.49, 0.55) });
  page.drawText('WORK EXPERIENCE', { x: 40, y: height - 173, size: 11, font: helveticaBold, color: rgb(1, 1, 1) });
  page.drawText('Lead Software Engineer', { x: 40, y: height - 210, size: 14, font: helveticaBold, color: rgb(0.1, 0.1, 0.1) });
  page.drawText('Ahold Delhaize USA', { x: 40, y: height - 225, size: 12, font: helveticaFont, color: rgb(0.3, 0.3, 0.3) });

  fs.writeFileSync(outPath, await pdfDoc.save());
  console.log(`Resume successfully created as "${outPath}"`);
}

/** Strategy 2: Modifying an existing PDF */
export async function modifyExistingResume(
  inPath = 'Cody_Nicholson_Resume.pdf',
  outPath = 'Cody_Nicholson_Resume_Modified.pdf'
) {
  const pdfDoc = await PDFDocument.load(fs.readFileSync(inPath));
  const firstPage = pdfDoc.getPages()[0];
  const { height } = firstPage.getSize();
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  firstPage.drawText('UPDATED VIA SCRIPT', { x: 40, y: height - 300, size: 10, font: helveticaBold, color: rgb(0.9, 0.1, 0.1) });

  fs.writeFileSync(outPath, await pdfDoc.save());
  console.log(`Resume successfully modified as "${outPath}"`);
}

async function main() {
  await createResume();
  await modifyExistingResume();
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
