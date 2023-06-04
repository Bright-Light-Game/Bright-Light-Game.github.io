Data.once("WhileDataLoading", async () => {
    await Updates.init();
});


class Updates
{
    static #loaded = false;
    
    static async init ()
    {
        if (this.#loaded) return;
        
        const response = await fetch("/data/updates.json");
        const dat = await response.json();
        
        for (let i = 0; i < dat.length; i++)
        {
            const article = document.createElement("article");
            const header = document.createElement("div");
            const title = document.createElement("div");
            const date = document.createElement("div");
            const content = document.createElement("div");
            
            article.classList.add("updateArticle");
            header.classList.add("updateHeader");
            title.classList.add("updateTitle");
            date.classList.add("updateDate");
            content.classList.add("updateContent");
            
            title.append(dat[i].title);
            date.append(dat[i].date);
            
            const parsedContent = marked.parse(dat[i].content, {
                headerIds : false,
                mangle : false
            });
            
            content.insertAdjacentHTML("beforeend", parsedContent);
            
            header.append(title, date);
            article.append(header, content);
            
            data.html.content.append(article);
        }
        
        this.#loaded = true;
    }
}