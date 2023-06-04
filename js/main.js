window.onload = () => {
    Loop.init();
    Data.init();
};


var data = {
    html : {
        body : null,
        main : null,
        content : null,
        footer : null
    },
    samestyleoriginsites : [],
    openedfromssos : false,
    delay : async (time) => {
        return new Promise(resolve => setTimeout(resolve, time + Loop.deltaTime));
    },
    isSsos : (src) => {
        const siteList = data.samestyleoriginsites;
        
        for (let i = 0; i < siteList.length; i++) if (src === `${window.location.origin}/${siteList[i]}`) return true;
        
        return false;
    }
};


class Data
{
    static #loaded = false;
    static #events = [];
    static #event = null;
    
    static get isLoaded ()
    {
        return this.#loaded;
    }
    
    static get currentEvent ()
    {
        return this.#event;
    }
    
    static #compareMethod (lhs, rhs)
    {
        const lS = `${lhs}`;
        const rS = `${rhs}`;
        
        let a = "";
        let b = "";
        
        for (let i = 0; i < lS.length; i++)
        {
            if (lS[i] === "\n") continue;
            if (lS[i - 1] === " " && lS[i] === " ") continue;
            if (lS[i + 1] === " " && lS[i] === " ") continue;
            if (lS[i - 1] === "{" && lS[i] === " ") continue;
            if (lS[i + 1] === "}" && lS[i] === " ") continue;
            if (lS[i - 1] === "(" && lS[i] === " ") continue;
            if (lS[i + 1] === ")" && lS[i] === " ") continue;
            if (lS[i - 1] === "," && lS[i] === " ") continue;
            if (lS[i + 1] === "," && lS[i] === " ") continue;
            
            a += lS[i];
        }
        
        for (let i = 0; i < rS.length; i++)
        {
            if (rS[i] === "\n") continue;
            if (rS[i - 1] === " " && rS[i] === " ") continue;
            if (rS[i + 1] === " " && rS[i] === " ") continue;
            if (rS[i - 1] === "{" && rS[i] === " ") continue;
            if (rS[i + 1] === "}" && rS[i] === " ") continue;
            if (rS[i - 1] === "(" && rS[i] === " ") continue;
            if (rS[i + 1] === ")" && rS[i] === " ") continue;
            if (rS[i - 1] === "," && rS[i] === " ") continue;
            if (rS[i + 1] === "," && rS[i] === " ") continue;
            
            b += rS[i];
        }
        
        return a === b;
    }
    
