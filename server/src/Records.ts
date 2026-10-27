import { DatabaseSync, type StatementSync } from "node:sqlite";

export type HeldNft = { unit: string; dropId: string; redeemed: boolean };

// What the server knows beyond the chain: one row per claim, holding the NFT
// it minted once the mint is sent, and whether that voucher was redeemed.
// SQLite, so a server on a real network keeps it across restarts; ":memory:"
// for the emulator, whose chain doesn't survive a restart either.
export class Records {
  #reserve: StatementSync;
  #release: StatementSync;
  #recordMint: StatementSync;
  #held: StatementSync;
  #dropOf: StatementSync;
  #redeem: StatementSync;

  constructor(file = ":memory:") {
    const db = new DatabaseSync(file);
    db.exec(`
      CREATE TABLE IF NOT EXISTS claims (
        address TEXT NOT NULL,
        drop_id TEXT NOT NULL,
        unit TEXT UNIQUE,
        redeemed INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (address, drop_id)
      );
      -- Nothing is minting yet, so a claim without a unit is one whose mint was never sent.
      DELETE FROM claims WHERE unit IS NULL;
    `);
    this.#reserve = db.prepare("INSERT INTO claims (address, drop_id) VALUES (?, ?) ON CONFLICT DO NOTHING");
    this.#release = db.prepare("DELETE FROM claims WHERE address = ? AND drop_id = ? AND unit IS NULL");
    this.#recordMint = db.prepare("UPDATE claims SET unit = ? WHERE address = ? AND drop_id = ?");
    this.#held = db.prepare(
      "SELECT unit, drop_id, redeemed FROM claims WHERE unit IN (SELECT value FROM json_each(?)) ORDER BY rowid",
    );
    this.#dropOf = db.prepare("SELECT drop_id FROM claims WHERE unit = ?");
    this.#redeem = db.prepare("UPDATE claims SET redeemed = 1 WHERE unit = ? AND redeemed = 0");
  }

  // Reserves the drop for the address. False if the address already has it.
  reserveClaim(address: string, dropId: string): boolean {
    return this.#reserve.run(address, dropId).changes === 1;
  }

  // Frees a reservation whose mint was never sent.
  releaseClaim(address: string, dropId: string) {
    this.#release.run(address, dropId);
  }

  recordMint(address: string, dropId: string, unit: string) {
    this.#recordMint.run(unit, address, dropId);
  }

  // Which of these units the server minted, oldest first.
  held(units: string[]): HeldNft[] {
    return this.#held
      .all(JSON.stringify(units))
      .map((r) => ({ unit: String(r.unit), dropId: String(r.drop_id), redeemed: r.redeemed === 1 }));
  }

  dropOf(unit: string): string | undefined {
    const row = this.#dropOf.get(unit);
    return row && String(row.drop_id);
  }

  // Marks the NFT redeemed. False if it already was.
  redeem(unit: string): boolean {
    return this.#redeem.run(unit).changes === 1;
  }
}
