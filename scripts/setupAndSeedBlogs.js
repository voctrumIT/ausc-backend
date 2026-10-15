import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import prisma from "../lib/prisma.lib.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_POSTS = [
  {
    title: "Why Study in Australia? Your Guide to Living and Learning Down Under",
    slug: "why-study-in-australia-guide",
    excerpt: "Australia is consistently ranked as one of the best countries in the world for international students. Discover why Australian Sovereign College (AuSC) is your perfect pathway for personal and professional growth.",
    date: "August 12, 2026",
    author: "AuSC Admissions",
    localImageName: "IMG_5757.jpeg",
    s3FileName: "IMG_5757.jpeg",
    category: "International Students",
    content: `
      <p class="mb-5 text-lg">Australia is consistently ranked as one of the best countries in the world for international students. With its diverse culture, world-class education system, and stunning natural landscapes, studying in Australia is a truly life-changing experience.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">A World-Class Education</h3>
      <p class="mb-5">Australian institutions are recognized globally for their high standards of teaching and research. At Australian Sovereign College (AuSC), we uphold these standards by providing industry-relevant training that prepares you for the real world. Our trainers are experienced professionals who bring current industry knowledge directly into the classroom.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">Work While You Study</h3>
      <p class="mb-5">One of the biggest advantages of studying in Australia is the ability to work part-time. International students can work up to 48 hours a fortnight during the semester and full-time during breaks. This not only helps cover living expenses but also provides valuable local work experience, improving your English and helping you build a professional network.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">A Welcoming and Safe Environment</h3>
      <p class="mb-5">Australians are known for their friendly and laid-back nature. Our cities are consistently ranked among the safest and most livable in the world. You'll find a welcoming and inclusive community, making it easy to settle in, make friends, and feel at home.</p>
      
      <div class="bg-gray-50 p-6 rounded-xl border-l-4 border-[#c0392b] my-8">
        <p class="italic text-gray-700 mb-0 font-medium">"Choosing to study at AuSC in Australia was the best decision I ever made. The support from the staff and the quality of the training exceeded all my expectations." - Maria S., AuSC Alumni</p>
      </div>
    `
  },
  {
    title: "Top 5 Benefits of Vocational Education and Training (VET)",
    slug: "top-5-benefits-of-vocational-education-and-training-vet",
    excerpt: "Vocational Education provides practical, hands-on skills that employers are actively looking for. Learn how our Building Trades and Automotive courses set you up for long-term career success.",
    date: "July 28, 2026",
    author: "AuSC Academics",
    localImageName: "Image (7).jpg",
    s3FileName: "Image_7.jpg",
    category: "Career Advice",
    content: `
      <p class="mb-5 text-lg">When considering higher education, many students focus solely on traditional university degrees. However, Vocational Education and Training (VET) offers a highly effective pathway directly into the workforce. Here are the top 5 benefits of choosing a VET course.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">1. Practical, Hands-on Learning</h3>
      <p class="mb-5">Unlike heavily theoretical university courses, VET focuses on the practical skills required for specific jobs. You learn by doing, utilizing real-world equipment and scenarios, which makes you job-ready from day one.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">2. Industry-Relevant Curriculum</h3>
      <p class="mb-5">VET courses at AuSC are designed in close consultation with industry experts. This means you are learning the exact skills and using the latest technologies that employers are currently looking for. The curriculum evolves as industry demands change.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">3. Faster Entry into the Workforce</h3>
      <p class="mb-5">VET courses are typically shorter than university degrees. You can often gain a full qualification in 6 months to 2 years, allowing you to start your career and begin earning money much sooner than your university peers.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">4. Excellent Earning Potential</h3>
      <p class="mb-5">There is a common misconception that VET graduates earn less. In reality, many trade and vocational careers offer starting salaries comparable to, or even higher than, some university graduates, especially in high-demand fields like Building Trades, Automotive Engineering, and IT.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">5. Pathways to University</h3>
      <p class="mb-5">A VET qualification doesn't close the door to university; in fact, it often opens it. Many AuSC courses offer established pathways or credit transfers to university bachelor's degrees if you choose to continue your academic journey later.</p>
    `
  },
  {
    title: "Navigating Life in Melbourne: A Student's Perspective",
    slug: "navigating-life-in-melbourne-students-perspective",
    excerpt: "Melbourne is a vibrant city known for its culture, coffee, and education. Here are our top tips for making the most out of your time studying at our Melbourne Campus.",
    date: "July 15, 2026",
    author: "Student Support",
    localImageName: "B09FD44A-70C0-4110-A3C8-DA48DDAC79C5.jpeg",
    s3FileName: "B09FD44A-70C0-4110-A3C8-DA48DDAC79C5.jpeg",
    category: "Campus Life",
    content: `
      <p class="mb-5 text-lg">Welcome to Melbourne! Voted multiple times as one of the world's most livable cities, Melbourne is a fantastic place to be a student. With its vibrant arts scene, incredible food, and excellent public transport, there is always something to discover.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">Mastering Public Transport</h3>
      <p class="mb-5">Your first priority should be getting a <strong>myki card</strong>. This is your ticket to trains, trams, and buses across the city. Remember that tram travel within the CBD (Central Business District) is completely free! The PTV (Public Transport Victoria) app is essential for navigating the network and checking schedules.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">Coffee Culture and Hidden Laneways</h3>
      <p class="mb-5">Melbourne takes its coffee very seriously. Skip the international chains and explore the hidden laneways (like Degraves Street or Centre Place) to find independent cafes serving some of the best espresso in the world. It's a great way to spend a morning before classes at AuSC.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">Affordable Eats and Markets</h3>
      <p class="mb-5">Eating out on a student budget is entirely possible. Visit the Queen Victoria Market for fresh, affordable produce, meats, and cheeses. For cheap and delicious meals, explore the diverse Asian restaurants in Chinatown or the Italian eateries on Lygon Street.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">Embrace the Four Seasons in One Day</h3>
      <p class="mb-5">Melbourne is famous for its unpredictable weather. The golden rule is: always carry an umbrella and wear layers. It can be sunny in the morning and pouring rain by the afternoon, so be prepared!</p>
    `
  },
  {
    title: "Mastering the English Language: Tips for ELICOS Students",
    slug: "mastering-english-language-tips-for-elicos-students",
    excerpt: "Improving your English can open doors globally. Check out these proven strategies from our ELICOS instructors at Australian Sovereign College to accelerate your language learning journey.",
    date: "June 30, 2026",
    author: "ELICOS Department",
    localImageName: "9F7187EE-37A6-4C91-B813-5A7885D968B0.jpeg",
    s3FileName: "9F7187EE-37A6-4C91-B813-5A7885D968B0.jpeg",
    category: "Study Tips",
    content: `
      <p class="mb-5 text-lg">Learning a new language is a challenging but incredibly rewarding journey. For our ELICOS (English Language Intensive Courses for Overseas Students) students at AuSC, mastering English is the key to unlocking further education and career opportunities.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">1. Immerse Yourself Completely</h3>
      <p class="mb-5">Don't just learn English in the classroom; live it. Change your phone's language settings to English, watch Australian TV shows and movies without subtitles in your native language, and listen to local podcasts or radio stations. The more exposure you have, the faster your brain will adapt.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">2. Don't Be Afraid to Make Mistakes</h3>
      <p class="mb-5">Perfection is the enemy of progress. Speaking a new language means you will make mistakes, and that is completely fine! Native speakers are generally very forgiving and will appreciate your effort. Every mistake is a learning opportunity.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">3. Practice Speaking Every Day</h3>
      <p class="mb-5">Make it a goal to have at least one conversation in English every single day. Talk to your classmates, your teachers, shop assistants, or join a local club or society. The physical act of speaking trains your mouth and builds confidence.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">4. Read for Pleasure</h3>
      <p class="mb-5">Reading textbooks is important, but reading for pleasure helps you absorb natural sentence structures and vocabulary. Start with graded readers or young adult novels, and gradually move up to newspapers and contemporary fiction.</p>
    `
  },
  {
    title: "The Importance of Industry Connections in Your Studies",
    slug: "importance-of-industry-connections-in-studies",
    excerpt: "At AuSC, we believe in bridging the gap between education and industry. Read about how our industry partnerships provide invaluable networking opportunities for our students.",
    date: "June 12, 2026",
    author: "Career Services",
    localImageName: "90473FA5-EF2F-4C09-A981-7F0B4979C809.jpeg",
    s3FileName: "90473FA5-EF2F-4C09-A981-7F0B4979C809.jpeg",
    category: "Professional Development",
    content: `
      <p class="mb-5 text-lg">In today's competitive job market, having a qualification is just the beginning. Who you know can be just as important as what you know. That's why Australian Sovereign College places a massive emphasis on building and maintaining strong industry connections.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">Real-World Relevance</h3>
      <p class="mb-5">Our industry partnerships ensure that what we teach is exactly what the market needs. We regularly consult with industry advisory boards across all our faculties—from Hospitality to IT—to update our curriculum, ensuring our graduates possess the most current and in-demand skills.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">Networking Opportunities</h3>
      <p class="mb-5">Throughout your time at AuSC, you will have opportunities to meet with industry professionals through guest lectures, industry site visits, and networking events. These interactions are invaluable for building your professional network before you even graduate.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">Work Placements and Practical Experience</h3>
      <p class="mb-5">Many of our courses require practical work placements. Because of our strong industry ties, we can help place students in reputable organizations where they can gain hands-on experience, apply their theoretical knowledge, and potentially secure employment post-graduation.</p>
      
      <div class="bg-gray-50 p-6 rounded-xl border-l-4 border-[#c0392b] my-8">
        <p class="font-bold text-gray-900 mb-2">Pro Tip from Career Services:</p>
        <p class="text-gray-700 mb-0">Always treat guest lectures and site visits like a mini-interview. Dress professionally, ask insightful questions, and don't be afraid to ask for a connection on LinkedIn afterwards.</p>
      </div>
    `
  },
  {
    title: "Exploring Tasmania: A Guide to the AuSC Hobart Campus",
    slug: "exploring-tasmania-guide-to-ausc-hobart-campus",
    excerpt: "Tasmania offers a unique blend of natural beauty and high-quality education. Discover what makes studying at our Hobart Campus an unforgettable experience for international students.",
    date: "May 22, 2026",
    author: "Campus Director",
    localImageName: "E6CD1CAF-071B-4D2F-AFAD-B9C7D47DE286.jpeg",
    s3FileName: "E6CD1CAF-071B-4D2F-AFAD-B9C7D47DE286.jpeg",
    category: "Campus Life",
    content: `
      <p class="mb-5 text-lg">Choosing to study at the AuSC Hobart Campus in Tasmania offers a vastly different experience compared to mainland Australia. It's an opportunity to immerse yourself in a tight-knit community surrounded by some of the world's most pristine natural environments.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">A Welcoming, Close-Knit Community</h3>
      <p class="mb-5">Hobart is a smaller, more relaxed city than Melbourne or Sydney. This means a lower cost of living, less traffic, and a strong sense of community. International students often find it easier to connect with locals and experience authentic Australian culture.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">Nature at Your Doorstep</h3>
      <p class="mb-5">If you love the outdoors, Tasmania is a paradise. From the majestic Mount Wellington (kunanyi) which serves as Hobart's backdrop, to the stunning beaches of the East Coast and the ancient rainforests of the West, weekend adventures are always just a short drive away.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">A Booming Local Economy</h3>
      <p class="mb-5">Tasmania's economy is thriving, particularly in sectors like tourism, hospitality, agriculture, and construction. This provides excellent opportunities for part-time work while you study, and strong career prospects for graduates.</p>
      
      <h3 class="text-2xl font-bold mb-3 mt-8 text-gray-900">Regional Study Incentives</h3>
      <p class="mb-5">Studying in a designated regional area like Tasmania can offer significant advantages for international students, including potential extended post-study work rights and additional points towards skilled migration visas. It's a strategic choice for your long-term future.</p>
    `
  }
];

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

