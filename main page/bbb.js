let headerList = document.querySelector(".header-list");
let foodList = document.querySelector(".food-list");
let wrRight = document.querySelector(".wrapper-right");
let orderList = document.querySelector(".order-list");
let priceResult = document.querySelector(".price-result");
let select = document.querySelector(".select");
let serachInput = document.querySelector(".header-inp");
let count = 1;
let result = [];
async function menu() {
  let data = await fetch("http://localhost:5000/category");
  let parsedata = await data.json();

  console.log(parsedata);

  for (let i of parsedata) {
    let li = document.createElement("li");
    li.setAttribute("class", "header-item");
    li.textContent = i.name;
    headerList.append(li);

    li.addEventListener("click", () => {
      console.log(i.id);
      count = i.id;
      getFood(count);
    });
  }
}
menu();
async function getFood(id = 1) {
  foodList.innerHTML = null;

  let data = await fetch("http://localhost:5000/food/" + id);
  let parsedata = await data.json();

  console.log(parsedata);
  renderFood(parsedata);
  return parsedata;
}
getFood();
function renderFood(dataItem) {
  foodList.innerHTML = null;

  for (let i of dataItem) {
    let li = document.createElement("li");
    li.setAttribute("class", "food-item");

    li.innerHTML = `
        
        <img class="food-img" width="132" height="132"
        src="http://localhost:5000/${i.images}">
        <div class="food-box">
          <h3 class="food-title">${i.name}</h3>
          <p class="price">${i.price}</p>
          <span class="food-desk">${i.bowls} bowls avialble</span>
        </div>
        
        `;

    li.addEventListener("click", () => {
      wrRight.classList.add("active");

      let find = result.findIndex((item) => item.id == i.id);

      if (find >= 0) {
        result[find].count += 1;
      } else {
        result.push({ ...i, count: 1 });
      }

      orderRender(result);

      priceResult.textContent = result.reduce(
        (a, b) => a + b.price * b.count,
        0
      );
    });

    foodList.append(li);
  }
}
function orderRender() {
  orderList.innerHTML = null;
  for (let i of result) {
    let li = document.createElement("li");
    let div = document.createElement("div");
    let p = document.createElement("p");
    let btn = document.createElement("btn");

    div.setAttribute("class", "order-right");
    p.setAttribute("class", "order-total-price");
    btn.setAttribute("class", "order-remove");
    li.setAttribute("class", "order-item d-flex jst");

    p.textContent = `${(i.price * i.count).toFixed()}`;
    btn.textContent = "X";

    li.innerHTML = `
    
    <div class="order-left">
       <div class="order-wrapper jst row">
         <div class="order-item-top row">
            <img width="30px" height="30px" src="http://localhost:5000/${i.images}
            " class="order-item-img" alt="">
            <div class="order-desk">
                <h3 class="order-name">${i.name.slice(0, 25)}</h3>
                <p class="order-price">${i.price}</p>
            </div>
         </div>
         <span class="order-count">${i.count}</span>
       </div>
       <input type="text" class="order-inp" placeholder="Writing placeholder.">
    </div>
    
    
    `;

    btn.addEventListener("click", () => {
      let index = result.findIndex((item) => item.id == i.id);
      if (result[index].count == 1) {
        li.remove();

        result = result.filter((item) => item.id != i.id);
      } else {
        result[index].count -= 1;
      }
      orderRender();

      priceResult.textContent = result.reduce(
        (a, b) => a + b.price * b.count,
        0
      );

      if (!result.length) {
        wrRight.classList.remove("active");
      }
    });

    div.append(p, btn);
    li.append(div);
    orderList.append(li);
  }
  // wrRight.classList.add('wrapper-right-active')
}
getFood();

select.addEventListener("change", () => {
  getFood(count).then((item) => {
    if (select.value == "higher") {
      let highersort = item.sort((a, b) => b.price - a.price);
      foodList.innerHTML = null;
      renderFood(highersort);
    } else if (select.value == "lower") {
      let lowersort = item.sort((a, b) => a.price - b.price);
      foodList.innerHTML = null;
      renderFood(lowersort);
    } else if (select.value == "default") {
      renderFood(item);
    }
  });
});

function searchFood() {}

serachInput.addEventListener("input", () => {
  getFood(count).then((item) => {
    let filteredfood = item.filter((e) =>
      e.name.toLowerCase().includes(serachInput.value.toLowerCase())
    );

    renderFood(filteredfood);
  });
});
