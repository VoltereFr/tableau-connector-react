import TestsDriver from '@braincube/ui-tests-js';

const driver = new TestsDriver('/testsUI/pages/components/Header/', 'testsUI/screenshots/components/Header/');

driver.openPage('index.html')
    .then(driver.takeScreenshot('Header.png'));