    static on (event, callback)
    {
        if (event == null || callback == null) throw new Error("Data needed for class method 'Data.on' is undefined");
        
        const listener = {
            event : event,
            callback : callback,
            recallable : true,
            called : false
        };
        
        for (let iA = 0; iA < this.#events.length; iA++)
        {
            const equalEvent = listener.event === this.#events[iA].event;
            const equalMethod = this.#compareMethod(listener.callback, this.#events[iA].callback);
            const equalRecall = listener.recallable === this.#events[iA].recallable;
            
            if (equalEvent && equalMethod && equalRecall)
            {
                let newEvents = [];
                
                for (let iB = 0; iB < this.#events.length; iB++)
                {
                    if (iB === iA) continue;
                    
                    if (newEvents.length === 0) newEvents[0] = this.#events[iB];
                    else newEvents.push(this.#events[iB]);
                }
                
                this.#events = newEvents;
                
                return;
            }
        }
        
        if (this.#events.length === 0) this.#events[0] = listener;
        else this.#events.push(listener);
    }
    
    static once (event, callback)
    {
        if (event == null || callback == null) throw new Error("Data needed for class method 'Data.once' is undefined");
        
        const listener = {
            event : event,
            callback : callback,
            recallable : false,
            called : false
        };
        
        for (let iA = 0; iA < this.#events.length; iA++)
        {
            const equalEvent = listener.event === this.#events[iA].event;
            const equalMethod = this.#compareMethod(listener.callback, this.#events[iA].callback);
            const equalRecall = listener.recallable === this.#events[iA].recallable;
            
            if (equalEvent && equalMethod && equalRecall)
            {
                let newEvents = [];
                
                for (let iB = 0; iB < this.#events.length; iB++)
                {
                    if (iB === iA) continue;
                    
                    if (newEvents.length === 0) newEvents[0] = this.#events[iB];
                    else newEvents.push(this.#events[iB]);
                }
                
                this.#events = newEvents;
                
                return;
            }
        }
        
        if (this.#events.length === 0) this.#events[0] = listener;
        else this.#events.push(listener);
    }
    
    static async #callEvent (eventName)
    {
        this.#event = eventName;
        
        const event = this.#event;
        
        let mustRemove = null;
        
        for (let iA = 0; iA < this.#events.length; iA++)
        {
            const listener = this.#events[iA];
            const callable = listener.recallable || !listener.called;
            
            if (listener.event !== event) continue;
            
            if (!callable)
            {
                let newEvents = [];
                
                for (let iB = 0; iB < this.#events.length; iB++)
                {
                    if (iB === iA) continue;
                    
                    if (newEvents.length === 0) newEvents[0] = this.#events[iB];
                    else newEvents.push(this.#events[iB]);
                }
                
                this.#events = newEvents;
                
                continue;
            }
            
            await listener.callback();
            
            listener.called = true;
        }
        
        this.#event = null;
    }
    
    static async init ()
    {
        data.html.body = document.body;
        data.html.main = document.querySelector("main");
        data.html.content = document.querySelector("#mainContent");
        data.html.footer = document.querySelector("footer");
        
        const dataRequest = await fetch("/data/data.json");
        
        const newData = await dataRequest.json();
        
        data.samestyleoriginsites = newData.samestyleoriginsites;
        
        data.openedfromssos = cookieJar.getCookie("openedfromssos") === "true";
        
        cookieJar.removeCookie("openedfromssos");
        
        await data.delay(5);
        
        await this.#callEvent("WhileDataLoading");
        
        await this.#callEvent("OnDataLoad");
    }
    
    static async image (src)
    {
        const img = await fetch(src);
        const blob = await img.blob();
        
        return await URL.createObjectURL(blob);
    }
}

class Loop
{
    static #loaded = false;
    static #calls = [];
    
    static deltaTime = 0;
    static time = 0;
    
    static #requestUpdate ()
    {
        requestAnimationFrame(this.#update.bind(this));
    }
    
    static #update ()
    {
        let dTime = (performance.now() / 1000) - this.time;
        
        if (dTime > 0.3333333) dTime = 0.3333333;
        
        this.deltaTime = dTime;
        this.time += this.deltaTime;
        
        const currentCalls = this.#calls;
        
        for (let i = 0; i < currentCalls.length; i++) currentCalls[i]();
        
        this.#requestUpdate();
    }
    
    static init ()
    {
        if (this.#loaded) return;
        
        this.#loaded = true;
        
        this.#requestUpdate();
    }
    
    static append (callback)
    {
        if (this.#calls.length === 0) this.#calls[0] = callback;
        else this.#calls.push(callback);
    }
}

class screenTrans
{
    static #loaded = false;
    static fadeTime = 1;
    
    static async Set ()
    {
        if (this.#loaded) return;
        
        data.html.body.style.opacity = "1.0";
        data.html.footer.style.transform = "none";
        
        if (!data.openedfromssos)
        {
            data.html.body.style.transition = `opacity ${this.fadeTime}s`;
            
            data.html.footer.style.transition = `transform ${this.fadeTime}s`;
        }
        
        data.html.content.style.opacity = "1.0";
        data.html.content.style.transition = `opacity ${this.fadeTime}s`;
        
        await data.delay(1250 * this.fadeTime);
        
        data.html.content.setAttribute("data-scrollable", "true");
        
        data.html.body.style.pointerEvents = "all";
        
        data.html.body.style.transition = "none";
        data.html.footer.style.transition = "none";
        
        this.#loaded = true;
        
        Loop.append(() => { this.ScanAnchors(); });
    }
    
    static ScanAnchors ()
    {
        const pageAnc = document.querySelectorAll("a:not([target='_blank'])");
        
        for (let iA = 0; iA < pageAnc.length; iA++)
        {
            let valid = true;
            
            for (let iB = 0; iB < pageAnc[iA].href.length; iB++) if (pageAnc[iA].href[iB] === "#") valid = false;
            
            if (!valid) return;
            
            pageAnc[iA].onclick = async e => {
                e.preventDefault();
                
                const target = pageAnc[iA].href;
                
                const request = await fetch(target);
                
                if (request.status !== 200 && request.status !== 404)
                {
                    data.html.body.style.animation = "none";
                    
                    data.html.body.style.animation = "shake 0.125s";
                    
                    await data.delay(125);
                    
                    data.html.body.style.animation = "none";
                    
                    return;
                }
                
                data.html.content.setAttribute("data-scrollable", "false");
                
                data.html.body.style.pointerEvents = "none";
                
                if (data.isSsos(target))
                {
                    cookieJar.setCookie("openedfromssos", true);
                    
                    data.html.content.style.opacity = "0.0";
                    data.html.content.style.transition = `opacity ${0.5 * this.fadeTime}s`;
                }
                else
                {
                    data.html.body.style.opacity = "0.0";
                    data.html.body.style.transition = `opacity ${0.5 * this.fadeTime}s`;
                    
                    data.html.footer.style.transform = "translateY(100%)";
                    data.html.footer.style.transition = `transform ${0.5 * this.fadeTime}s`;
                }
                
                await data.delay(500 * this.fadeTime);
                
                window.location.href = target;
            };
        }
    }
}

class ScrollBar
{
    static #loaded = false;
    static #scrollBar = null;
    static #barUp = null;
    static #barDown = null;
    static #enabled = false;
    
    static Update ()
    {
        if (!this.#enabled) return;
        
        const scrollPos = data.html.content.scrollTop / (data.html.content.scrollHeight - data.html.content.clientHeight);
        
        if (isNaN(scrollPos))
        {
            this.#barUp.setAttribute("data-enabled", "false");
            this.#barDown.setAttribute("data-enabled", "false");
            
            return;
        }
        
        if (scrollPos <= 0)
        {
            this.#barUp.setAttribute("data-enabled", "false");
            this.#barDown.setAttribute("data-enabled", "true");
        }
        else if (scrollPos >= 1)
        {
            this.#barUp.setAttribute("data-enabled", "true");
            this.#barDown.setAttribute("data-enabled", "false");
        }
        else
        {
            this.#barUp.setAttribute("data-enabled", "true");
            this.#barDown.setAttribute("data-enabled", "true");
        }
    }
    
    static Toggle (state)
    {
        if (this.#enabled === state) return;
        
        this.#enabled = state;
        
        if (!state)
        {
            this.#barUp.setAttribute("data-enabled", "false");
            this.#barDown.setAttribute("data-enabled", "false");
        }
    }
    
    static async Set ()
    {
        if (this.#loaded) return;
        
        this.#scrollBar = data.html.main.querySelector(".scrollBar");
        
        this.#barUp = document.createElement("div");
        this.#barDown = document.createElement("div");
        
        const uImgWrap = document.createElement("div");
        const uImg = document.createElement("img");
        
        const dImgWrap = document.createElement("div");
        const dImg = document.createElement("img");
        
        this.#barUp.classList.add("barUp");
        this.#barDown.classList.add("barDown");
        
        uImg.classList.add("unselectable");
        dImg.classList.add("unselectable");
        
        this.#barUp.setAttribute("data-enabled", "false");
        this.#barDown.setAttribute("data-enabled", "false");
        
        const img = await Data.image("/img/spr_ui12-12.png");
        
        uImg.src = img;
        dImg.src = img;
        
        uImgWrap.append(uImg);
        dImgWrap.append(dImg);
        
        this.#barUp.append(uImgWrap);
        this.#barDown.append(dImgWrap);
        
        this.#scrollBar.append(this.#barUp, this.#barDown);
        
        this.#loaded = true;
        
        Loop.append(() => { this.Update(); });
    }
}


Data.once("OnDataLoad", async () => {
    ScrollBar.Set();
    
    await screenTrans.Set();
    
    ScrollBar.Toggle(true);
});


/*
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
    
    this.barUp.ontouchstart = () => { this.MoveScroll(-10); };
    this.barDown.ontouchstart = () => { this.MoveScroll(10); }
    
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
//luma

*/