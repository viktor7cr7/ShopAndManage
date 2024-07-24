function formatPrice(price) {
    let number = Math.round(parseFloat(price));
    
    let formattedPrice = number.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  
    if (number % 1 === 0) {
      formattedPrice = formattedPrice.split('.')[0];
    }
    
    return formattedPrice;
  }

  export default formatPrice