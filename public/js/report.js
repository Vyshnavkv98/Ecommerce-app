const rowClass = document.querySelectorAll('.rowClass')
const rowClassParent = document.querySelector('.rowClassParent')

async function getorders() {

    let fromDate = $('input[name="fromdate"]').val();
    let toDate = $('input[name="todate"]').val();
    const rows = document.getElementById('rows')

    const response = await fetch('/admin/getOrders', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fromDate: fromDate,
            toDate: toDate
        }),

    });
    rowClass.forEach(row => {
        row.innerHTML = ''
    })
    const data = await response.json()
    const orderdata = data.orderdata


    orderdata.forEach((item) => {
        item.items.forEach((element) => {
            rowClassParent.innerHTML += 
                ` <tr>

                    <td><img class="img-fluid" style="max-width:4.5em" src="/images/${element.product.image[0]}" alt="img"></td>
                    <td>${element.product.name} </td>
                    <td>${element._id} </td>
                  
                    <td>${element.quantity} </td>
                    <td>${element.product.price}</td>
                    <td style="max-width: 200px">${item.orderstatus} </td>
                  
                    <td>${item.paymentmode} </td>
                    <td>${item.orderdate}</td>
                    <td style="font-weight: 700;">₹ ${item.totalbill} </td>
  
                </tr>`
        });
    })
}

async function getpdf(){
    window.print()
}