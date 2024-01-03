const axios = require("axios");
const cheerio = require("cheerio");
const cron = require('node-cron');
require('dotenv').config();

const URL = "https://www.onedayonly.co.za";
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
const notifiedDeals = [];
const freshHoldSaving = 60;

const scrapeDeals = async () => {
  try {
    // Fetching the HTML content of the page
    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);

    // Array to hold scraped data
    const deals = [];

    // Logic to extract deals
    $("section").each(async (i, element) => {
      const title = $(element).find("h2").text(); // Product title
      const url = $(element).find("a").attr("href"); // Image URL
      const discount = $(element).find(".savings-badge").text(); // Discount info
      const salePrice = $(element).find("h2.css-i84nsw").text(); // Original price
      const originalPrice = $(element).find("h2.css-1o5ix5z").text(); // Sale price

      if (discount.length)
        deals.push({
          title,
          imageUrl: url,
          discount: parseDiscountToPercentage(discount, originalPrice),
          originalPrice,
          salePrice,
        });
      else {
        const subDeal = await scrapePageDeals(url);
       // showDeal(subDeal);
        if (subDeal && subDeal.discount >= freshHoldSaving) {
          deals.push(subDeal);
        }
      }
    });

    for (let i = 0; i < deals.length; i++) {
      showDeal(deals[i]);
    }
  } catch (error) {
    console.error("Error scraping data: ", error);
  }
};

const showDeal = (deal) => {
  if (deal && deal.discount >= freshHoldSaving && deal.discount <= 100) {
    console.log("===============");
    console.log(deal);
    console.log("===============");
    const message = `Deal Alert! ${deal.title} - ${deal.discount}% off. Check it out at ${deal.url}`;
    sendDiscordNotification(message, deal.url);
  }
};

const scrapePageDeals = async (productUrl) => {
  const deals = [];
  const url = URL + productUrl;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    $("div").each((i, element) => {
      const title = $(element).find(".css-eo482w").text(); // Product title

      const discount = $(element).find("span.css-1jbv4ya").text(); // Discount info
      const salePrice = $(element).find("h2#product-price").text(); // Original price
      const originalPrice = $(element).find("div.css-cb4cdb").text(); // Sale price

      if (
        discount.length > 0 &&
        (discount.includes("%") || discount.includes("R"))
      ) {
        deals.push({
          discount: parseDiscountToPercentage(discount, originalPrice),
          url,
          title,
          originalPrice,
          salePrice,
        });
        return;
      }
    });
    showDeal(deals.find((d) => d.discount > 0));
    return deals.find((d) => d.discount > 0);
  } catch (error) {
    console.error("Error scraping data: ", error);
  }
};

const parseDiscountToPercentage = (discount, originalPrice) => {
  if (discount.includes("%")) {
    return discount.replace(/\D/g, "") * 1;
  } else if (discount.includes("R")) {
    const discountValue = discount.replace(/\D/g, "");
    const originalPriceValue = originalPrice.replace(/\D/g, "");
    const discountPercentage =
      originalPriceValue > 0 ? (discountValue / originalPriceValue) * 100 : 0;
    return discountPercentage;
  } else {
    return discount;
  }
};

const sendDiscordNotification = async (message, url) => {
    if (notifiedDeals.includes(url)) {
      console.log('Deal already notified');
      return;
    }
    try {
      await axios.post(discordWebhookUrl, { content: message });
      notifiedDeals.push(url);
      console.log('Discord notification sent');
    } catch (error) {
      console.error('Error sending Discord notification:', error);
    }
  };

// Schedule the task to run every day at 8:00 AM
cron.schedule('10 * * * *', () => {
    console.log('Running scrapeDeals');
    scrapeDeals();
  });
