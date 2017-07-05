describe('Device', () => {
    beforeEach(() => {
        browser.waitForAngularEnabled(false);
        browser.get('/index.html');
    });

    afterEach(() => {
        browser.manage().deleteAllCookies();
    });

    it('should pageInfo equal 设备', () => {
         expect(browser.getTitle()).toBe('备忘录');
    });

    it('should can create', () => {
        let subject = $('#btnCreate').isPresent();
        subject.then( (ret) => {
            expect(ret).toEqual(true);
        });

        $('#btnCreate').click();
        var oldVal = $$('.pageinfo strong').get(1).getText()

        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf($('#txtLink')), 1000, 'wait for txtLink visible');

        $('#txtDesc').sendKeys('desc');
        $('#txtLink').sendKeys('link');

        $('#btnSave').click();

        browser.wait(EC.invisibilityOf($('#txtLink')), 1000, 'wait for txtLink hidden');

        var newVal = $$('.pageinfo strong').get(1).getText()
        expect(oldVal).not.toEqual(newVal);
    });

    it('should can search by keyword link', () => {
        var EC = protractor.ExpectedConditions;
        $('#txtSearch').sendKeys(Math.random().toString().slice(-10)+'!@#');
        $('#btnSearch').click();
        
        browser.wait(EC.stalenessOf($$('.tr-model')), 2000);

        $$('.tr-model').count().then((count) => {
            expect(count).toBe(0);
        });

        $('#txtSearch').clear();
        $('#txtSearch').sendKeys('link');
        $('#btnSearch').click();

        browser.wait(EC.presenceOf ($$('.tr-model')), 2000);

        $$('.tr-model').count().then((count) => {
            expect(count).toBeGreaterThan(0);
        });

    });

    it('should can remove by click 删除 text', () => {
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.presenceOf($$('.tr-model')), 2000);

        $$('.tr-model td .gap.a-remove').count().then((oldCount) => {
            expect(oldCount).toBeGreaterThan(0);

            $$('.tr-model td .gap.a-remove').get(0).click();
            let alertDialog = browser.switchTo().alert();
            browser.sleep(1000);
            alertDialog.accept(); // alertDialog.dismiss();
            browser.sleep(1000);

            $$('.tr-model td .gap.a-remove').count().then((newCount) => {
                expect(oldCount).toBeGreaterThan(newCount);
            });
        });
    });

    it('should can create for remove all', () => {
        let subject = $('#btnCreate').isPresent();
        subject.then( (ret) => {
            expect(ret).toEqual(true);
        });

        $('#btnCreate').click();

        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf($('#txtLink')), 1000, 'wait for txtLink visible');

        $('#txtDesc').sendKeys('desc');
        $('#txtLink').sendKeys('link');

        $('#btnSave').click();

        browser.wait(EC.invisibilityOf($('#txtLink')), 1000, 'wait for txtLink hidden');

        $$('.tr-model').count().then((ret) => {
            expect(ret).toBeGreaterThan(0);
        });
    });

    it('should can remove all by click 删除 button', () => {
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.presenceOf($$('.tr-model')), 2000);
        var oldVal = $$('.pageinfo strong').get(1).getText()

        $('tr th input').click();
        browser.wait(EC.elementToBeSelected($('tr th input')), 2000, 'click checkbox to select all');
        $('#btnRemove').click();
        let alertDialog = browser.switchTo().alert();
        browser.sleep(1000);
        alertDialog.accept(); // alertDialog.dismiss();
        browser.sleep(1000);
        browser.wait(EC.not(EC.elementToBeSelected($('tr th input'))), 2000,'after remove all');
        var newVal = $$('.pageinfo strong').get(1).getText()

        expect(oldVal).not.toEqual(newVal);
        browser.sleep(1000);
    });
});
