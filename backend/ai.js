const express = require('express');
const router = express.Router();

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ reply: "Please provide a message." });
  }

  const lowercaseMsg = message.toLowerCase();
  let reply = "I'm your AgriLease AI Assistant. I can help you find land, list land, or provide farming estimates. How can I help you today?";

  // If an image is uploaded, simulate a vision-based soil analysis
  if (req.body.image) {
    reply = "I've analyzed the image of your land. Based on the visual texture and color, this appears to be **Red Laterite Soil** mixed with loamy characteristics, typical in parts of Maharashtra like Ratnagiri or Western Ghats margins.\n\n🌱 **Suggested Crops:** Groundnuts, Cashews, Sugarcane, or Millets.\n💧 **Water Retention:** Moderate to low. Drip irrigation is recommended.\n\nWould you like me to help you create a listing for this land with these details?";
  } 
  // Simple mock intelligence layer for text
  else if (lowercaseMsg.includes('list land') || lowercaseMsg.includes('sell')) {
    reply = "To list your land, head over to the 'List Land' section on your Dashboard. You'll need your 7/12 extract document and basic details like acreage and expected lease price.";
  } else if (lowercaseMsg.includes('find land') || lowercaseMsg.includes('lease') || lowercaseMsg.includes('rent')) {
    reply = "You can browse verified lands in the 'Discover' tab. Use the filters to narrow down by price, location, or area based on your farming needs.";
  } else if (lowercaseMsg.includes('price') || lowercaseMsg.includes('cost') || lowercaseMsg.includes('how much')) {
    reply = "Lease prices vary by region. For example, land in Pune averages ₹15,000 to ₹30,000 per acre/year depending on water availability and soil quality. Are you looking to list or lease?";
  } else if (lowercaseMsg.includes('farming') || lowercaseMsg.includes('crop') || lowercaseMsg.includes('soil')) {
    reply = "For Maharashtra regions like Nashik and Pune, sugarcane, onions, and grapes are highly profitable. Ensure you check the soil test reports before finalizing a lease!";
  }

  // Simulate AI delay
  setTimeout(() => {
    res.json({ reply });
  }, 1000);
});

module.exports = router;
