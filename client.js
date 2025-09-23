const axios = require('axios');

const BASE = 'http://localhost:5000';

async function getAllBooksAsyncCallback() {
  // Task 10: Get all books – Using async callback function (simulated with setTimeout)
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const res = await axios.get(`${BASE}/`);
        resolve(res.data);
      } catch (e) {
        reject(e);
      }
    }, 200);
  });
}

function getByIsbnWithPromise(isbn) {
  // Task 11: Search by ISBN – Using Promises
  return axios.get(`${BASE}/isbn/${isbn}`).then((res) => res.data);
}

async function getByAuthor(author) {
  // Task 12: Search by Author – Using async/await
  const res = await axios.get(`${BASE}/author/${encodeURIComponent(author)}`);
  return res.data;
}

async function getByTitle(title) {
  // Task 13: Search by Title – Using async/await
  const res = await axios.get(`${BASE}/title/${encodeURIComponent(title)}`);
  return res.data;
}

async function runDemo() {
  try {
    const all = await getAllBooksAsyncCallback();
    console.log('All books count:', Object.keys(all).length);

    const isbn = '1';
    const byIsbn = await getByIsbnWithPromise(isbn);
    console.log('By ISBN:', isbn, byIsbn);

    const author = 'Jane Austen';
    const byAuthor = await getByAuthor(author);
    console.log('By Author:', author, byAuthor);

    const title = 'Pride and Prejudice';
    const byTitle = await getByTitle(title);
    console.log('By Title:', title, byTitle);
  } catch (e) {
    console.error('Client demo error:', e.response?.data || e.message);
  }
}

if (require.main === module) {
  runDemo();
}

module.exports = { getAllBooksAsyncCallback, getByIsbnWithPromise, getByAuthor, getByTitle };


