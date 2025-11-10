import dotenv from 'dotenv'
dotenv.config()

import prisma from './configs/prismaClient.js'

// Small seeder for products. Safe by default: run without --exec to do a dry-run.
// Usage:
//   node server/seedProducts.js           # dry-run, prints summary
//   node server/seedProducts.js --exec    # actually inserts into DB
//   node server/seedProducts.js --exec --drop  # drop existing products first

const sampleProducts = [
  // Featured / first-look items (Vegetables)
  {
    name: 'Potato 500g',
    category: 'Vegetables',
    price: 25,
    offerPrice: 20,
    image: ['https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/tzibj2ntsnbn4e0u5kwv.png'],
    description: ['Fresh and organic', 'Rich in carbohydrates', 'Ideal for curries and fries'],
    inStock: true,
  },
  {
    name: 'Tomato 1 kg',
    category: 'Vegetables',
    price: 40,
    offerPrice: 35,
    image: ['https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/kdbfytxisrjymgy0ubhk.png'],
    description: ['Juicy and ripe', 'Rich in Vitamin C', 'Perfect for salads and sauces', 'Farm fresh quality'],
    inStock: true,
  },
  {
    name: 'Carrot 500g',
    category: 'Vegetables',
    price: 30,
    offerPrice: 28,
    image: ['https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/ceqgisupuizyste9aifg.png'],
    description: ['Sweet and crunchy', 'Good for eyesight', 'Ideal for juices and salads'],
    inStock: true,
  },
  {
    name: 'Spinach 500g',
    category: 'Vegetables',
    price: 18,
    offerPrice: 15,
    image: ['https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/bhrtl76sscvmeiq4kchm.png'],
    description: ['Rich in iron', 'High in vitamins', 'Perfect for soups and salads'],
    inStock: true,
  },
  {
    name: 'Onion 500g',
    category: 'Vegetables',
    price: 22,
    offerPrice: 19,
    image: ['https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/wnvtwlm2tphqburhsmyc.png'],
    description: ['Fresh and pungent', 'Perfect for cooking', 'A kitchen staple'],
    inStock: true,
  },

  // Other products (rest provided data)
  {
    name: 'Potato 500g',
    description: [
      'Fresh and organic',
      'Rich in carbohydrates',
      'Ideal for curries and fries'
    ],
    price: 40,
    offerPrice: 35,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/tzibj2ntsnbn4e0u5kwv.png',
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/jxnombctjwuxfiqgtzkd.png',
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/ppjwtcudpoovuttvxldp.png',
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/yhu67klixm1it3kr0yyd.png'
    ],
    category: 'Vegetables',
    inStock: true,
  },
  {
    name: 'Tomato 1 kg',
    description: [
      'Juicy and ripe',
      'Rich in Vitamin C',
      'Perfect for salads and sauces',
      'Farm fresh quality'
    ],
    price: 30,
    offerPrice: 28,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/kdbfytxisrjymgy0ubhk.png',
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/gbpfrbj9y3hutrebuirg.png'
    ],
    category: 'Vegetables',
    inStock: true,
  },
  {
    name: 'Carrot 500g',
    description: [
      'Sweet and crunchy',
      'Good for eyesight',
      'Ideal for juices and salads'
    ],
    price: 50,
    offerPrice: 44,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/ceqgisupuizyste9aifg.png'
    ],
    category: 'Vegetables',
    inStock: true,
  },
  {
    name: 'Spinach 500g',
    description: [
      'Rich in iron',
      'High in vitamins',
      'Perfect for soups and salads'
    ],
    price: 18,
    offerPrice: 15,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/bhrtl76sscvmeiq4kchm.png'
    ],
    category: 'Vegetables',
    inStock: true,
  },
  {
    name: 'Onion 500g',
    description: [
      'Fresh and pungent',
      'Perfect for cooking',
      'A kitchen staple'
    ],
    price: 50,
    offerPrice: 45,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/wnvtwlm2tphqburhsmyc.png'
    ],
    category: 'Vegetables',
    inStock: true,
  },
  {
    name: 'Apple 1 kg',
    description: ['Boosts immunity', 'Rich in fiber'],
    price: 100,
    offerPrice: 90,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/pjt1y6xdo46tluemhf0o.png'
    ],
    category: 'Fruits',
    inStock: true,
  },
  {
    name: 'Amul Milk 1L',
    description: ['Boosts immunity', ' Rich in fiber'],
    price: 60,
    offerPrice: 55,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/ooamzy497lhsj2gjuwby.png'
    ],
    category: 'Dairy',
    inStock: true,
  },
  {
    name: 'Coca-Cola 1.5L',
    description: ['Coca-Cola 1.5', 'Perfect for parties and gatherings', 'LBest served chilled'],
    price: 80,
    offerPrice: 75,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/eljxcdud6fduwfim5rdx.png'
    ],
    category: 'Drinks',
    inStock: true,
  },
  {
    name: 'Basmati Rice 5kg',
    description: [
      'Long grain and aromatic',
      'Perfect for biryani and pulao',
      'Premium quality'
    ],
    price: 550,
    offerPrice: 520,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/evuovl2nlwdjukosfz23.png'
    ],
    category: 'Grains',
    inStock: true,
  },
  {
    name: 'Brown Bread 400g',
    description: [
      'Soft and healthy',
      'Made from whole wheat',
      'Ideal for breakfast and sandwiches'
    ],
    price: 40,
    offerPrice: 35,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/vy1xa7zovcu22smzapzv.png'
    ],
    category: 'Bakery',
    inStock: true,
  },
  {
    name: 'Maggi Noodles 280g',
    description: [
      'Instant and easy to cook',
      'Delicious taste',
      'Popular among kids and adults'
    ],
    price: 55,
    offerPrice: 50,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/dsep7owmwvfrukzbslqo.png'
    ],
    category: 'Instant',
    inStock: true,
  },
  {
    name: 'Orange 1 kg',
    description: [
      'Juicy and sweet',
      'Rich in Vitamin C',
      'Perfect for juices and salads'
    ],
    price: 80,
    offerPrice: 75,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/r1wxfortw5h12g7egx7k.png'
    ],
    category: 'Fruits',
    inStock: true,
  },
  {
    name: 'Banana 1 kg',
    description: [
      'Sweet and ripe',
      'High in potassium',
      'Great for smoothies and snacking'
    ],
    price: 50,
    offerPrice: 45,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/dsnmko6gqtyw31okby80.png'
    ],
    category: 'Fruits',
    inStock: true,
  },
  {
    name: 'Mango 1 kg',
    description: [
      'Sweet and flavorful',
      'Perfect for smoothies and desserts',
      'Rich in Vitamin A'
    ],
    price: 150,
    offerPrice: 140,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/nb1mpxuo4fdcik6ey5yj.png'
    ],
    category: 'Fruits',
    inStock: true,
  },
  {
    name: 'Grapes 500g',
    description: [
      'Fresh and juicy',
      'Rich in antioxidants',
      'Perfect for snacking and fruit salads'
    ],
    price: 70,
    offerPrice: 65,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/jsmb7caaokhnyci2coga.png'
    ],
    category: 'Fruits',
    inStock: true,
  },
  {
    name: 'Paneer 200g',
    description: [
      'Soft and fresh',
      'Rich in protein',
      'Ideal for curries and snacks'
    ],
    price: 90,
    offerPrice: 85,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/vihqr6wquv57byurvz46.png'
    ],
    category: 'Dairy',
    inStock: true,
  },
  {
    name: 'Eggs 12 pcs',
    description: [
      'Farm fresh',
      'Rich in protein',
      'Ideal for breakfast and baking'
    ],
    price: 90,
    offerPrice: 85,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/cnjrpbcnqesqxy1wr30g.png'
    ],
    category: 'Dairy',
    inStock: true,
  },
  {
    name: 'Cheese 200g',
    description: [
      'Creamy and delicious',
      'Perfect for pizzas and sandwiches',
      'Rich in calcium'
    ],
    price: 140,
    offerPrice: 130,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/gek3mmiig3lixlkpxks8.png'
    ],
    category: 'Dairy',
    inStock: true,
  },
  {
    name: 'Sprite 1.5L',
    description: [
      'Chilled and refreshing',
      'Perfect for celebrations',
      'Best served cold'
    ],
    price: 75,
    offerPrice: 60,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/daiglpvgna1dlhjplbve.png'
    ],
    category: 'Drinks',
    inStock: true,
  },
  {
    name: '7 Up 1.5L',
    description: [
      'Refreshing lemon-lime flavor',
      'Perfect for refreshing',
      'Best served chilled'
    ],
    price: 76,
    offerPrice: 70,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/qt1ypzsoqni12ghf2ryp.png'
    ],
    category: 'Drinks',
    inStock: true,
  },
  {
    name: 'Fanta 1.5L',
    description: [
      'Sweet and fizzy',
      'Great for parties and gatherings',
      'Best served cold'
    ],
    price: 70,
    offerPrice: 65,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/nexecd3mgyzrpeun1bee.png'
    ],
    category: 'Drinks',
    inStock: true,
  },
  {
    name: 'Wheat Flour 5kg',
    description: [
      'High-quality whole wheat',
      'Soft and fluffy rotis',
      'Rich in nutrients'
    ],
    price: 250,
    offerPrice: 230,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/ooitbkcjcky0gkjmkatb.png'
    ],
    category: 'Grains',
    inStock: true,
  },
  {
    name: 'Organic Quinoa 500g',
    description: [
      'High in protein and fiber',
      'Gluten-free',
      'Rich in vitamins and minerals'
    ],
    price: 450,
    offerPrice: 420,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/cxrrgnf12xuhkr4dyhi2.png'
    ],
    category: 'Grains',
    inStock: true,
  },
  {
    name: 'Brown Rice 1kg',
    description: [
      'Whole grain and nutritious',
      'Helps in weight management',
      'Good source of magnesium'
    ],
    price: 120,
    offerPrice: 110,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/dboutcrkdjhoxcvbbqne.png'
    ],
    category: 'Grains',
    inStock: true,
  },
  {
    name: 'Barley 1kg',
    description: [
      'Rich in fiber',
      'Helps improve digestion',
      'Low in fat and cholesterol'
    ],
    price: 150,
    offerPrice: 140,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/spb5sgy8g24rned9nwog.png'
    ],
    category: 'Grains',
    inStock: true,
  },
  {
    name: 'Butter Croissant 100g',
    description: [
      'Flaky and buttery',
      'Freshly baked',
      'Perfect for breakfast or snacks'
    ],
    price: 50,
    offerPrice: 45,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/zvoeqbvrbrt7atqj0dbu.png'
    ],
    category: 'Bakery',
    inStock: true,
  },
  {
    name: 'Knorr Cup Soup 70g',
    description: [
      'Convenient for on-the-go',
      'Healthy and nutritious',
      'Variety of flavors'
    ],
    price: 35,
    offerPrice: 30,
    image: [
      'https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/vnzb2qbwtpab5gnqvx0f.png'
    ],
    category: 'Instant',
    inStock: true,
  }
]

function printSummary() {
  console.log('Sample products to seed:', sampleProducts.length)
  console.log('Categories:', Array.from(new Set(sampleProducts.map(p => p.category))).join(', '))
  console.log('First product preview:')
  console.log(JSON.stringify(sampleProducts[0], null, 2))
}

async function seed() {
  const exec = process.argv.includes('--exec')
  const drop = process.argv.includes('--drop')

  if (!exec) {
    console.log('DRY RUN (no database changes). To actually insert run with --exec')
    printSummary()
    return
  }

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL not set in environment')
    process.exit(1)
  }

  console.log('Connecting to DB (Prisma)...')
  await prisma.$connect()
  console.log('Connected')

  if (drop) {
    console.log('Dropping existing products...')
    await prisma.product.deleteMany({})
  }

  // Prisma createMany expects flat objects matching schema
  const insertedCount = await prisma.product.createMany({ data: sampleProducts, skipDuplicates: true })
  console.log(`Inserted ${insertedCount.count || 0} products`)
  await prisma.$disconnect()
  console.log('Disconnected and done')
}

seed().catch(err => {
  console.error('Seeder error:', err)
  process.exit(1)
})
