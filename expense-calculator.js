class ExpenseCalculator extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.expenses = [];
		this.total = 0;

		this.shadowRoot.innerHTML = `
            <style>
                :host {
                    font-family: Roboto, sans-serif; 
                }

                .expanse-calculator {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                input {
                    height: 25px;
                    border-radius: 5px;
                    padding: 1rem;
                    outline: none;
                    border: 1px solid gray;

                }

                button {
                    display: flex,
                    height: 100%;
                    border-radius: 5px;
                    padding: 1rem;
                    text-align: center;
                    transition: 0.2s;
                    border: 1px solid gray;
                }

                button:hover {
                    cursor: pointer;
                    background-color: #2ADB41;
                }

                #expense-list {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center,
                    align-items: center;
                    margin: 20px;
                }
                
                .card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid gray;
                    border-radius: 5px;
                    padding: 1rem;
                    margin: 10px;
                    height: 200px;
                }

                .card > button {
                    width: 100px;
                    border-radius: 5px;
                }
                .card > button:hover {
                    background: crimson;
                }
            </style>
            <div class='expanse-calculator'>
                <h1>Калькулятор расходов</h1>
                <h2>Общая сумма расходов: <span id="total-expenses">0</span></h2>
                <form id="expense-form">
                    <input type="text" id="expense-name" placeholder="Расход" required>
                    <input type="number" id="expense-amount" placeholder="Сумма" required>
                    <button type="submit">Добавить</button>
                </form>
                <div id="expense-list"></div>
            </div>
        `;

		this.shadowRoot
			.getElementById("expense-form")
			.addEventListener("submit", this.addExpense.bind(this));
	}

	addExpense(event) {
		event.preventDefault();
		const nameInput = this.shadowRoot.getElementById("expense-name");
		const amountInput = this.shadowRoot.getElementById("expense-amount");
		const name = nameInput.value;
		const amount = +amountInput.value;

		if (name.trim() === "" || amount <= 0) {
			alert("Неправильно введено имя, или сумма меньше или равна 0");
			return;
		}

		this.expenses.push({ name, amount });
		this.total += amount;
		this.displayExpenses();
		this.updateTotal();
		nameInput.value = "";
		amountInput.value = "";
	}

	displayExpenses() {
		const expenseList = this.shadowRoot.getElementById("expense-list");
		expenseList.innerHTML = "";

		this.expenses.forEach((expense, index) => {
			const div = document.createElement("div");
			div.innerHTML = `
                <div class='card'>
                    <p>Название расхода: ${expense.name}</p>
                    <p>Потрачено: ${expense.amount} рублей</p>
                    <button data-index="${index}">Удалить</button>
                </div>
            `;
            
			expenseList.appendChild(div);
			div.querySelector("button").addEventListener(
				"click",
				this.deleteExpense.bind(this)
			);
		});
	}

	updateTotal() {
		const totalExpenses = this.shadowRoot.getElementById("total-expenses");
		totalExpenses.textContent = this.total;
	}

	deleteExpense(event) {
		const index = event.target.dataset.index;
		const deletedAmount = this.expenses[index].amount;
		this.expenses.splice(index, 1);
		this.total -= deletedAmount;
		this.displayExpenses();
		this.updateTotal();
	}
}

customElements.define("expense-calculator", ExpenseCalculator);