async function main() {
  console.log("--- STEP 1: Ensuring blogs table exists safely in PostgreSQL ---");
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "blogs" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "slug" TEXT,
        "excerpt" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "author" TEXT NOT NULL DEFAULT 'AuSC Admissions',
        "date" TEXT,
        "image" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "isPublished" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
      );
    `);
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "blogs_slug_key" ON "blogs"("slug");
    `);
    console.log("✅ 'blogs' table verified in database.");
  } catch (err) {
    console.error("❌ Failed to verify blogs table:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }

  console.log("\n--- STEP 2: Initializing AWS S3 Client ---");
  const region = process.env.AWS_REGION || "ap-south-1";
  const bucketName = process.env.AWS_BUCKET_NAME || "rtospecialist";
  const accessKeyId = process.env.AWS_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY;

  const s3 = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey }
  });

  const frontendImagesDir = path.resolve(__dirname, "../../ausc-frontend/public/new images");
  console.log(`Frontend images directory: ${frontendImagesDir}`);

  console.log("\n--- STEP 3: Uploading images to S3 (/blogs path) and seeding Database ---");

  for (const post of BLOG_POSTS) {
    const localFilePath = path.join(frontendImagesDir, post.localImageName);
    if (!fs.existsSync(localFilePath)) {
      console.error(`⚠️ Local image not found: ${localFilePath}`);
      continue;
    }

    const s3Key = `blogs/${post.s3FileName}`;
    console.log(`Uploading ${post.localImageName} -> s3://${bucketName}/${s3Key}...`);

    const fileBuffer = fs.readFileSync(localFilePath);
    const mimeType = getMimeType(localFilePath);

    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: mimeType
    }));

    const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`;
    console.log(`Uploaded! S3 URL: ${s3Url}`);

    // Check if blog already exists by slug or title
    const existingBlog = await prisma.blog.findFirst({
      where: {
        OR: [
          { slug: post.slug },
          { title: post.title }
        ]
      }
    });

    if (existingBlog) {
      console.log(`Blog "${post.title}" already exists (ID: ${existingBlog.id}). Updating image URL...`);
      await prisma.blog.update({
        where: { id: existingBlog.id },
        data: {
          image: s3Url,
          content: post.content.trim(),
          excerpt: post.excerpt,
          category: post.category,
          author: post.author,
          date: post.date,
          slug: post.slug,
          isPublished: true
        }
      });
      console.log(`✅ Blog updated: ${existingBlog.id}`);
    } else {
      const created = await prisma.blog.create({
        data: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content.trim(),
          author: post.author,
          date: post.date,
          image: s3Url,
          category: post.category,
          isPublished: true
        }
      });
      console.log(`✅ Blog created: ${created.id}`);
    }
  }

  const allBlogs = await prisma.blog.findMany();
  console.log(`\n🎉 Completed! Total blogs in database: ${allBlogs.length}`);
  for (const b of allBlogs) {
    console.log(`- [${b.id}] ${b.title} -> ${b.image}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
