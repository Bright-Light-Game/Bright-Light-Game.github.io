Data.once("WhileDataLoading", () => {
    FAQ.init();
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
            const question = document.createElement("strong");
            const answer = document.createElement("blockquote");
            
            question.classList.add("faq-question");
            answer.classList.add("faq-answer");
            
            question.append(data[i].question);
            
            const parseAnswer = marked.parse(data[i].answer, {
                headerIds : false,
                mangle : false
            });
            
            answer.insertAdjacentHTML("beforeend", parsedAnswer);
            
            content.append(question, answer);
        }
        
        this.#loaded = true;
    }
}