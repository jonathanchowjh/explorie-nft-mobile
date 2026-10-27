import { DatabaseSync } from "node:sqlite";

// What the server knows beyond the chain: which address claimed which drop,
// which drop each minted NFT came from, and which vouchers were redeemed.
// SQLite, so a server on a real network keeps it across restarts; ":memory:"
// for the emulator, whose chain doesn't survive a restart either.
export class Records {
  #db: DatabaseSync;

  constructor(file = ":memory:") {
    this.#db = new DatabaseSync(file);
    this.#db.exec(`
      CREATE TABLE IF NOT EXISTS claims (address TEXT NOT NULL, drop_id TEXT NOT NULL, PRIMARY KEY (address, drop_id));
      CREATE TABLE IF NOT EXISTS nfts (unit TEXT PRIMARY KEY, drop_id TEXT NOT NULL, redeemed INTEGER NOT NULL DEFAULT 0);
    `);
  }

  // Reserves the drop for the address. False if the address already has it.
  reserveClaim(address: string, dropId: string): boolean {
    const insert = this.#db.prepare("INSERT INTO claims VALUES (?, ?) ON CONFLICT DO NOTHING");
    return insert.run(address, dropId).changes === 1;
  }

  releaseClaim(address: string, dropId: string) {
    this.#db.prepare("DELETE FROM claims WHERE address = ? AND drop_id = ?").run(address, dropId);
  }

  recordMint(unit: string, dropId: string) {
    this.#db.prepare("INSERT INTO nfts (unit, drop_id) VALUES (?, ?)").run(unit, dropId);
  }

  // Every NFT minted, oldest first.
  minted(): { unit: string; dropId: string; redeemed: boolean }[] {
    const rows = this.#db.prepare("SELECT unit, drop_id, redeemed FROM nfts ORDER BY rowid").all();
    return rows.map((r) => ({ unit: String(r.unit), dropId: String(r.drop_id), redeemed: r.redeemed === 1 }));
  }

  dropOf(unit: string): string | undefined {
    const row = this.#db.prepare("SELECT drop_id FROM nfts WHERE unit = ?").get(unit);
    return row && String(row.drop_id);
  }

  // Marks the NFT redeemed. False if it already was.
  redeem(unit: string): boolean {
    return this.#db.prepare("UPDATE nfts SET redeemed = 1 WHERE unit = ? AND redeemed = 0").run(unit).changes === 1;
  }
}
