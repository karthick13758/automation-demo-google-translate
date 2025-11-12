const { chromium } = require('playwright');
const ExcelJS = require('exceljs');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Translations');
  sheet.addRow(['English', 'French']); // Header

  await page.goto('https://translate.google.com/?sl=en&tl=fr&op=translate');

  const englishSentences = [
    "Hello, how are you?",
    "What is your name?",
    "I love learning Playwright.",
    "The weather is nice today.",
    "Can you help me with this?",
    "Where are you from?",
    "This food tastes amazing!",
    "I will see you tomorrow.",
    "Have a great day!",
    "Thank you very much"
  ];

  for (const sentence of englishSentences) {
    // Type English sentence
    const input = page.locator('textarea[aria-label="Source text"]');
    await input.fill(sentence);

    // Wait for translation box to update
    await page.waitForTimeout(2500);

    // ✅ This locator gets the actual translated sentence
    const translated = page.locator('span[jsname="W297wb"]').first();

    // Wait until translation appears and is not empty
    await translated.waitFor({ state: 'visible', timeout: 10000 });
    const french = await translated.innerText();

    console.log(`English: ${sentence}`);
    console.log(`French : ${french}`);
    console.log('--------------------------------');

    sheet.addRow([sentence, french]);

    // small delay before next
    await page.waitForTimeout(1500);
  }

  // Save Excel file
  await workbook.xlsx.writeFile('translations.xlsx');
  console.log('✅ Translations saved successfully!');

  await browser.close();
})();
