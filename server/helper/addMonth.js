export default  function addMonths(dateString, monthsToAdd) {
    const date = new Date(dateString);
  
    // زوّد عدد الشهور
    date.setMonth(date.getMonth() + monthsToAdd);
  
    // رجّع التاريخ بشكل YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // شهور تبدأ من 0
    const day = String(date.getDate()).padStart(2, '0');
  
    return {year,month,day};
  }