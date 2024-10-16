const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

const expenseList = document.querySelector("ul")
const expenseQuantity = document.querySelector("aside header p span")
const expenseTotal = document.querySelector("aside header h2")

amount.oninput = () => {
    let value = amount.value.replace(/\D/g, "")

    //transfoma em centavos
    value = Number(value) / 100

    amount.value = formatCurrencyBRL(value);
}

function formatCurrencyBRL(value) {
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    return value
}

form.onsubmit = (event) => {
    event.preventDefault()

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        create_at: new Date()
    }

    expenseAdd(newExpense)

}

function expenseAdd(newExpense) {
    try {
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")

        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

        const removeItem = document.createElement("img")
        removeItem.classList.add("remove-icon")
        removeItem.setAttribute("src", "img/remove.svg")
        removeItem.setAttribute("alt", "remover")

        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name


        expenseInfo.append(expenseName, expenseCategory)
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeItem)
        expenseList.appendChild(expenseItem)

        formClear()
        updateTotals()

    } catch (error) {
        alert("Não foi possível atualizar a lista de despesas")
        console.log(error)
    }
}

//atualiza os totais

function updateTotals() {
    try {
        const items = expenseList.children
        expenseQuantity.innerHTML = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

        let total = 0

        for (let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector(".expense-amount")

            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

            value = parseFloat(value)

            if (isNaN(value)) {
                return alert(
                    "Não foi possivel calcular o total"
                )
            }

            total += Number(value)

        }

        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        expenseTotal.innerHTML = ""
        expenseTotal.append(symbolBRL, total)

    } catch (error) {
        console.log(error)
        alert("Não foi possível atualizar os totais")
    }

}

expenseList.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-icon")) {
        const item = e.target.closest(".expense")

        item.remove()
    }

    updateTotals()
})

function formClear() {
    expense.value = ""
    category.value = ""
    amount.value = ""

    expense.focus()
}

