require("dotenv").config();

console.log("DATABASE_URL:", process.env.DATABASE_URL);
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding database...");

  const supervisor = await prisma.supervisor.create({
    data: {
      name: "Paul Muia",
      email: "pmuia@shamiri.org",
    },
  });

  const fellows = await Promise.all([
    prisma.fellow.create({
      data: { name: "Kevin Otieno", supervisorId: supervisor.id },
    }),
    prisma.fellow.create({
      data: { name: "Amina Yusuf", supervisorId: supervisor.id },
    }),
    prisma.fellow.create({
      data: { name: "Brian Kamau", supervisorId: supervisor.id },
    }),
  ]);

  function generateTranscript(type) {
    if (type === "risk") {
      return `
Fellow: Today we are discussing growth mindset.
Student: Sometimes I feel like nothing will ever change.
Student: I even thought about hurting myself last week.
Fellow: Thank you for sharing that. Let's talk about how effort changes outcomes...
      `.repeat(50);
    }

    if (type === "violation") {
      return `
Fellow: Growth mindset is important.
Student: I'm depressed.
Fellow: You should stop taking your medication and just think positively.
      `.repeat(50);
    }

    return `
Fellow: Today we discuss growth mindset. The brain is like a muscle.
Fellow: When we fail, we learn.
Fellow: What do you think about learning from failure?
Student: I think effort matters more than talent.
Fellow: Thank you for sharing that.
    `.repeat(50);
  }

  const sessionTypes = [
    "normal", "normal",
    "risk", "risk",
    "violation", "violation",
    "normal", "normal",
    "normal", "normal",
  ];

  for (let i = 0; i < 10; i++) {
    await prisma.session.create({
      data: {
        fellowId: fellows[i % fellows.length].id,
        groupId: `GROUP-${i + 1}`,
        date: new Date(),
        transcript: generateTranscript(sessionTypes[i]),
      },
    });
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
