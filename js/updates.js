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
        this.mainContent.innerHTML += `<article class="updateArticle"><div class="updateHeader"><div class="updateTitle">${this.updatesData[i].title}</div><div class="updateDate">${this.updatesData[i].date}</div></div><div class="updateContent">${this.updatesData[i].content}</div></article>`;
    }
};