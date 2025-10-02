PLP Bookstore – MongoDB Project

This project demonstrates how to use MongoDB with Node.js to manage a bookstore.

👨‍💻How to run scripts

🚀 Prerequisites

Node.js (v16 or higher recommended)
👉 Download Node.js

MongoDB Community Server running locally on:

mongodb://localhost:27017


👉 Download MongoDB

Dependencies

Step 1: Make sure Node.js is installed
You can check if Node.js is installed by running:

node --version
If not installed, download it from nodejs.org.

Step 2: Initialize your project (if not done already)
Navigate to the project directory and run:

npm init -y
This creates a package.json file to manage your project dependencies.

Step 3: Install the MongoDB driver
Run this command in the project directory:

npm install mongodb

📂 Project Structure

plp_bookstore/

│── insert_books.js   # Script to populate the database with sample books

│── queries.js           # (Your big script with queries, aggregation & indexes)

│── README.md         # Documentation (this file)


📥 Insert Sample Data

Before running queries, insert sample books:

node insert_books.js


This will:

Drop existing books collection if it exists

Insert ~12 books with fields:
title, author, genre, published_year, price, in_stock, pages, publisher

🔎 Run Queries & Operations

Run your main script:

node queries.js


It will demonstrate:

✅ CRUD & Queries

Find books by genre

Find books by author

Update a book price

Delete a book by title

Find in-stock books published after 2010

Projection (title, author, price only)

Sorting (price ascending/descending)

Pagination (5 books per page)

📊 Aggregation Pipelines

Average price of books by genre

Author with the most books

Grouping books by decade of publication

⚡ Indexing & Performance

Create index on title

Create compound index on (author, published_year)

Use explain("executionStats") to compare query performance

Before index → "COLLSCAN" (collection scan, slower)

After index → "IXSCAN" (index scan, faster)
