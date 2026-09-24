const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('ShopNest@123', salt);
    
    const existingAdmin = await User.findOne({ email: 'admin@shopnest.local' });
    if (!existingAdmin) {
      await User.create({
        name: 'Pavan Thorat',
        email: 'admin@shopnest.local',
        password: hashedPassword,
        role: 'admin'
      });
    }

    const products = [
      {
        name: 'Pulse Pro Wireless Headphones',
        description: 'Immersive wireless audio with active noise cancellation and all-day comfort.',
        price: 8999,
        category: 'Audio',
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.8,
        numReviews: 32
      },
      {
        name: 'Orbit Smartwatch',
        description: 'A sleek fitness and notification companion with a bright all-day display.',
        price: 6499,
        category: 'Wearables',
        stock: 24,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.6,
        numReviews: 18
      },
      {
        name: 'Nova Mechanical Keyboard',
        description: 'Compact mechanical keyboard with tactile switches and warm backlighting.',
        price: 4299,
        category: 'Workspace',
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.7,
        numReviews: 27
      },
      {
        name: 'Arc USB-C Charging Hub',
        description: 'Seven-in-one USB-C hub for a cleaner and more productive desk setup.',
        price: 2499,
        category: 'Accessories',
        stock: 35,
        imageUrl: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.5,
        numReviews: 41
      },
      {
        name: 'Luma Desk Lamp',
        description: 'Minimal LED desk lamp with adjustable brightness for focused work sessions.',
        price: 3199,
        category: 'Workspace',
        stock: 16,
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.4,
        numReviews: 15
      },
      {
        name: 'Metro Everyday Backpack',
        description: 'Water-resistant backpack with a padded laptop sleeve and organized storage.',
        price: 3799,
        category: 'Lifestyle',
        stock: 28,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.6,
        numReviews: 22
      },
      {
        name: 'AeroFit Bluetooth Speaker',
        description: 'Portable speaker with punchy stereo sound, IPX7 water resistance, and 16-hour battery life.',
        price: 2999,
        category: 'Audio',
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.5,
        numReviews: 19
      },
      {
        name: 'Vertex 4K Webcam',
        description: 'Ultra-clear webcam with auto-focus, dual microphones, and a privacy shutter for remote work.',
        price: 5499,
        category: 'Workspace',
        stock: 14,
        imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.7,
        numReviews: 25
      },
      {
        name: 'Nimbus Ergonomic Mouse',
        description: 'Comfort-focused wireless mouse with silent clicks, adjustable DPI, and multi-device pairing.',
        price: 2199,
        category: 'Accessories',
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.4,
        numReviews: 36
      },
      {
        name: 'Halo Smart Light Bar',
        description: 'App-controlled ambient light bar with adjustable scenes, music sync, and warm-to-cool white tones.',
        price: 3499,
        category: 'Smart Home',
        stock: 21,
        imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.3,
        numReviews: 17
      },
      {
        name: 'Forge Gaming Controller',
        description: 'Responsive wireless controller with textured grips, programmable buttons, and USB-C charging.',
        price: 4699,
        category: 'Gaming',
        stock: 17,
        imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.8,
        numReviews: 29
      },
      {
        name: 'Summit Insulated Bottle',
        description: 'Leak-proof stainless-steel bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
        price: 1199,
        category: 'Lifestyle',
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.6,
        numReviews: 44
      }
    ];

    await Promise.all(
      products.map((product) =>
        Product.updateOne({ name: product.name }, { $set: product }, { upsert: true })
      )
    );
    
    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
