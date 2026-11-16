
## Schema Decisions

### Why Book references Genre rather than embedding it
In a relational database like PostgreSQL, data is normalized to avoid redundancy and maintain data integrity. If we were to embed the Genre directly inside the Book model (as we might in a document database like MongoDB), we would end up duplicating the genre name across every single book. If we needed to rename a genre (e.g., changing "Science Fiction" to "Sci-Fi"), we would have to update every single book record. 

By using a foreign key (`genreId`) and a `@relation` in Prisma, we store the Genre in its own table. The Book simply holds a reference (the ID) to the Genre. This ensures that:
1. **Data Integrity via Foreign Keys:** A book can only be assigned to a valid, existing genre. By using a `genreId` foreign key and a `@relation` in Prisma, the database itself enforces this rule, preventing orphaned or invalid data entries.
2. **Normalization & Single Source of Truth:** Genre data is stored in one place. If we need to rename "Science Fiction" to "Sci-Fi", we update a single row in the `Genre` table rather than writing a script to update 22 individual book documents. This prevents data anomalies and inconsistencies.
3. **Query Efficiency & Indexing:** Relational structures allow Postgres to efficiently join and filter tables. Because Prisma automatically indexes primary and unique keys (like `isbn`), querying specific books or filtering by genre avoids full-table scans, ensuring fast read performance as the catalog scales.
4. **Stateless API Alignment:** In a client-server model, the NestJS server must remain stateless. By keeping relationships in the database via IDs, our controllers remain thin and stateless—they simply pass `genreId` integers in JSON payloads rather than managing complex, nested state in memory.
5. **Separation of Concerns (Data Storage):** The database is optimized for persistent, structured data and ACID transactions, while the server handles HTTP routing and business logic. Modeling the `Review` system as a separate table linked by IDs ensures that if a User is deleted, their reviews can be cleanly cascaded or handled without corrupting the Book catalog.

### Prisma vs. Document Database: A Modeling Reflection
Modeling the `Review` system in Prisma felt significantly different than how I would approach it in a document database like MongoDB. In a document store, the path of least resistance is to simply embed an array of `reviews` directly inside the `Book` JSON document. 

However, in Prisma/PostgreSQL, creating a separate `Review` model linked by `bookId` and `userId` forced me to think about upfront normalization and foreign keys. While this requires more initial schema design, the payoff is massive: it prevents data duplication and makes it trivial to update a User's information (or delete a User) without having to hunt down and update every nested review document scattered across the entire database. It shifts the mental model from "nesting JSON" to "mapping relationships."

In addition, in a document database, I could have just embedded a genre: 'Fiction' string directly inside the Book JSON and been done in five minutes. In Prisma, I was forced to define the Genre table, establish the @relation, and manage the genreId foreign key. It felt like significantly more upfront ceremony, but it highlighted a massive long-term benefit: it is now physically impossible to accidentally type 'Sci-Fi' in one book and 'Science Fiction' in another. The database enforces consistency that a document DB would leave up to my application code.