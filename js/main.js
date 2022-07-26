window.onload = () => {
    loadScene();
    screenTrans.Start();
};

function loadScene ()
{
    let currentPageE = document.querySelector(".currentPage");
    var currentPage = currentPageE.innerHTML;
    
    if (currentPage == "Updates")
    {
        Updates.load();
    }
}

// ----------Screen Transition
function screenTrans ()
{
    ThrowError(1);
}

screenTrans.Start = function ()
{
    this.body = document.body;
    this.fadeEl = document.querySelector(".fadeObject");
    this.footer = document.querySelector("footer");
    this.fadeTime = 1;
    
    this.fadeEl.style.opacity = "0.0";
    this.fadeEl.style.transition = `opacity ${1 * this.fadeTime}s`;
    this.footer.style.transform = "none";
    this.footer.style.transition = `transform ${1 * this.fadeTime}s`;
    
    setTimeout(() => {
        this.fadeEl.style.pointerEvents = "none";
        this.fadeEl.style.transition = "none"
        this.footer.style.transition = "none";
        
        ScrollBar.setBars(true);
    }, (1000 * this.fadeTime));
    
    setInterval(() => { this.ScanAnchors(); }, 16.67);
};

screenTrans.ScanAnchors = function ()
{
    let pageAnc = document.querySelectorAll("a:not([target='_blank'])");
    
    for (let i = 0; i < pageAnc.length; i++)
    {
        let anchor = pageAnc[i];
        
        anchor.onclick = e => {
            e.preventDefault();
            let target = anchor.href;
            
            ScrollBar.setBars(false);
            
            this.fadeEl.style.pointerEvents = "all";
            this.fadeEl.style.opacity = "1.0";
            this.fadeEl.style.transition = `opacity ${0.5 * this.fadeTime}s`;
            this.footer.style.transform = "translateY(100%)";
            this.footer.style.transition = `transform ${0.5 * this.fadeTime}s`;
            
            setTimeout(() => {
                window.location.href = target;
            }, (500 * this.fadeTime));
        };
    }
};


// ----------Scrollbar
function ScrollBar ()
{
    ThrowError(1);
}

ScrollBar.setBars = function (state)
{
    if (this.scrollInterval != null)
    {
        clearInterval(this.scrollInterval);
        
        this.barUp.remove();
        this.barDown.remove();
        
        if (!state)
        {
            if (this.scrollInterval == null) ThrowError(2);
            return this.scrollInterval = null;
        }
        
        this.scrollInterval = null;
    }
    
    this.scrollBar = document.querySelector(".scrollBar");
    let _barUp = document.createElement("div");
    let _barDown = document.createElement("div");
    let _barArrowUp = document.createElement("div");
    let _barArrowDown = document.createElement("div");
    let barImg1 = document.createElement("img");
    let barImg2 = document.createElement("img");
    
    _barUp.classList.add("scrollBarUp");
    _barDown.classList.add("scrollBarDown");
    barImg1.classList.add("unselectable");
    barImg2.classList.add("unselectable");
    _barUp.style.visibility = "hidden";
    _barDown.style.visibility = "hidden";
    
    let imgSrc = "/img/spr_ui12-12.png"; 
    
    barImg1.src = imgSrc;
    barImg2.src = imgSrc;
    
    _barArrowUp.appendChild(barImg1);
    _barArrowDown.appendChild(barImg2);
    _barUp.appendChild(_barArrowUp);
    _barDown.appendChild(_barArrowDown);
    
    this.scrollBar.appendChild(_barUp);
    this.scrollBar.appendChild(_barDown);
    
    this.barUp = document.querySelector(".scrollBarUp");
    this.barDown = document.querySelector(".scrollBarDown");
    
    this.content = document.querySelector("#mainContent");
    
    this.barUp.onmousedown = () => { this.MoveScroll(-10); };
    this.barDown.onmousedown = () => { this.MoveScroll(10); };
    this.barUp.onmouseup = () => { this.StopScroll(); };
    this.barDown.onmouseup = () => { this.StopScroll(); };
    window.onmouseover = () => { this.StopScroll(); };
    
    this.barUp.ontouchmove = () => { this.MoveScroll(-10); };
    this.barDown.ontouchmove = () => { this.MoveScroll(10); }
    this.barUp.ontouchend = () => { this.StopScroll(); };
    this.barDown.ontouchend = () => { this.StopScroll(); };
    window.ontouchmove = () => { this.StopScroll(); };
    
    this.detectScreen();
};

ScrollBar.detectScreen = function ()
{
    this.scrollInterval = setInterval(() => {
        let scrollPos = this.content.scrollTop / (this.content.scrollHeight - this.content.clientHeight);
        
        if (!isNaN(scrollPos))
        {
            if (scrollPos <= 0)
            {
                this.barUp.style.visibility = "hidden";
                this.barDown.style.visibility = "visible";
            }
            else if (scrollPos >= 1)
            {
                this.barUp.style.visibility = "visible";
                this.barDown.style.visibility = "hidden";
            }
            else
            {
                this.barUp.style.visibility = "visible";
                this.barDown.style.visibility = "visible";
            }
        }
        else
        {
            this.barUp.style.visibility = "hidden";
            this.barDown.style.visibility = "hidden";
        }
    }, 16.67);
};

ScrollBar.MoveScroll = function (amount)
{
    this.moveInterval = setInterval(() => {
        let towardsPos = this.content.scrollTop + amount;
        this.content.scrollTop = towardsPos;
    }, 16.67);
};

ScrollBar.StopScroll = function ()
{
    if (this.moveInterval != null) clearInterval(this.moveInterval);
};


// ----------Debugging
function ThrowError (errorCode)
{
    var errorText;
    
    switch (errorCode)
    {
        case 0:
            errorText = "Value was unassigned or invalid";
            break;
        case 1:
            errorText = "Using static class as a function";
            break;
        case 2:
            errorText = "There is no instance to work with";
            break;
        case 3:
            errorText = "File or source is invalid";
            break;
    }
    
    errorText += `\nError Code: ${errorCode}`;
    
    alert(errorText);
    console.error(errorText);
    throw new Error(errorText);
}