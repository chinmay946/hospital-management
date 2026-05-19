const fs = require('fs').promises;
const path = require('path');

const dbFile = path.join(__dirname, 'data', 'db.json');

async function readDB() {
    try {
        const content = await fs.readFile(dbFile, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        if (error.code === 'ENOENT') {
            const initial = {
                patients: [],
                doctors: [],
                appointments: [],
                invoices: [],
                users: [],
                departments: []
            };
            await writeDB(initial);
            return initial;
        }
        throw error;
    }
}

async function writeDB(data) {
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(dbFile, content, 'utf8');
}

function formatId(prefix, currentArray, padding = 3) {
    const last = currentArray
        .map(item => item.id)
        .filter(Boolean)
        .map(id => parseInt(id.replace(/[^0-9]/g, ''), 10))
        .sort((a, b) => a - b)
        .pop() || 0;

    return `${prefix}${String(last + 1).padStart(padding, '0')}`;
}

function paginate(list, page = 1, limit = 20) {
    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(Math.max(page, 1), pages);
    const start = (currentPage - 1) * limit;
    const end = start + limit;

    return {
        data: list.slice(start, end),
        pagination: {
            page: currentPage,
            limit,
            total,
            pages
        }
    };
}

module.exports = {
    readDB,
    writeDB,
    formatId,
    paginate
};
