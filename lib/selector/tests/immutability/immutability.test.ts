import * as SUT from '../../../controller';
import { LaunchOptions } from '../../../controller';
import * as path from 'path';

describe('Puppeteer Controller - Selector API - immutability', (): void => {
  let pptc: SUT.PuppeteerController;
  beforeEach((): void => {
    jest.setTimeout(30000);
    pptc = new SUT.PuppeteerController();
  });
  afterEach(
    async (): Promise<void> => {
      await pptc.close();
    },
  );

  test('should be immutable', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'immutability.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    const container = pptc.selector('[role="row"]').find('td');
    const cell1 = container.withText('row1');
    const cell2 = container.withText('row2');
    const cell3 = container.withText('row3');

    // When
    const containerCount = await container.count();
    const handle1 = await cell1.getFirstHandleOrNull();
    const handle2 = await cell2.getFirstHandleOrNull();
    const handle3 = await cell3.getFirstHandleOrNull();

    // Then
    expect(containerCount).toBe(6);

    expect(handle1).not.toBe(null);
    expect(handle2).not.toBe(null);
    expect(handle3).not.toBe(null);

    expect(await handle1?.evaluate((el) => el.innerHTML)).toBe('row1-cell2');
    expect(await handle2?.evaluate((el) => el.innerHTML)).toBe('row2-cell2');
    expect(await handle3?.evaluate((el) => el.innerHTML)).toBe('row3-cell2');

    const expectedChainingHistory1 = `selector([role="row"])
  .find(td)
  .withText(row1)`;
    expect(cell1.toString()).toBe(expectedChainingHistory1);

    const expectedChainingHistory2 = `selector([role="row"])
  .find(td)
  .withText(row2)`;
    expect(cell2.toString()).toBe(expectedChainingHistory2);

    const expectedChainingHistory3 = `selector([role="row"])
  .find(td)
  .withText(row3)`;
    expect(cell3.toString()).toBe(expectedChainingHistory3);
  });
});
