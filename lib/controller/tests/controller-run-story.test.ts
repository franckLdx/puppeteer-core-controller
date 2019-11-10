import * as SUT from '../controller';
import { LaunchOptions } from '../../actions';

describe('Puppeteer Controller', (): void => {
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

  test('should select an existing option', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/components/form';
    const customSelect = 'select#exampleCustomSelect';
    const option = 'Value 3';
    const openApplication: SUT.Story = (pptc: SUT.PuppeteerController): void => {
      pptc
        .initWith(launchOptions)
        .withMaxSizeWindow()
        .navigateTo(url);
    };

    const fillForm: SUT.Story = (pptc: SUT.PuppeteerController): void => {
      pptc
        .click(customSelect)
        .select(option)
        .in(customSelect);
    };

    // When
    // prettier-ignore
    await pptc
      .runStory(openApplication)
      .runStory(fillForm);

    // Then
    const selectedOption = await pptc.getSelectedOptionOf(customSelect);
    expect(selectedOption).toBe(option);
    expect(pptc.lastError).toBe(undefined);
  });
});