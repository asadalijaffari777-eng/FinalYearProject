const Manufacturer = require("../models/manufacturerSchema");
const Item = require("../models/itemSchema");

const CATEGORIES = ["caps", "upper-summer", "upper-winter", "lower", "t-shirt", "hoodies", "jackets", "jeans-pants", "trousers", "sports-shirt", "polo-shirt", "school-shirt", "socks", "underwear"];
const LOCATIONS = ["sialkot", "karachi", "lahore", "faisalabad"];
const TYPES = ["small", "medium", "large"];
const PRICES = ["low", "medium", "high"];

const CATEGORY_MAP = {
  shirt: ["t-shirt", "sports-shirt", "polo-shirt", "school-shirt"],
  trouser: ["trousers", "jeans-pants"],
  jean: ["jeans-pants"],
  pant: ["trousers", "jeans-pants"],
  trouser: ["trousers"],
  cap: ["caps"],
  hat: ["caps"],
  hoodie: ["hoodies"],
  jacket: ["jackets"],
  sock: ["socks"],
};

function findKeywords(text, list) {
  const lower = text.toLowerCase();
  return list.filter((word) => lower.includes(word));
}

function expandKeywords(text) {
  const lower = text.toLowerCase();
  const matched = [];
  for (const [partial, fullCategories] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(partial)) {
      fullCategories.forEach((c) => {
        if (!matched.includes(c)) matched.push(c);
      });
    }
  }
  return matched;
}

function isAskingAboutManufacturers(message) {
  const lower = message.toLowerCase();
  const keywords = ["manufacturer", "supplier", "producer", "maker", "factory", "vendor", "who make", "who produce", "find me", "recommend", "which company", "which manufacturer", "best manufacturer", "cheap manufacturer"];
  return keywords.some((k) => lower.includes(k));
}

function isAskingAboutProducts(message) {
  const lower = message.toLowerCase();
  const keywords = ["product", "item", "category", "what can i make", "what should i", "what do you have", "available"];
  return keywords.some((k) => lower.includes(k));
}

function isAskingAdvice(message) {
  const lower = message.toLowerCase();
  const keywords = ["advice", "suggest", "recommendation", "idea", "tip", "guide", "how to", "help me", "what should i", "start"];
  return keywords.some((k) => lower.includes(k));
}

async function buildContext(message, businessSelections) {
  let context = "";
  let sources = [];
  let manufacturersData = [];

  const categories = [...findKeywords(message, CATEGORIES), ...expandKeywords(message)];
  const locations = findKeywords(message, LOCATIONS);
  const types = findKeywords(message, TYPES);
  const prices = findKeywords(message, PRICES);
  const wantsAdvice = isAskingAdvice(message);

  let selectionsContext = "";
  if (businessSelections && businessSelections.length > 0) {
    selectionsContext += "The user has selected these products for their clothing business:\n";
    businessSelections.forEach((s) => {
      selectionsContext += `- ${s.name} (Category: ${s.category || "N/A"})\n`;
    });
    selectionsContext += "\n";
  }

  const wantsManufacturers = categories.length > 0 || locations.length > 0 || types.length > 0 || prices.length > 0 || isAskingAboutManufacturers(message);

  if (wantsManufacturers) {
    let filter = {};

    if (categories.length > 0) {
      filter.categories = { $in: categories };
    }
    if (locations.length > 0) {
      filter.location = { $regex: locations.join("|"), $options: "i" };
    }
    if (types.length > 0) {
      filter.type = { $in: types };
    }
    if (prices.length > 0) {
      filter.priceRange = { $in: prices };
    }

    if (!filter.categories && businessSelections && businessSelections.length > 0) {
      const selectedCategories = [...new Set(businessSelections.map((s) => s.category))];
      filter.categories = { $in: selectedCategories };
    }

    const manufacturers = await Manufacturer.find(filter).sort({ name: 1 }).limit(8);

    if (manufacturers.length > 0) {
      context += selectionsContext;
      context += "Here are manufacturers from our database:\n";
      manufacturers.forEach((m) => {
        context += `- ${m.name} | Location: ${m.location} | Type: ${m.type} | Categories: ${(m.categories || []).join(", ")} | MOQ: ${m.moq} | Price Range: ${m.priceRange} | Website: ${m.links?.website || "N/A"} | Instagram: ${m.links?.instagram || "N/A"} | Email: ${m.contact?.email || "N/A"} | Phone: ${m.contact?.phone || "N/A"}\n`;
      });
      context += "\n";

      sources = manufacturers.map((m) => m.name);
      manufacturersData = manufacturers.map((m) => ({
        name: m.name, location: m.location, type: m.type,
        categories: m.categories, moq: m.moq, priceRange: m.priceRange,
        image: m.image,
        website: m.links?.website || "", instagram: m.links?.instagram || "",
        email: m.contact?.email || "", phone: m.contact?.phone || "",
      }));
    } else {
      context += selectionsContext;
      if (locations.length > 0 && !categories.length) {
        context += `The user mentioned location: ${locations.join(", ")}. No manufacturers were found for that location alone. The user may want general business advice.\n`;
      } else {
        context += "No manufacturers were found matching the user's criteria in our database.\n";
      }
      context += "Our database has manufacturers in Pakistan (Sialkot, Karachi, Lahore, Faisalabad). If the user is asking for business advice or suggestions, provide helpful guidance based on their selected products.\n";
    }
  } else if (wantsAdvice) {
    context += selectionsContext;
    context += "The user is asking for business advice or suggestions. Provide helpful guidance about starting and running a clothing business.\n";
  }

  if (!wantsManufacturers && !wantsAdvice) {
    context += selectionsContext;
  }

  return { context, sources, manufacturers: manufacturersData, noMatch: false, skipAI: false };
}

module.exports = { buildContext };
