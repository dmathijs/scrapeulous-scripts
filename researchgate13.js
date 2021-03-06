/**
 * @author Diederik Mathijs
 * @version 1.0
 * @last_modified May 2020
 * @website: diederikmathijs.be
 *
 * Returns author and some meta information
 *
 * Supported options:
 *
 * @param url: url of the researchgate publications
 */
class ResearchGate extends BrowserWorker {
    async crawl(url) {
        await this.page.goto(url);
        await this.page.waitForSelector('.nova-e-text');
        await this.page.waitFor(200);
 
        const loadMoreButton = await this.page.$('.show-more-less-authors__button')
        if(loadMoreButton){
            await loadMoreButton.click();
        }

        // ajax load
        await this.page.waitFor(100);

        let options = {
            type: 'png',
            fullPage: false,
            encoding: 'base64'
        };
    
        return await this.page.screenshot(options);
    
        return await this.page.evaluate(() => {
            let data = [];
            
            let authors = document.querySelectorAll('.nova-v-person-list-item__align-content');
            data.push(authors.length)
            authors.forEach((el) => {
                let obj = {
                    title:null,
                    link:null,
                    affiliation:null
                }

                let authorTitle = el.querySelector('.nova-v-person-list-item__title > a')
                if(authorTitle){
                    obj.title = authorTitle.innerText;
                    obj.link = authorTitle.getAttribute('href');
                }

                let metas = el.querySelectorAll('.nova-v-person-list-item__meta-item > a')
                if(metas){
                    metas.forEach((meta) => {
                        if(meta.querySelector('svg')){
                            // This is the rating, can be changed..
                        }else{
                            obj.affiliation = meta.innerText;
                        }
                    })
                }

                data.push(obj)
            });

            return data;
        })
    }
}