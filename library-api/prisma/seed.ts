
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// --- Helper Functions for Realistic Data ---
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const popularTitles = [
  'The Great Gatsby', '1984', 'Dune', 'To Kill a Mockingbird', 
  'Harry Potter and the Sorcerer\'s Stone', 'The Lord of the Rings',
  'Sapiens: A Brief History of Humankind', 'The Da Vinci Code',
  'To Live', 'The God of Small Things', 'Things Fall Apart'
];

const reviewComments = [
  "Absolutely loved it!", "A bit slow in the middle, but great ending.", 
  "Changed my perspective entirely.", "Couldn't put it down.", 
  "Overrated, honestly.", "A true masterpiece of literature.", 
  "Great character development.", "The world-building is unmatched.",
  "A bit predictable, but still enjoyable.", "Highly recommend to everyone."
];

async function main() {
  console.log('🌱 Starting realistic library seed...');

  // 1. Seed Genres
  console.log('Seeding genres...');
  const fiction = await prisma.genre.upsert({ where: { name: 'Fiction' }, update: {}, create: { name: 'Fiction' } });
  const sciFi = await prisma.genre.upsert({ where: { name: 'Science Fiction' }, update: {}, create: { name: 'Science Fiction' } });
  const mystery = await prisma.genre.upsert({ where: { name: 'Mystery' }, update: {}, create: { name: 'Mystery' } });
  const nonFiction = await prisma.genre.upsert({ where: { name: 'Non-Fiction' }, update: {}, create: { name: 'Non-Fiction' } });

  // 2. Seed Users (1 Librarian + 1000 Patrons for realistic reviews)
  console.log('Seeding users (1 Librarian + 1000 Patrons)...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const usersToCreate = [
    { email: 'librarian@library.com', name: 'Head Librarian', password: hashedPassword, role: Role.LIBRARIAN },
    { email: 'avid.reader@library.com', name: 'Avid Reader', password: hashedPassword, role: Role.PATRON }
  ];

  for (let i = 1; i <= 1000; i++) {
    usersToCreate.push({
      email: `patron${i}@library.com`,
      name: `Patron ${i}`,
      password: hashedPassword,
      role: Role.PATRON
    });
  }

  await prisma.user.createMany({ 
    data: usersToCreate, 
    skipDuplicates: true // ✅ Prevents errors if run multiple times
  });

  // 3. Seed 100 Books with Realistic Copy Counts
  console.log('Seeding 100 books with realistic copy counts...');
  const baseBooksData = [
    // --- FICTION (55 Books) ---
    { title: 'Things Fall Apart', author: 'Chinua Achebe', isbn: '978-0385474542', genreId: fiction.id },
    { title: 'A Grain of Wheat', author: 'Ngũgĩ wa Thiong\'o', isbn: '978-0143106760', genreId: fiction.id },
    { title: 'So Long a Letter', author: 'Mariama Bâ', isbn: '978-1577662624', genreId: fiction.id },
    { title: 'Half of a Yellow Sun', author: 'Chimamanda Ngozi Adichie', isbn: '978-1400095209', genreId: fiction.id },
    { title: 'Disgrace', author: 'J.M. Coetzee', isbn: '978-0140296402', genreId: fiction.id },
    { title: 'Houseboy', author: 'Ferdinand Oyono', isbn: '978-1577663270', genreId: fiction.id },
    { title: 'Nervous Conditions', author: 'Tsitsi Dangarembga', isbn: '978-1541674592', genreId: fiction.id },
    { title: 'The Beautyful Ones Are Not Yet Born', author: 'Ayi Kwei Armah', isbn: '978-0435905408', genreId: fiction.id },
    { title: 'July’s People', author: 'Nadine Gordimer', isbn: '978-0140061406', genreId: fiction.id },
    { title: 'Season of Migration to the North', author: 'Tayeb Salih', isbn: '978-1590173022', genreId: fiction.id },
    { title: 'Afterlives', author: 'Abdulrazak Gurnah', isbn: '978-0593541883', genreId: fiction.id },
    { title: 'The Cairo Trilogy', author: 'Naguib Mahfouz', isbn: '978-0307269607', genreId: fiction.id },
    { title: 'A House for Mr Biswas', author: 'V.S. Naipaul', isbn: '978-0375707162', genreId: fiction.id },
    { title: 'Wide Sargasso Sea', author: 'Jean Rhys', isbn: '978-0393352566', genreId: fiction.id },
    { title: 'In the Castle of My Skin', author: 'George Lamming', isbn: '978-0393318296', genreId: fiction.id },
    { title: 'A Brief History of Seven Killings', author: 'Marlon James', isbn: '978-1594633942', genreId: fiction.id },
    { title: 'The Vegetarian', author: 'Han Kang', isbn: '978-1101906118', genreId: fiction.id },
    { title: 'Please Look After Mom', author: 'Shin Kyung-sook', isbn: '978-0307739513', genreId: fiction.id },
    { title: 'Norwegian Wood', author: 'Haruki Murakami', isbn: '978-0375704024', genreId: fiction.id },
    { title: 'To Live', author: 'Yu Hua', isbn: '978-1400031863', genreId: fiction.id },
    { title: 'The God of Small Things', author: 'Arundhati Roy', isbn: '978-0812979657', genreId: fiction.id },
    { title: 'Midnight’s Children', author: 'Salman Rushdie', isbn: '978-0812976533', genreId: fiction.id },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0060935467', genreId: fiction.id },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', genreId: fiction.id },
    { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0141439518', genreId: fiction.id },
    { title: 'Jane Eyre', author: 'Charlotte Brontë', isbn: '978-0141441146', genreId: fiction.id },
    { title: 'Wuthering Heights', author: 'Emily Brontë', isbn: '978-0141439556', genreId: fiction.id },
    { title: 'Great Expectations', author: 'Charles Dickens', isbn: '978-0141439563', genreId: fiction.id },
    { title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0316769488', genreId: fiction.id },
    { title: 'Moby-Dick', author: 'Herman Melville', isbn: '978-0142437247', genreId: fiction.id },
    { title: 'The Grapes of Wrath', author: 'John Steinbeck', isbn: '978-0143039433', genreId: fiction.id },
    { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', isbn: '978-0143058441', genreId: fiction.id },
    { title: 'War and Peace', author: 'Leo Tolstoy', isbn: '978-0140447934', genreId: fiction.id },
    { title: 'Anna Karenina', author: 'Leo Tolstoy', isbn: '978-0143035008', genreId: fiction.id },
    { title: 'Madame Bovary', author: 'Gustave Flaubert', isbn: '978-0140449129', genreId: fiction.id },
    { title: 'The Stranger', author: 'Albert Camus', isbn: '978-0679720201', genreId: fiction.id },
    { title: 'The Count of Monte Cristo', author: 'Alexandre Dumas', isbn: '978-0140449266', genreId: fiction.id },
    { title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez', isbn: '978-0060883287', genreId: fiction.id },
    { title: 'Beloved', author: 'Toni Morrison', isbn: '978-1400033416', genreId: fiction.id },
    { title: 'The Color Purple', author: 'Alice Walker', isbn: '978-0156028356', genreId: fiction.id },
    { title: 'God\'s Bits of Wood', author: 'Ousmane Sembène', isbn: '978-0385095860', genreId: fiction.id },
    { title: 'The Shadow King', author: 'Maaza Mengiste', isbn: '978-0393358803', genreId: fiction.id },
    { title: 'The Farming of Bones', author: 'Edwidge Danticat', isbn: '978-1616953492', genreId: fiction.id },
    { title: 'Les Misérables', author: 'Victor Hugo', isbn: '978-0451419439', genreId: fiction.id },
    { title: 'The Pillars of the Earth', author: 'Ken Follett', isbn: '978-0451166890', genreId: fiction.id },
    { title: 'All the Light We Cannot See', author: 'Anthony Doerr', isbn: '978-1476746586', genreId: fiction.id },
    { title: 'A Tale of Two Cities', author: 'Charles Dickens', isbn: '978-0141439600', genreId: fiction.id },
    { title: 'The Name of the Rose', author: 'Umberto Eco', isbn: '978-0544176560', genreId: fiction.id },
    { title: 'Memoirs of a Geisha', author: 'Arthur Golden', isbn: '978-0307275165', genreId: fiction.id },
    { title: 'Doctor Zhivago', author: 'Boris Pasternak', isbn: '978-0307390950', genreId: fiction.id },
    { title: 'Lolita', author: 'Vladimir Nabokov', isbn: '978-0679723400', genreId: fiction.id },
    { title: 'Ulysses', author: 'James Joyce', isbn: '978-0141182803', genreId: fiction.id },
    { title: 'The Old Man and the Sea', author: 'Ernest Hemingway', isbn: '978-0684801223', genreId: fiction.id },
    { title: 'Of Mice and Men', author: 'John Steinbeck', isbn: '978-0140177398', genreId: fiction.id },
    { title: 'The Book Thief', author: 'Markus Zusak', isbn: '978-0375842207', genreId: fiction.id },

    // --- SCIENCE FICTION & FANTASY (22 Books) ---
    { title: 'The Famished Road', author: 'Ben Okri', isbn: '978-0385425131', genreId: sciFi.id },
    { title: 'The Palm-Wine Drinkard', author: 'Amos Tutuola', isbn: '978-0802133632', genreId: sciFi.id },
    { title: 'Who Fears Death', author: 'Nnedi Okorafor', isbn: '978-0451463364', genreId: sciFi.id },
    { title: 'Black Leopard, Red Wolf', author: 'Marlon James', isbn: '978-0735220188', genreId: sciFi.id },
    { title: 'Kim Jiyoung, Born 1982', author: 'Cho Nam-joo', isbn: '978-1635575811', genreId: sciFi.id },
    { title: 'The Three-Body Problem', author: 'Cixin Liu', isbn: '978-0765377067', genreId: sciFi.id },
    { title: '1984', author: 'George Orwell', isbn: '978-0451524935', genreId: sciFi.id },
    { title: 'Animal Farm', author: 'George Orwell', isbn: '978-0451526342', genreId: sciFi.id },
    { title: 'Brave New World', author: 'Aldous Huxley', isbn: '978-0060850524', genreId: sciFi.id },
    { title: 'Fahrenheit 451', author: 'Ray Bradbury', isbn: '978-1451673319', genreId: sciFi.id },
    { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', isbn: '978-0544003415', genreId: sciFi.id },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '978-0547928227', genreId: sciFi.id },
    { title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', isbn: '978-0590353427', genreId: sciFi.id },
    { title: 'Dune', author: 'Frank Herbert', isbn: '978-0441172719', genreId: sciFi.id },
    { title: 'The Handmaid\'s Tale', author: 'Margaret Atwood', isbn: '978-0385490818', genreId: sciFi.id },
    { title: 'Neuromancer', author: 'William Gibson', isbn: '978-0441569564', genreId: sciFi.id },
    { title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams', isbn: '978-0345391803', genreId: sciFi.id },
    { title: 'Frankenstein', author: 'Mary Shelley', isbn: '978-0486282114', genreId: sciFi.id },
    { title: 'Dracula', author: 'Bram Stoker', isbn: '978-0486411095', genreId: sciFi.id },
    { title: 'Foundation', author: 'Isaac Asimov', isbn: '978-0553293357', genreId: sciFi.id },
    { title: 'Do Androids Dream of Electric Sheep?', author: 'Philip K. Dick', isbn: '978-0345404473', genreId: sciFi.id },
    { title: 'Slaughterhouse-Five', author: 'Kurt Vonnegut', isbn: '978-0385333849', genreId: sciFi.id },

    // --- MYSTERY, THRILLER & ADVENTURE (12 Books) ---
    { title: 'The Adventures of Sherlock Holmes', author: 'Arthur Conan Doyle', isbn: '978-0140437713', genreId: mystery.id },
    { title: 'And Then There Were None', author: 'Agatha Christie', isbn: '978-0062073488', genreId: mystery.id },
    { title: 'Murder on the Orient Express', author: 'Agatha Christie', isbn: '978-0062073501', genreId: mystery.id },
    { title: 'The Silence of the Lambs', author: 'Thomas Harris', isbn: '978-0312924584', genreId: mystery.id },
    { title: 'The Da Vinci Code', author: 'Dan Brown', isbn: '978-0307474278', genreId: mystery.id },
    { title: 'Gone Girl', author: 'Gillian Flynn', isbn: '978-0307588371', genreId: mystery.id },
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', isbn: '978-0307949486', genreId: mystery.id },
    { title: 'The Shining', author: 'Stephen King', isbn: '978-0307743657', genreId: mystery.id },
    { title: 'Rebecca', author: 'Daphne du Maurier', isbn: '978-0385490993', genreId: mystery.id },
    { title: 'The Maltese Falcon', author: 'Dashiell Hammett', isbn: '978-0679722649', genreId: mystery.id },
    { title: 'Treasure Island', author: 'Robert Louis Stevenson', isbn: '978-0141321004', genreId: mystery.id },
    { title: 'The Hound of the Baskervilles', author: 'Arthur Conan Doyle', isbn: '978-0141036144', genreId: mystery.id },

    // --- NON-FICTION, MEMOIR & PHILOSOPHY (11 Books) ---
    { title: 'Long Walk to Freedom', author: 'Nelson Mandela', isbn: '978-0316541138', genreId: nonFiction.id },
    { title: 'The Dark Child', author: 'Camara Laye', isbn: '978-0374506148', genreId: nonFiction.id },
    { title: 'The Diary of a Young Girl', author: 'Anne Frank', isbn: '978-0553296983', genreId: nonFiction.id },
    { title: 'Man’s Search for Meaning', author: 'Viktor Frankl', isbn: '978-0807014295', genreId: nonFiction.id },
    { title: 'Walden', author: 'Henry David Thoreau', isbn: '978-0140390445', genreId: nonFiction.id },
    { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', isbn: '978-0062316097', genreId: nonFiction.id },
    { title: 'Self-Reliance and Other Essays', author: 'Ralph Waldo Emerson', isbn: '978-0486277905', genreId: nonFiction.id },
    { title: 'The Art of War', author: 'Sun Tzu', isbn: '978-1590302255', genreId: nonFiction.id },
    { title: 'I, Claudius', author: 'Robert Graves', isbn: '978-0679724773', genreId: nonFiction.id },
    { title: 'The Red Tent', author: 'Anita Diamant', isbn: '978-0312195519', genreId: nonFiction.id },
    { title: 'Wolf Hall', author: 'Hilary Mantel', isbn: '978-0312429980', genreId: nonFiction.id },
  ];

  // Map over books to add realistic copy counts based on popularity
  const booksWithCopies = baseBooksData.map(book => {
    const isPopular = popularTitles.includes(book.title);
    // Popular books get 80-100 copies, others get 50-79
    const totalCopies = isPopular ? getRandomInt(80, 100) : getRandomInt(50, 79);
    // Available copies always between 2 and 24
    const availableCopies = getRandomInt(2, 24);

    return {
      ...book,
      totalCopies,
      availableCopies
    };
  });

  await prisma.book.createMany({ 
    data: booksWithCopies, 
    skipDuplicates: true // ✅ Prevents errors if run multiple times
  });

  // 4. Seed Realistic Reviews
  console.log('Seeding reviews based on popularity (this may take 10-15 seconds)...');
  const allBooks = await prisma.book.findMany();
  const allUsers = await prisma.user.findMany({ where: { role: Role.PATRON } });
  const userIds = allUsers.map(u => u.id);

  for (const book of allBooks) {
    const isPopular = popularTitles.includes(book.title);
    // Popular books: 200-540 reviews. Normal books: 5-150 reviews.
    const reviewCount = isPopular ? getRandomInt(200, 540) : getRandomInt(5, 150);
    
    const reviewsToCreate = [];
    for (let i = 0; i < reviewCount; i++) {
      const randomUserId = userIds[getRandomInt(0, userIds.length - 1)];
      const randomComment = reviewComments[getRandomInt(0, reviewComments.length - 1)];
      // Popular books tend to have slightly higher ratings in this simulation
      const randomRating = isPopular ? getRandomInt(4, 5) : getRandomInt(2, 5);

      reviewsToCreate.push({
        bookId: book.id,
        userId: randomUserId,
        rating: randomRating,
        comment: randomComment,
      });
    }
    
    // Create in batches of 500 to prevent memory overload and ensure speed
    for (let i = 0; i < reviewsToCreate.length; i += 500) {
      const batch = reviewsToCreate.slice(i, i + 500);
      await prisma.review.createMany({ 
        data: batch, 
        skipDuplicates: true // ✅ Prevents errors if run multiple times
      });
    }
  }

  console.log('✅ Seeding completed successfully!');
  console.log(`   - 4 Genres`);
  console.log(`   - 100 Books (with realistic copy counts)`);
  console.log(`   - 1002 Users (1 Librarian, 1001 Patrons)`);
  console.log(`   - Thousands of realistic reviews`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });