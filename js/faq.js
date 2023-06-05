Data.once("WhileDataLoading", async () => {
    await FAQ.init();
});


class FAQ
{
    static #loaded = false;
    
    static async init ()
    {
        if (this.#loaded) return;
        
        const content = document.querySelector("#faq");
        
        const response = await fetch("/data/faq.json");
        const data = await response.json();
        
        for (let i = 0; i < data.length; i++)
        {
            if (data[i].question.length == null || data[i].answer.length == null) continue;
            
            const question = document.createElement("strong");
            const answer = document.createElement("blockquote");
            
            question.classList.add("faq-question");
            answer.classList.add("faq-answer");
            
            question.append(data[i].question);
            
            let parsedAnswer = data[i].answer;
            
            if (data[i].evaluated)
            {
                const evalCall = eval(parsedAnswer);
                
                parsedAnswer = await evalCall();
            }
            
            parsedAnswer = marked.parse(parsedAnswer, {
                headerIds : false,
                mangle : false
            });
            
            answer.insertAdjacentHTML("beforeend", parsedAnswer.trim());
            
            content.append(question, answer);
        }
        
        this.#loaded = true;
    }
}