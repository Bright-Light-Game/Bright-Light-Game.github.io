Data.Once("WhileDataLoading", async () => {
    await Updates.Init();
});


class Updates
{
    static #loaded = false;
    
    static async Init ()
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
            
            const postDate = new Date(dat[i].date);
            
            date.append(postDate.toLocaleDateString(undefined, {
                month : "long",
                day : "numeric",
                year : "numeric"
            }));
            
            const parsedContent = marked.parse(dat[i].content, {
                headerIds : false,
                mangle : false
            });
            
            content.insertAdjacentHTML("beforeend", parsedContent.trim());
            
            header.append(title, date);
            article.append(header, content);
            
            Data.html.content.append(article);
        }
        
        this.#loaded = true;
    }
}