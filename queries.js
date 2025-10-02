const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

// Task 3:Advanced Queries
// find books in a specific genre
async function findBooksByGenre(genre) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const books = await collection.find({ genre }).toArray();

    if (books.length > 0) {
      console.log(`Found ${books.length} books in the genre "${genre}":`);
      books.forEach(b => console.log(`- ${b.title} by ${b.author}`));
    } else {
      console.log(`No books found in the genre "${genre}".`);
    }
  } catch (err) {
    console.error("Error fetching books:", err);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

// Example usage:
findBooksByGenre("Dystopian");

// find books by author 
async function findBooksByAuthor(author) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const books = await collection.find({ author }).toArray();

    if (books.length > 0) {
      const bookWord = books.length == 1 ? "book" : "books";
      console.log(`Found ${books.length} ${bookWord} by "${author}":`);
      books.forEach(b => console.log(`- "${b.title}"  ${b.published_year}`));
    } else {
      console.log(`No books by "${author}".`);
    }
  } catch (err) {
    console.error("Error fetching books:", err);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

// Example usage:
findBooksByAuthor("Harper Lee");

//update the price of a specific book 
async function updateBookPrice(title, newPrice) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.updateOne(
      { title },                // filter by title
      { $set: { price: newPrice } } // update price
    );

    if (result.matchedCount > 0) {
      console.log(`Updated price of "${title}" to $${newPrice}`);
    } else {
      console.log(`No book found with title "${title}".`);
    }
  } catch (err) {
    console.error("Error updating book price:", err);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

// Example usage
updateBookPrice("The Hobbit", 15.99);

//Delete book by its title
async function deleteBookByTitle(title) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.deleteOne({ title });

    if (result.deletedCount > 0) {
      console.log(`Deleted book with title "${title}".`);
    } else {
      console.log(`No book found with title "${title}".`);
    }
  } catch (err) {
    console.error("Error deleting book:", err);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

// Example usage
deleteBookByTitle("The Catcher in the Rye");

//Books both in stock and published after 2010
async function findRecentInStockBooks() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const books = await collection.find({
      in_stock: true,
      published_year: { $gt: 2010 }
    }).toArray();

    if (books.length > 0) {
      console.log(`Found ${books.length} in-stock books published after 2010:`);
      books.forEach(b => console.log(`- "${b.title}" (${b.published_year})`));
    } else {
      console.log("No matching books found.");
    }
  } catch (err) {
    console.error("Error querying books:", err);
  } finally {
    await client.close();
  }
}

findRecentInStockBooks();

//  projection to return only the title, author, and price fields in your queries
async function findBooksWithProjection() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const books = await collection.find(
      {},                                 // no filter
      { projection: { title: 1, author: 1, price: 1, _id: 0 } } // only return selected fields
    ).toArray();

    console.log("Books (title, author, price):");
    books.forEach(b => console.log(`${b.title} - ${b.author} ($${b.price})`));
  } catch (err) {
    console.error("Error fetching books:", err);
  } finally {
    await client.close();
  }
}
 
findBooksWithProjection();

//sorting to display books by price (both ascending and descending)
//Ascending
async function sortBooksByPriceAsc() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const books = await collection.find({}, { projection: { title: 1, price: 1, _id: 0 } })
                                  .sort({ price: 1 }) // ascending
                                  .toArray();

    console.log("Books sorted by price (ascending):");
    books.forEach(b => console.log(`${b.title} - $${b.price}`));
  } finally {
    await client.close();
  }
}
 
sortBooksByPriceAsc();
//Descending
async function sortBooksByPriceDesc() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const books = await collection.find({}, { projection: { title: 1, price: 1, _id: 0 } })
                                  .sort({ price: -1 }) // descending
                                  .toArray();

    console.log("Books sorted by price (descending):");
    books.forEach(b => console.log(`${b.title} - $${b.price}`));
  } finally {
    await client.close();
  }
}

sortBooksByPriceDesc();

//pagination implementation
async function paginateBooks(page = 1, pageSize = 5) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const books = await collection.find({}, { projection: { title: 1, author: 1, price: 1, _id: 0 } })
                                  .skip((page - 1) * pageSize) // skip previous pages
                                  .limit(pageSize)             // limit results per page
                                  .toArray();

    console.log(`Page ${page} (showing ${books.length} book(s)):`);
    books.forEach(b => console.log(`${b.title} - ${b.author} ($${b.price})`));
  } finally {
    await client.close();
  }
}

// Example usage:
paginateBooks(1); // Page 1
paginateBooks(2); // Page 2

// Task 4:Aggregation pipeline
//Average price of books by genre
async function averagePriceByGenre() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.aggregate([
      { 
        $group: { 
          _id: "$genre", 
          avgPrice: { $avg: "$price" } 
        } 
      },
      { $sort: { avgPrice: -1 } } // optional: highest to lowest
    ]).toArray();

    console.log("Average price by genre:");
    result.forEach(r => console.log(`${r._id}: $${r.avgPrice.toFixed(2)}`));
  } finally {
    await client.close();
  }
}

averagePriceByGenre();

//Author with most books
async function authorWithMostBooks() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.aggregate([
      { 
        $group: { 
          _id: "$author", 
          bookCount: { $sum: 1 } 
        } 
      },
      { $sort: { bookCount: -1 } },
      { $limit: 1 }
    ]).toArray();

    if (result.length > 0) {
      console.log(`Author with most books: ${result[0]._id} (${result[0].bookCount} books)`);
    } else {
      console.log("No authors found.");
    }
  } finally {
    await client.close();
  }
}

authorWithMostBooks();

//Group by publication decade and count
async function booksByDecade() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.aggregate([
      { 
        $addFields: { 
          decade: { $multiply: [ { $floor: { $divide: ["$published_year", 10] } }, 10 ] } 
        } 
      },
      { 
        $group: { 
          _id: "$decade", 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    console.log(" Books grouped by decade:");
    result.forEach(r => console.log(`${r._id}s: ${r.count} book(s)`));
  } finally {
    await client.close();
  }
}

booksByDecade();


// Task 5:Indexing
// title field index
async function createTitleIndex() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.createIndex({ title: 1 });
    console.log("Index created:", result);
  } finally {
    await client.close();
  }
}

createTitleIndex();

//compound index on author and published_year
async function createAuthorYearIndex() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.createIndex({ author: 1, published_year: -1 });
    console.log("Compound index created:", result);
  } finally {
    await client.close();
  }
}

createAuthorYearIndex();

//Improvements Demo(search by title)
async function explainTitleSearch(title) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const query = { title };

    // Run with explain
    const plan = await collection.find(query).explain("executionStats");

    console.log("Execution stats for title search:");
    console.log(JSON.stringify(plan.executionStats, null, 2));
  } finally {
    await client.close();
  }
}

explainTitleSearch();

// Improvement demo(search ny author and published_year)
async function explainAuthorYearSearch(author, year) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const query = { author, published_year: year };

    const plan = await collection.find(query).explain("executionStats");

    console.log("Execution stats for author + year search:");
    console.log(JSON.stringify(plan.executionStats, null, 2));
  } finally {
    await client.close();
  }
}

explainAuthorYearSearch();




