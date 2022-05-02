window.onload = () => {
    loadScene();
    screenTrans();
    setScrolling(false);
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
    let pageAnc = document.querySelectorAll("a:not([target='_blank'])");
    let fadeEl = document.querySelector(".fadeObject");
    let footer = document.querySelector("footer");
    let fadeTime = 1;
    
    fadeEl.style.opacity = "0.0";
    fadeEl.style.transition = "opacity 1s"
    footer.style.transform = "none";
    footer.style.transition = "transform 1s";
    
    setTimeout(() => {
        fadeEl.style.pointerEvents = "none";
        fadeEl.style.transition = "none"
        footer.style.transition = "none";
        
        ScrollBar.setBars(true);
    }, (fadeTime * 1000));
    
    for (let i = 0; i < pageAnc.length; i++)
    {
        let anchor = pageAnc[i];
        
        anchor.addEventListener("click", e => {
            e.preventDefault();
            let target = e.target.href;
            
            ScrollBar.setBars(false);
            
            fadeEl.style.pointerEvents = "all";
            fadeEl.style.opacity = "1.0";
            fadeEl.style.transition = "opacity 0.5s"
            footer.style.transform = "translateY(100%)";
            footer.style.transition = "transform 0.5s";
            
            setTimeout(() => {
                window.location.href = target;
            }, (fadeTime * 500));
        });
    }
}


// ----------Scrollbar
function ScrollBar ()
{
    ThrowError(1);
}

ScrollBar.setBars = function (state)
{
    if (!state)
    {
        if (this.scrollInterval == null)
        {
            ThrowError(2);
        }
        else if (state == false)
        {
            clearInterval(this.scrollInterval);
            this.barArrowUp.style.visibility = "hidden";
            this.barArrowDown.style.visibility = "hidden";
        }
        else
        {
            ThrowError(0);
        }
        
        return null;
    }
    
    this.scrollBar = document.querySelector(".scrollBar");
    let _barArrowUp = document.createElement("div");
    let _barArrowDown = document.createElement("div");
    let barImg1 = document.createElement("img");
    let barImg2 = document.createElement("img");
    
    _barArrowUp.classList.add("scrollBarUp", "unselectable");
    _barArrowDown.classList.add("scrollBarDown", "unselectable");
    _barArrowUp.style.visibility = "hidden";
    _barArrowDown.style.visibility = "hidden";
    
    let imgSrc = "/img/spr_ui12-12.png"; 
    
    barImg1.src = imgSrc;
    barImg2.src = imgSrc;
    
    _barArrowUp.appendChild(barImg1);
    _barArrowDown.appendChild(barImg2);
    
    this.scrollBar.appendChild(_barArrowUp);
    this.scrollBar.appendChild(_barArrowDown);
    
    this.barArrowUp = document.querySelector(".scrollBarUp");
    this.barArrowDown = document.querySelector(".scrollBarDown");
    
    this.detectScreen();
};

ScrollBar.detectScreen = function ()
{
    let barArrowUp = this.barArrowUp;
    let barArrowDown = this.barArrowDown;
    
    let content = document.querySelector("#mainContent");
    
    this.scrollInterval = setInterval(() => {
        scrollPos = content.scrollTop / (content.scrollHeight - content.clientHeight);
        
        if (!isNaN(scrollPos))
        {
            if (scrollPos <= 0)
            {
                barArrowUp.style.visibility = "hidden";
                barArrowDown.style.visibility = "visible";
            }
            else if (scrollPos >= 1)
            {
                barArrowUp.style.visibility = "visible";
                barArrowDown.style.visibility = "hidden";
            }
            else
            {
                barArrowUp.style.visibility = "visible";
                barArrowDown.style.visibility = "visible";
            }
        }
        else
        {
            barArrowUp.style.visibility = "hidden";
            barArrowDown.style.visibility = "hidden";
        }
    }, 2);
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