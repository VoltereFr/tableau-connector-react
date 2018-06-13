import TestsDriver from '@braincube/ui-tests-js';
import assert from 'assert';

const driver = new TestsDriver('', 'testsUI/screenshots/app');

driver.openPage('index.html')
    .then(takeScreenshot)
    .then(assertExample);

function takeScreenshot () {
    driver.sleep(100);
    return driver.takeScreenshot('App.png');
}

function assertExample() {
    return driver.findElementsWithText('Welcome to Braincube React').then(elements => {
        assert(elements.length, 1);
    });
}

driver.quit();
