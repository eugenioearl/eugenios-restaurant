import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  const adminPassword = await bcrypt.hash("johndoe123", 10);
  await prisma.user.upsert({
    where: { email: "john@doe.com" },
    update: { role: "admin" },
    create: {
      email: "john@doe.com",
      name: "Admin",
      password: adminPassword,
      role: "admin",
    },
  });

  // Seed additional admin
  const adminPassword2 = await bcrypt.hash("eugenio2026", 10);
  await prisma.user.upsert({
    where: { email: "admin@eugenios.com" },
    update: { role: "admin" },
    create: {
      email: "admin@eugenios.com",
      name: "Eugenio",
      password: adminPassword2,
      role: "admin",
    },
  });

  // Seed categories
  const categories = [
    { name: "Main Dishes", description: "Piling paboritong ulam na lutong Pilipino", sortOrder: 1 },
    { name: "Vegetables", description: "Masustansyang gulay na pampabata", sortOrder: 2 },
    { name: "Silog Meals", description: "Sikat na almusal na may sinangag at itlog", sortOrder: 3 },
    { name: "Snacks & Merienda", description: "Masarap na meryenda para sa buong araw", sortOrder: 4 },
    { name: "Rice & Extras", description: "Kanin at mga dagdag na pagkain", sortOrder: 5 },
    { name: "Drinks", description: "Mga inuming pampalakas at pampagana", sortOrder: 6 },
    { name: "Desserts", description: "Matamis na pangwakas ng inyong kainan", sortOrder: 7 },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: { description: cat.description, sortOrder: cat.sortOrder },
      create: cat,
    });
    categoryMap[cat.name] = created.id;
  }

  // Seed menu items
  const menuItems = [
    // Main Dishes
    { name: "Chicken Adobo", description: "Tender chicken braised in vinegar, soy sauce, garlic, and bay leaves — a Filipino classic", price: 120, imageUrl: "/menu/chicken_adobo.jpg", categoryName: "Main Dishes" },
    { name: "Pork Sinigang", description: "Hearty pork ribs in a sour tamarind broth with fresh vegetables", price: 135, imageUrl: "/menu/pork_sinigang.jpg", categoryName: "Main Dishes" },
    { name: "Kare-Kare", description: "Slow-cooked oxtail and vegetables in a rich peanut sauce, served with bagoong", price: 160, imageUrl: "/menu/kare_kare.jpg", categoryName: "Main Dishes" },
    { name: "Bicol Express", description: "Tender pork cooked in coconut milk with chili peppers and shrimp paste", price: 130, imageUrl: "/menu/bicol_express.jpg", categoryName: "Main Dishes" },
    { name: "Fried Chicken", description: "Crispy golden-fried chicken marinated in Filipino spices, served with gravy", price: 115, imageUrl: "/menu/fried_chicken.jpg", categoryName: "Main Dishes" },
    { name: "Inihaw na Baboy", description: "Grilled pork belly marinated in soy sauce, calamansi, and garlic", price: 140, imageUrl: "/menu/inihaw_na_baboy.jpg", categoryName: "Main Dishes" },

    // Vegetables
    { name: "Pinakbet", description: "Mixed vegetables sautéed with shrimp paste — ampalaya, kalabasa, talong, and more", price: 90, imageUrl: "/menu/pinakbet.jpg", categoryName: "Vegetables" },
    { name: "Chopsuey", description: "Stir-fried mixed vegetables with chicken or pork in a savory oyster sauce", price: 95, imageUrl: "/menu/chopsuey.jpg", categoryName: "Vegetables" },
    { name: "Ginisang Monggo", description: "Mung bean soup sautéed with garlic, onion, and pork or shrimp", price: 85, imageUrl: "/menu/ginisang_monggo.jpg", categoryName: "Vegetables" },
    { name: "Tortang Talong", description: "Grilled eggplant omelette pan-fried to golden perfection", price: 75, imageUrl: "/menu/tortang_talong.jpg", categoryName: "Vegetables" },

    // Silog Meals
    { name: "Tapsilog", description: "Beef tapa with garlic fried rice and sunny-side-up egg", price: 110, imageUrl: "/menu/tapsilog.jpg", categoryName: "Silog Meals" },
    { name: "Longsilog", description: "Sweet pork longganisa with garlic fried rice and egg", price: 105, imageUrl: "/menu/longsilog.jpg", categoryName: "Silog Meals" },
    { name: "Tocilog", description: "Sweet cured pork tocino with garlic fried rice and egg", price: 105, imageUrl: "/menu/tocilog.jpg", categoryName: "Silog Meals" },
    { name: "Bangsilog", description: "Crispy fried bangus (milkfish) with garlic fried rice and egg", price: 115, imageUrl: "/menu/bangsilog.jpg", categoryName: "Silog Meals" },
    { name: "Hotsilog", description: "Juicy hotdog with garlic fried rice and egg — a Filipino breakfast staple", price: 95, imageUrl: "/menu/hotsilog.jpg", categoryName: "Silog Meals" },

    // Snacks & Merienda
    { name: "Lumpia", description: "Crispy fried spring rolls filled with seasoned pork and vegetables", price: 60, imageUrl: "/menu/lumpia.jpg", categoryName: "Snacks & Merienda" },
    { name: "Pancit Bihon", description: "Stir-fried rice noodles with vegetables, chicken, and soy-calamansi sauce", price: 85, imageUrl: "/menu/pancit_bihon.jpg", categoryName: "Snacks & Merienda" },
    { name: "Turon", description: "Crispy banana and jackfruit spring roll coated in caramelized sugar", price: 45, imageUrl: "/menu/turon.jpg", categoryName: "Snacks & Merienda" },
    { name: "Fish Balls & Kikiam", description: "Street-style fish balls and kikiam served with sweet or spicy sauce", price: 50, imageUrl: "/menu/fishballs_kikiam.jpg", categoryName: "Snacks & Merienda" },

    // Rice & Extras
    { name: "Steamed Rice", description: "Freshly cooked plain white rice", price: 30, imageUrl: "/menu/steamed_rice.jpg", categoryName: "Rice & Extras" },
    { name: "Garlic Rice", description: "Fragrant sinangag fried with garlic and a pinch of salt", price: 40, imageUrl: "/menu/garlic_rice.jpg", categoryName: "Rice & Extras" },
    { name: "Extra Egg", description: "Fried or boiled egg — your choice", price: 20, imageUrl: "/menu/extra_egg.jpg", categoryName: "Rice & Extras" },

    // Drinks
    { name: "Iced Tea", description: "House-blend sweetened iced tea, refreshing and light", price: 40, imageUrl: "/menu/iced_tea.jpg", categoryName: "Drinks" },
    { name: "Softdrinks", description: "Canned or bottled soda — Coke, Sprite, or Royal", price: 35, imageUrl: "/menu/softdrinks.jpg", categoryName: "Drinks" },
    { name: "Brewed Coffee", description: "Hot brewed Filipino coffee, bold and aromatic", price: 45, imageUrl: "/menu/brewed_coffee.jpg", categoryName: "Drinks" },
    { name: "Calamansi Juice", description: "Fresh-squeezed calamansi juice, sweet and tangy", price: 45, imageUrl: "/menu/calamansi_juice.jpg", categoryName: "Drinks" },

    // Desserts
    { name: "Leche Flan", description: "Silky smooth caramel custard made with egg yolks and condensed milk", price: 65, imageUrl: "/menu/leche_flan.jpg", categoryName: "Desserts" },
    { name: "Halo-Halo", description: "Classic Filipino shaved ice dessert with mixed fruits, beans, leche flan, and ube ice cream", price: 85, imageUrl: "/menu/halo_halo.jpg", categoryName: "Desserts" },
  ];

  for (const item of menuItems) {
    const { categoryName, ...data } = item;
    await prisma.menuItem.upsert({
      where: { id: `seed-${data.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: { ...data, categoryId: categoryMap[categoryName] },
      create: {
        id: `seed-${data.name.toLowerCase().replace(/\s+/g, "-")}`,
        ...data,
        categoryId: categoryMap[categoryName],
      },
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
