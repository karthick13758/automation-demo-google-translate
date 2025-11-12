const{test,expect} = require('@playwright/test')
const XLSX = require('xlsx');

test('translate eng to french',async({page})=>{
await page.goto('https://translate.google.co.in/?sl=auto&tl=en&op=translate');
await page.locator("div[class='ccvoYb'] div button[aria-label='More source languages'] div[class='VfPpkd-Bz112c-RLmnJb']").click()
await page.locator("//c-wiz[contains(@class,'bvzp8c Tht3fc')]//div[contains(@class,'OoYv6d')]//input[contains(@placeholder,'Search languages')]").type("English");
await page.keyboard.press('Enter');
await page.locator("//div[contains(@class,'ccvoYb')]//div//button[contains(@aria-label,'More target languages')]//div[contains(@class,'VfPpkd-Bz112c-RLmnJb')]").click()
await page.locator("(//input[contains(@placeholder,'Search languages')])[2]").type('French');
await page.keyboard.press('Enter');

const englishSentance = [
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
]

let result=[];

for(const engSentance of englishSentance)
{
    await page.locator("//textarea[@class='er8xn']").fill('');
     await page.locator("//textarea[@class='er8xn']").fill(engSentance);
     //await page.waitForTimeout(3000);


      const translatedLocator = page.locator('span[jsname="W297wb"]').first();
    await translatedLocator.waitFor({ state: 'visible', timeout: 8000 });
     const translatedText = await translatedLocator.textContent();

     result.push({English:engSentance,French : translatedText});
     //await page.waitForTimeout(3000);
     console.log(`${engSentance} -> ${translatedText}`);


    result.push({ English: engSentance, French: translatedText });

    await page.waitForTimeout(1000);
}


const worksheet = XLSX.utils.json_to_sheet(result);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook,worksheet,'translations.xlsx');

XLSX.writeFile(workbook,'Translations.xlsx');
 

})




