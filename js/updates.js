function Updates ()
{
    ThrowError(1);
}

Updates.load = function ()
{
    let request = new XMLHttpRequest();
    
    request.onload = function ()
    {
        if (request.status < 400)
        {
            Updates.updatesData = JSON.parse(this.responseText);
            Updates.setArticles();
        }
    };
    
    request.onerror = function ()
    {
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
        let newArticle = document.createElement("article");
        let newAHeader = document.createElement("div");
        let newATitle = document.createElement("div");
        let newADate = document.createElement("div");
        let newAContent = document.createElement("div");
        
        newArticle.setAttribute("id", `uA${i}`);
        
        newArticle.classList.add("updateArticle");
        newAHeader.classList.add("updateHeader");
        newATitle.classList.add("updateTitle");
        newADate.classList.add("updateDate");
        newAContent.classList.add("updateContent");
        
        newAHeader.appendChild(newATitle);
        newAHeader.appendChild(newADate);
        newArticle.appendChild(newAHeader);
        newArticle.appendChild(newAContent);
        this.mainContent.appendChild(newArticle);
        
        let Article = document.querySelector(`#uA${i}`);
        let ATitle = Article.querySelector("updateTitle");
        let ADate = Article.querySelector("updateDate");
        let AContent = Article.querySelector("updateContent");
        
        ATitle.innerHTML = this.updatesData[i].title;
        ADate.innerHTML = this.updatesData[i].date;
        AContent.innerHTML = this.updatesData[i].content;
    }
};