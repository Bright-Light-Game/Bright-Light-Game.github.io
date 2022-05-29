function Updates ()
{
    ThrowError(1);
}

Updates.load = function ()
{
    let request = new XMLHttpRequest();
    
    request.onload = () => {
        if (request.status < 400)
        {
            this.updatesData = JSON.parse(request.responseText);
            this.setArticles();
        }
    };
    
    request.onerror = () => {
        ThrowError(3);
    };
    
    request.open("GET", "/data/updates.json");
    request.overrideMimeType("application/json");
    request.send();
};

Updates.setArticles = function ()
{
    this.mainContent = document.querySelector("#mainContent");
    
    for (let i = 0; i < this.updatesData.length; i++)
    {
        let article = document.createElement("article");
        let header = document.createElement("div");
        let title = document.createElement("div");
        let date = document.createElement("div");
        let content = document.createElement("div");
        
        article.classList.add("updateArticle");
        header.classList.add("updateHeader");
        title.classList.add("updateTitle");
        date.classList.add("updateDate");
        content.classList.add("updateContent");
        
        title.innerHTML = this.updatesData[i].title;
        date.innerHTML = this.updatesData[i].date;
        content.innerHTML = this.updatesData[i].content;
        
        header.append(title, date);
        article.append(header, content);
        this.mainContent.append(article);
    }
};