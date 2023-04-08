async function addToCart(id, index) {
  if (!id) {
    console.log('Error: invalid data');
    return;
  }

  try {
    const response = await fetch("/wishlist/addtocart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: id
      })
    });

    const data = await response.json();
    console.log(data);

    const wishlistItem = document.querySelector(`#wishlist-item-${index}`);
    console.log(wishlistItem, '12234233434354')
    if (wishlistItem) {
      wishlistItem.remove();
    }

    Swal.fire({
      toast: true,
      icon: 'success',
      title: 'Added to cart!',
      showConfirmButton: false,
      timer: 2000,
    });

  } catch (error) {
    console.log(error);
    Swal.fire({
      toast: true,
      icon: 'error',
      title: 'Failed to add item to cart',
      showConfirmButton: false,
      timer: 2000,
    });
  }
}


const walletbalance = document.getElementById('wallet').value
console.log(walletbalance)
const check = document.querySelector('#checkbox')

check.addEventListener('change', async () => {
    if (check.checked) {
        const response = await fetch('/applywallet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                walletbalance: walletbalance
            })
        })
        const data = await response.json()

        document.getElementById('balance').innerHTML = `<input id="checkbox" class="mx-2" type="checkbox">Wallet Amount <span id="wallet">Rs. 000</span>`
    }
})
