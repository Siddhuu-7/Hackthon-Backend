function calculateTotalAmount(data) {
  if (!data) return 0;
  let total = 0;

  const leadPrice = Number(data.teamLead?.price);
  if (!isNaN(leadPrice)) {
    total += leadPrice;
  }

  if (Array.isArray(data.teamMembers)) {
    data.teamMembers.forEach(member => {
      const price = Number(member?.price);
      if (!isNaN(price)) {
        total += price;
      }
    });
  }

  return total;
}
module.exports={calculateTotalAmount}