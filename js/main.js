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
        if (time === 0) return;
        
        return new Promise(resolve => Loop.append(resolve, {
            temporary : true,
            delay : time
        }));
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
        
        data.openedfromssos = cookieJar.getCookie("openedfromssos") === "true";
        
        cookieJar.removeCookie("openedfromssos");
        
        await this.#callEvent("WhileDataLoading");
        
        const dataRequest = await fetch("/data/data.json");
        
        const newData = await dataRequest.json();
        
        data.samestyleoriginsites = newData.samestyleoriginsites;
        
        await new Promise(resolve => setTimeout(resolve, 5));
        
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
    static #uTime = 0;
    static #uDeltaTime = 0;
    static #frameIndex = 0;
    static #time = 0;
    static #deltaTime = 0;
    
    static targetFrameRate = 60;
    static timeScale = 1;
    static maximumDeltaTime = 0.06666667;
    
    static get unscaledTime ()
    {
        return this.#uTime;
    }
    
    static get unscaledDeltaTime ()
    {
        return this.#uDeltaTime;
    }
    
    static get frameCount ()
    {
        return this.#frameIndex;
    }
    
    static get time ()
    {
        return this.#time;
    }
    
    static get deltaTime ()
    {
        return this.#deltaTime;
    }
    
    static #requestUpdate ()
    {
        requestAnimationFrame(this.#update.bind(this));
    }
    
    static #update ()
    {
        const slice = (1 / this.targetFrameRate) - 0.005;
        
        let accumulator = (performance.now() / 1000) - this.#uTime;
        
        while (accumulator >= slice)
        {
            this.#uDeltaTime = (performance.now() / 1000) - this.#uTime;
            this.#uTime += this.#uDeltaTime;
            
            let deltaT = this.#uDeltaTime;
            
            if (deltaT > this.maximumDeltaTime) deltaT = this.maximumDeltaTime;
            
            this.#deltaTime = deltaT * this.timeScale;
            this.#time += this.#deltaTime;
            
            this.#invoke();
            
            if (this.timeScale != 0) this.#frameIndex++;
            
            accumulator -= slice;
        }
        
        this.#requestUpdate();
    }
    
    static #invoke ()
    {
        const currentCalls = this.#calls;
        
        let newCalls = [];
        
        for (let i = 0; i < currentCalls.length; i++)
        {
            const currentCall = currentCalls[i];
            
            currentCall.time += this.#deltaTime;
            
            if (currentCall.time > (typeof currentCall.timeout === "function" ? currentCall.timeout() : currentCall.timeout))
            {
                currentCall.callback();
                
                if (currentCall.temp) continue;
                else currentCall.time = 0;
            }
            
            if (newCalls.length === 0) newCalls[0] = currentCall;
            else newCalls.push(currentCall);
        }
        
        this.#calls = newCalls;
    }
    
    static init ()
    {
        if (this.#loaded) return;
        
        this.#loaded = true;
        
        this.#requestUpdate();
    }
    
    static append (callback, data)
    {
        if (callback == null) throw new Error("Data needed for class method 'Loop.append' is undefined");
        
        const dat = data ?? { };
        
        const newCall = {
            callback : callback,
            temp : dat.temporary ?? false,
            timeout : dat.delay ?? 0,
            time : 0
        };
        
        if (this.#calls.length === 0) this.#calls[0] = newCall;
        else this.#calls.push(newCall);
    }
}

class screenTrans
{
    static #loaded = false;
    
    static fadeTime = 1;
    
    static Set ()
    {
        if (this.#loaded) return;
        
        data.html.body.style.opacity = "1";
        data.html.footer.style.transform = "none";
        
        if (!data.openedfromssos)
        {
            data.html.body.style.transition = `opacity ${this.fadeTime / Loop.timeScale}s`;
            data.html.footer.style.transition = `transform ${this.fadeTime / Loop.timeScale}s`;
        }
        
        Data.once("OnDataLoad", async () => {
            data.html.content.style.opacity = "1";
            data.html.content.style.transition = `opacity ${this.fadeTime / Loop.timeScale}s`;
            
            await data.delay(this.fadeTime);
            
            data.html.content.setAttribute("data-scrollable", "true");
            
            data.html.body.style.pointerEvents = "all";
            data.html.body.style.transition = "none";
            data.html.footer.style.transition = "none";
            
            ScrollBar.Toggle(true);
        });
        
        this.#loaded = true;
        
        Loop.append(() => { this.ScanAnchors(); });
    }
    
    static ScanAnchors ()
    {
        const pageAnc = document.querySelectorAll("a:not([target='_blank'])");
        
        for (let i = 0; i < pageAnc.length; i++)
        {
            let valid = true;
            
            if (pageAnc[i].href[0] === "#") return;
            
            pageAnc[i].onclick = async e => {
                e.preventDefault();
                
                const target = pageAnc[i].href;
                
                let invalidTarget = false;
                
                try
                {
                    const request = await fetch(target, {
                        mode : "no-cors"
                    });
                    
                    if (request.status > 200 && request.status !== 404) invalidTarget = true;
                }
                catch
                {
                    invalidTarget = true;
                }
                
                if (invalidTarget)
                {
                    data.html.body.style.animation = "none";
                    
                    data.html.body.style.animation = `shake ${0.125 / Loop.timeScale}s`;
                    
                    await data.delay(0.125);
                    
                    data.html.body.style.animation = "none";
                    
                    return;
                }
                
                data.html.content.setAttribute("data-scrollable", "false");
                
                data.html.body.style.pointerEvents = "none";
                
                if (data.isSsos(target))
                {
                    cookieJar.setCookie("openedfromssos", true);
                    
                    data.html.content.style.opacity = "0";
                    data.html.content.style.transition = `opacity ${0.5 * this.fadeTime / Loop.timeScale}s`;
                }
                else
                {
                    data.html.body.style.opacity = "0";
                    data.html.body.style.transition = `opacity ${0.5 * this.fadeTime / Loop.timeScale}s`;
                    
                    data.html.footer.style.transform = "translateY(100%)";
                    data.html.footer.style.transition = `transform ${0.5 * this.fadeTime / Loop.timeScale}s`;
                }
                
                await data.delay(0.5 * this.fadeTime);
                
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


Data.once("WhileDataLoading", () => {
    screenTrans.Set();
})

Data.once("OnDataLoad", () => {
    ScrollBar.Set();
});