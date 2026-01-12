import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data (optional - comment out if you want to keep existing data)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.oTP.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash("Admin123!", 10);
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@shophub.com",
      password: hashedPassword,
      emailVerified: new Date(),
      role: "ADMIN",
    },
  });
  console.log("✅ Created admin user (admin@shophub.com / Admin123!)");

  // Create regular user
  const regularUser = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "user@shophub.com",
      password: hashedPassword,
      emailVerified: new Date(),
      role: "USER",
    },
  });
  console.log("✅ Created regular user (user@shophub.com / Admin123!)");

  // Create sample products
  const products = [
    {
      name: "Wireless Bluetooth Headphones",
      description:
        "Premium noise-cancelling headphones with 30-hour battery life. Experience crystal-clear audio with deep bass and comfortable over-ear design. Perfect for music lovers and professionals.",
      price: 129.99,
      stock: 50,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    },
    {
      name: "Smart Watch Series 7",
      description:
        "Advanced fitness tracking, heart rate monitor, GPS, and water-resistant up to 50m. Stay connected with notifications, calls, and apps right on your wrist.",
      price: 399.99,
      stock: 30,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    },
    {
      name: "4K Ultra HD Camera",
      description:
        "Professional-grade mirrorless camera with 24MP sensor, 4K video recording, and fast autofocus. Includes 18-55mm kit lens. Perfect for photography enthusiasts and content creators.",
      price: 1299.99,
      stock: 15,
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
    },
    {
      name: "Laptop Stand (Aluminum)",
      description:
        "Ergonomic adjustable laptop stand made from premium aluminum. Improves posture and reduces neck strain. Compatible with all laptop sizes up to 17 inches.",
      price: 49.99,
      stock: 100,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    },
    {
      name: "Mechanical Gaming Keyboard",
      description:
        "RGB backlit mechanical keyboard with custom switches, programmable keys, and durable construction. N-key rollover and anti-ghosting for competitive gaming.",
      price: 149.99,
      stock: 45,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    },
    {
      name: "Wireless Charging Pad",
      description:
        "Fast 15W wireless charging for Qi-enabled devices. Sleek design with LED indicator and non-slip surface. Includes USB-C cable and wall adapter.",
      price: 29.99,
      stock: 200,
      image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80",
    },
    {
      name: "USB-C Hub (7-in-1)",
      description:
        "Expand your laptop connectivity with HDMI 4K, USB 3.0 ports, SD/TF card readers, and USB-C power delivery. Compact and portable aluminum design.",
      price: 39.99,
      stock: 75,
      image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&q=80",
    },
    {
      name: "Portable Bluetooth Speaker",
      description:
        "360° sound with deep bass, 12-hour battery life, and IPX7 waterproof rating. Perfect for outdoor adventures, pool parties, and travel.",
      price: 79.99,
      stock: 60,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
    },
    {
      name: "Ergonomic Mouse (Wireless)",
      description:
        "Vertical ergonomic design reduces wrist strain and improves comfort during long work sessions. Adjustable DPI, silent clicks, and rechargeable battery.",
      price: 59.99,
      stock: 80,
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80",
    },
    {
      name: "LED Desk Lamp with USB Port",
      description:
        "Modern LED desk lamp with 5 brightness levels and 3 color modes. Built-in USB charging port and touch controls. Energy-efficient and eye-friendly.",
      price: 34.99,
      stock: 120,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    },
    {
      name: "Webcam 1080p HD",
      description:
        "Full HD 1080p video calls with auto light correction and noise-reducing microphone. 90° wide-angle lens, plug-and-play USB connection. Ideal for remote work and streaming.",
      price: 69.99,
      stock: 55,
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
    },
    {
      name: "Laptop Backpack (Water-Resistant)",
      description:
        "Durable water-resistant backpack with padded laptop compartment (fits up to 15.6\"), multiple pockets, USB charging port, and anti-theft design.",
      price: 54.99,
      stock: 90,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`✅ Created ${products.length} products`);

  // Create a sample cart for the regular user
  const cart = await prisma.cart.create({
    data: {
      userId: regularUser.id,
      items: {
        create: [
          {
            productId: (await prisma.product.findFirst({ where: { name: "Wireless Bluetooth Headphones" } }))!.id,
            quantity: 1,
          },
          {
            productId: (await prisma.product.findFirst({ where: { name: "Wireless Charging Pad" } }))!.id,
            quantity: 2,
          },
        ],
      },
    },
  });
  console.log("✅ Created sample cart for regular user");

  // Create a sample order
  const orderProducts = await prisma.product.findMany({ take: 3 });
  const order = await prisma.order.create({
    data: {
      userId: regularUser.id,
      total: orderProducts.reduce((sum, p) => sum + p.price, 0),
      status: "DELIVERED",
      items: {
        create: orderProducts.map((product) => ({
          productId: product.id,
          quantity: 1,
          price: product.price,
        })),
      },
    },
  });
  console.log("✅ Created sample order");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📝 Login credentials:");
  console.log("   Admin: admin@shophub.com / Admin123!");
  console.log("   User:  user@shophub.com / Admin123!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
