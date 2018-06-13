import TestsDriver from '@braincube/ui-tests-js';

const driver = new TestsDriver('/testsUI/pages/components/Content/', 'testsUI/screenshots/components/Content/');

driver.openPage('index.html')
    .then(driver.takeScreenshot('Content.png'));