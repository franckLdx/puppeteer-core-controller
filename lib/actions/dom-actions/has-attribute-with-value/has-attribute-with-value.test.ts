import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';

describe('selector has attribute with value', (): void => {
  let browser: puppeteer.Browser | undefined = undefined;
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
  afterEach(
    async (): Promise<void> => {
      if (browser) {
        await browser.close();
      }
    },
  );
  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: puppeteer.Page | undefined = undefined;
    // When
    // Then
    const expectedError = new Error(
      "Error: cannot get attribute 'foo' of 'selector' because a new page has not been created",
    );
    await SUT.hasAttributeWithValue('selector', 'foo', 'bar', page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should return an error when selector is not found', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();

    // When

    // Then
    const expectedError = new Error('Error: failed to find element matching selector "selector"');
    await SUT.hasAttributeWithValue('selector', 'foo', 'bar', page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should return false when attribute does not exist', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'has-attribute-with-value.test.html')}`);

    // When
    const hasAttribute = await SUT.hasAttributeWithValue('#no-attr', 'foo', 'bar', page);

    // Then
    expect(hasAttribute).toBe(false);
  });

  test('should return true when attribute exists but has no value', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'has-attribute-with-value.test.html')}`);

    // When
    const hasAttribute = await SUT.hasAttributeWithValue('#no-value-attr', 'foo', '', page);

    // Then
    expect(hasAttribute).toBe(true);
  });

  test('should return true when attribute exists and has an empty value', async (): Promise<
    void
  > => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'has-attribute-with-value.test.html')}`);

    // When
    const hasAttribute = await SUT.hasAttributeWithValue('#empty-attr', 'foo', '', page);

    // Then
    expect(hasAttribute).toBe(true);
  });

  test('should return true when attribute exists and has a value', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'has-attribute-with-value.test.html')}`);

    // When
    const hasAttribute = await SUT.hasAttributeWithValue('#with-attr', 'foo', 'bar', page);

    // Then
    expect(hasAttribute).toBe(true);
  });
});
