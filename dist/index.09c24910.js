document.addEventListener("DOMContentLoaded", ()=>{
    const foodContainer = document.getElementById("food-container");
    const cartCount = document.getElementById("cart-count");
    const totalPriceElement = document.getElementById("total-price");
    const tabs = document.querySelectorAll(".tab");
    let cart = {};
    let totalItems = 0;
    let totalPrice = 0.0;
    tabs.forEach((tab)=>{
        tab.addEventListener("click", ()=>{
            const category = tab.getAttribute("data-category");
            fetchFoods(category);
        });
    });
    function fetchFoods(category) {
        fetch("http://localhost:3131/foods").then((response)=>response.json()).then((data)=>{
            const filteredFoods = data.filter((food)=>food.category === category);
            displayFoods(filteredFoods);
        });
    }
    function displayFoods(foods) {
        foodContainer.innerHTML = "";
        foods.forEach((food)=>{
            const foodCard = document.createElement("div");
            foodCard.classList.add("food-card");
            const cartCountForFood = cart[food.id] ? cart[food.id].count : 0;
            foodCard.innerHTML = `
        <img src="${food.image}" alt="${food.name}">
        <h3>${food.name}</h3>
        <p class="price">$${food.price.toFixed(2)}</p>
        <p class="ingredients">${food.ingredients.join(", ")}</p>
        <div class="cart-buttons">
          <button class="minus ${cartCountForFood === 0 ? "hidden" : ""}" data-id="${food.id}">-</button>
          <span class="quantity" data-id="${food.id}">${cartCountForFood}</span>
          <button class="plus" data-id="${food.id}">+</button>
        </div>
        <div class="cart-indicator ${cartCountForFood === 0 ? "hidden" : ""}" data-id="${food.id}">${cartCountForFood}</div>
      `;
            foodContainer.appendChild(foodCard);
        });
        const plusButtons = document.querySelectorAll(".plus");
        const minusButtons = document.querySelectorAll(".minus");
        plusButtons.forEach((button)=>{
            button.addEventListener("click", ()=>{
                const id = button.getAttribute("data-id");
                const food = foods.find((item)=>item.id == id);
                if (!cart[id]) cart[id] = {
                    count: 0,
                    price: food.price
                };
                cart[id].count++;
                totalItems++;
                totalPrice += food.price;
                updateCart(id);
            });
        });
        minusButtons.forEach((button)=>{
            button.addEventListener("click", ()=>{
                const id = button.getAttribute("data-id");
                const food = foods.find((item)=>item.id == id);
                if (cart[id] && cart[id].count > 0) {
                    cart[id].count--;
                    totalItems--;
                    totalPrice -= food.price;
                    updateCart(id);
                }
            });
        });
    }
    function updateCart(id) {
        const quantityElement = document.querySelector(`.quantity[data-id="${id}"]`);
        const minusButton = document.querySelector(`.minus[data-id="${id}"]`);
        const indicator = document.querySelector(`.cart-indicator[data-id="${id}"]`);
        quantityElement.textContent = cart[id].count;
        indicator.textContent = cart[id].count;
        cartCount.textContent = totalItems.toString();
        totalPriceElement.textContent = totalPrice.toFixed(2);
        if (cart[id].count > 0) {
            minusButton.classList.remove("hidden");
            indicator.classList.remove("hidden");
        } else {
            minusButton.classList.add("hidden");
            indicator.classList.add("hidden");
        }
    }
    // Initial load
    fetchFoods("Pizzas");
});

//# sourceMappingURL=index.09c24910.js.map
