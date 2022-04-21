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
            Updates.updatesData = this.responseText;
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
    
    for (let i = 0; i < this.updatesData; i++)
    {
        let newArticle = document.createElement("article");
        let newAHeader = document.createElement("div");
        let newATitle = document.createElement("div");
        let newADate = document.createElement("div");
        let newAContent = document.createElement("div");
        
        newArticle.classList.add("updateArticle");
        newAHeader.classList.add("updateHeader");
        newATitle.classList.add("updateTitle");
        newADate.classList.add("updateDate");
        newAContent.classList.add("updateContent");
        
        newATitle.innerHTML = this.updatesData[i].title;
        newADate.innerHTML = this.updatesData[i].date;
        newAContent.innerHTML = this.updatesData[i].content;
        
        newAHeader.appendChild(newATitle);
        newAHeader.appendChild(newADate);
        newArticle.appendChild(newAHeader);
        newArticle.appendChild(newAContent);
        this.mainContent.appendChild(newArticle);
    }
};