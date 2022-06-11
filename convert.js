document.addEventListener("DOMContentLoaded", function () {
  var currentdate = new Date();
  var datetime =
    "Last Sync: " +
    currentdate.getDay() +
    "/" +
    currentdate.getMonth() +
    "/" +
    currentdate.getFullYear() +
    " at " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();

  var baseUrl = "https://open.er-api.com/v6/latest/USD";
  fetch(baseUrl)
    .then((response) => response.json())
    .then((data) => {
      const table = document.getElementById("currency-table");
      table.style.display = "table";
      console.log(data);
      document.getElementById(
        "last-update"
      ).innerHTML = `Last Update : ${data.time_last_update_utc} 
      <br>
      Next Update : ${data.time_next_update_utc}`;
      Object.entries(data.rates).forEach(([key, value]) => {
        table.innerHTML += `<tr><td>${key}</td><td>${value}</td></tr>`;
      });
    });

  document.querySelector("form").onsubmit = () => {
    const amount = document.querySelector("#amount").value;
    const fromCurrency = document.querySelector("#from").value.toUpperCase();
    const toCurrency = document.querySelector("#to").value.toUpperCase();
    const url = `https://open.er-api.com/v6/latest/${fromCurrency}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        try {
          const rate = data.rates[toCurrency];
          const total = (amount * rate).toFixed(2);
          if (total == "NaN") {
            throw error;
          } else {
            document.getElementById("error").style.display = "none";
            document.getElementById("result").style.display = "block";
            document.getElementById(
              "total"
            ).innerHTML = `${amount} ${fromCurrency} = ${total} ${toCurrency}`;
            document.querySelector(
              "#oneequel"
            ).innerHTML = `1 ${fromCurrency} = ${rate} ${toCurrency} (According to exchangerate-api.com)`;
          }
        } catch (error) {
          document.getElementById("error").style.display = "block";
          document.getElementById("error").innerHTML = "Invalid Input";
          document.getElementById("result").style.display = "none";
          console.error("error:Invalid Input");
          return;
        }
      });
    return false;
  };
});
