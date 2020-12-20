/** global variables **/
const quoteList = document.querySelector('#quote-list')
const quotesURL = 'http://localhost:3000/quotes'
const newQuoteForm = document.querySelector('#new-quote-form')

/** functions **/

const renderQuote = quoteObj => {
    const quoteCardLi = document.createElement('li')
    const quoteLikes = 0
    if (quoteLikes.length) {
        quoteLikes = quoteObj.likes.length 
    }
    quoteCardLi.classList.add('quote-card')
    quoteCardLi.dataset.id = quoteObj.id
    quoteCardLi.innerHTML = `
    <blockquote class="blockquote">
        <p class="mb-0">${quoteObj.quote}</p>
        <footer class="blockquote-footer">${quoteObj.author}</footer>
        <br>
        <button class='btn-success'>Likes: ${quoteLikes}<span>0</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>
    `
    quoteList.append(quoteCardLi)
}
/** GET request to json-server to populate page with quotes **/

fetch(`${quotesURL}?_embed=likes`)
    .then(response => response.json())
    .then(quotesArray => {
        quotesArray.forEach(quoteObj => {
            renderQuote(quoteObj)
        })
    })

/**  Submitting a new quote with POST fetch request **/
newQuoteForm.addEventListener('submit', event => {
    event.preventDefault()
    const newQuote = {}
    newQuote.quote = event.target.quote.value
    newQuote.author = event.target.author.value

    fetch(quotesURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuote)
    })
        .then(response => response.json())
        .then(newQuote => {
            renderQuote(newQuote)
        })

    newQuoteForm.reset()
})

quoteList.addEventListener('click', event => {
    if (event.target.className === "btn-danger") {
      const quoteLi = event.target.closest("li")
      const quoteId = quoteLi.dataset.id

      fetch(`${quotesURL}/${quoteId}`, {
        method: "DELETE",
      }).then((response) => {
        if (response.ok) {
          quoteLi.remove()
        }
      })
    } else if (event.target.className === "btn-success") {
      const quoteLi = event.target.closest("li")

      fetch("http://localhost:3000/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          quoteId: parseInt(quoteLi.dataset.id),
          createdAt: Date.now(),
        }),
      }).then((response) => {
        if (response.ok) {
          const likesSpan = quoteLi.querySelector("span")
          likesSpan.textContent = parseInt(likesSpan.textContent) + 1
        }
      })
    }
})



