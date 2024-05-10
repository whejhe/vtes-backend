import { random } from 'lodash';

let players = [];
let tables = [];

function addPlayer(player) {
    players.push(player);
}

function removePlayer(index) {
    let playerIndex = index;
    if (tables[playerIndex]) {
        for (let i = playerIndex + 1; i < players.length && tables[i]; ++i) {
            --i;
            const newPlayerIndex = i;
            const oldTableIndex = tables[newPlayerIndex];
            tables[newPlayerIndex] = tables[playerIndex];
            tables[playerIndex] = oldTableIndex;
        }
        players.splice(index, 1);
    } else {
        throw new Error(`No player with index ${index}`);
    }
}

// Assigns tables to players based on their position in the array
function assignTables() {
    for (let i = 0; i < players.length; ++i) {
        let playerIndex = i;
        let tableIndex = Math.floor((i + 1) / 5);
        if (tableIndex >= tables.length) {
            // Create a new table
            tables.push(null);
        }
        if (!tables[tableIndex]) {
            tables[tableIndex] = [];
        }
        tables[tableIndex].push(playerIndex);
    }
}

const eventManager = {
    addPlayer,
    removePlayer,
    assignTables
};

export default eventManager;
