console.log(1);
let val
let finalbills = null
let finalprice
let discountprice
let walletafterunchecked
let walletdiscount = document.getElementById('walletdis')
let check = document.getElementById('checkbox1')
let totalValueAfterWallet
let walletamount
let finalbill
let bill
let totalValue
let walletapplied = document.querySelector('#walletapplied')
let subtotalinput = document.querySelector('#subtotalinput')
let walletbalance = document.querySelector('#walletAmount').value

const submitcoupon = async () => {


    val = document.getElementsByName('coupon')[0].value
    console.log(val, 'couponvalue')

  

    const response = await fetch('/apply-coupon', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ val, bill })


    })
    const res = await response.json()
    finalbills = res.finalbill
    discountprice = res.discountprice
    console.log(discountprice,'discount price');
    let message = res.message
    let finaltotalAfterwallet = 0
    
    // finalprice = finalbills - discountprice
    console.log(finalbills,'finalprice');
    if(walletbalance>bill){
     walletafterunchecked=walletbalance-finalbills
    console.log(walletafterunchecked,'43');
    }else{
        if((finalbills>walletbalance)){
        walletafterunchecked=finalbills-walletbalance
        }else{
            walletafterunchecked=walletbalance-finalbills
            
            finaltotalAfterwallet=0
            finalbills=walletbalance-walletafterunchecked
            

        }
        console.log(walletafterunchecked,'43');
    }
    console.log(51);
    if (check.checked) {
        if (finalbills!==bill) {
            
            document.getElementById('totalbills').innerText = `${finaltotalAfterwallet}`
            walletdiscount.innerHTML = `<li style="color: red;">Wallet Applied <span id="discount" style="color: red;">- Rs. ${finalbills}</span></li>`
            document.getElementById('wallet').innerText = `Rs. ${walletafterunchecked}`
            
        } else if(finalbills==bill){
            console.log(61);
            finalbills=walletbalance
            finaltotalAfterwallet=bill-walletbalance
          
            totalValueAfterWallet=bill-walletbalance
            document.getElementById('totalbills').innerText = `${finaltotalAfterwallet}`
            walletdiscount.innerHTML = `<li style="color: red;">Wallet Applied <span id="discount" style="color: red;">- Rs. ${finalbills}</span></li>`
            document.getElementById('wallet').innerText = `Rs. ${0}`
            console.log(67);
            finalbill.innerHTML = `Rs. ${finaltotalAfterwallet}`;
            console.log(68);
    }else {
            
            document.getElementById('totalbills').innerText = `${finalbills}`
        }
        if (message) {
            document.getElementById('aaa').innerText = `${message}`
        }
        if (discountprice) {
            document.getElementById('discount').innerHTML = `<li style="color: red;">Coupon Discount<span id="discount" style="color: red;">-Rs. ${discountprice}</span></li>`
        }
    } else {
        document.getElementById('totalbills').innerText = `Rs. ${finalbills}`
        if (message) {
            document.getElementById('aaa').innerText = `${message}`
        }
        if (discountprice) {
            document.getElementById('discount').innerHTML = `<li style="color: red;">Coupon Discount<span id="discount" style="color: red;">Rs. ${discountprice}</span></li>`
        }
    }
}
 bill = document.getElementById('billamount').value


 finalbill = document.getElementById('totalbills')


check.addEventListener('change', () => {
    if (finalbills !== null) {
        console.log(79);
        if (finalbills < walletbalance) {
            totalValue = finalbills
            console.log(totalValue,82)
        } else {

            totalValue = walletbalance
            totalValueAfterWallet=bill
        }
    } else {
        const total = (document.getElementById("totalbills").textContent);
        totalValue = parseFloat(total.replace("Rs. ", ""));
        console.log(totalValue,'89');
    }
    if (check.checked) {
        if (walletbalance > totalValue) {
            appliedamount = walletbalance - totalValue
            bill.value = 0
            totalValueAfterWallet = 0
            
            finalbalance = walletamount - appliedamount
            subtotalinput.value = 0
        console.log(99);
        } else {
            console.log(101);
            finalafterwallet = finalbill - walletamount
            appliedamount = 0
            totalValueAfterWallet=bill-walletbalance
            totalValue=walletbalance
            
            subtotalinput.value = finalbill
             

        }
        walletdiscount.innerHTML = `<li style="color: red;">Wallet Applied <span id="discount" style="color: red;">- Rs. ${totalValue}</span></li>`
        finalbill.innerHTML = `Rs. ${totalValueAfterWallet}`;
        appliedamount.value = totalValue
        document.getElementById('wallet').innerText = `Rs. ${appliedamount}`
        console.log('113');
    } else {
        if (!val) {
            check.classList.remove('checked');
            walletdiscount.innerHTML = "";
            finalbill.innerHTML = `Rs. ${bill}`;
            subtotalinput.value = bill

            document.getElementById('wallet').innerText = `Rs. ${walletbalance}`
        } else {
            walletdiscount.innerHTML = "";
            finalbill.innerHTML = `Rs. ${finalbills}`;
            document.getElementById('wallet').innerText = `Rs. ${walletbalance}`
            subtotalinput.value = finalbills
        }
    }

    if(finalbills){
        setTimeout(()=>{})
    }
});


