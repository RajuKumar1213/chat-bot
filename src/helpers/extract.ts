import { LoadParameters, PDFParse, VerbosityLevel } from 'pdf-parse';
import mammoth from 'mammoth';
import { readFileSync } from 'fs';

export const extractPdf = async (filePath: string) => {
  const loadParams: LoadParameters = {
    url: filePath,
    verbosity: VerbosityLevel.WARNINGS,
  } as LoadParameters;

  const parser = new PDFParse(loadParams);
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
};

export const extractDocx = async (filePath: string) => {
  const { value } = await mammoth.extractRawText({ path: filePath });
  return value;
};
export const extractTxt = (filePath: string) => readFileSync(filePath, 'utf8');
