# Current app behaviour

What the app does today, written from the code before the Expo SDK rebuild. The rebuilt app should pass every
unchecked box. Items under **Known bugs** describe current behaviour that the rebuild fixes on purpose, so don't port them.

All screens sit on one native stack with headers hidden. The app opens on **Home**.

## Shared chrome

Header (Home, Search, Wallet, NFT, Marketplace, Settings):
- [ ] "Explorie" in red → Home
- [ ] Search icon → Search, with no params
- [ ] QR icon → Home

Footer (same screens):
- [ ] "Explore" (map icon) → Map
- [ ] Wallet icon → Wallet
- [ ] Cog icon → Settings
- [ ] Store icon → Marketplace

List row (Home, Search): NFT image (falls back to the logo), title (or "Title"), subtitle (or "Subtitle").

## Home
- [ ] Banner: "Sam Riley", "Apprentice" in orange, round profile picture, no gradient
- [ ] Progress cards: "30 km travelled" (bicycle) and "20 NFTs collected" (cubes) side by side in green, then
      "Daily Tasks" (check) in orange. Every bar shows 30% progress.
- [ ] Three sections, each showing its first 2 NFTs from the catalogue:
  - "Popular NFTs": all NFTs
  - "Vouchers Near Me": `voucher` only
  - "Collectables Near Me": `collectable` only
- [ ] Tapping a row → Map with that NFT selected
- [ ] "View More" → Search with the section title as header and the section's full list
- [ ] An empty section shows "Search Here..."

## Search
- [ ] Back chevron → previous screen
- [ ] Opened from "View More": the header and list are the ones passed in
- [ ] Typing: header becomes `Search: <query>`. The list shows catalogue NFTs whose title or subtitle contains the
      query, case-insensitive.
- [ ] Clearing the input empties the header and the list
- [ ] Tapping a row → Map with that NFT selected
- [ ] An empty list shows "Search Here..."

## Map
- [ ] Map centred on 40.7496569, -73.9930029 (Manhattan), latitude delta 0.0922
- [ ] One pointer marker per catalogue NFT. The selected one is fully opaque, the others are at 60%.
- [ ] Tapping a marker selects it
- [ ] Bottom card for the selected NFT: title, location photo, location name, "`<distance>` away"
- [ ] "Collect": if the NFT's `success` flag is true (it stands in for "you are close enough"), add it to the wallet.
      Either way → Redeem with the NFT.
- [ ] Info (ⓘ) button: does nothing

## Redeem
- [ ] Location photo across the top
- [ ] Location-name pill, plus location-arrow and heart pills (no actions)
- [ ] Title, distance, rating, NFT image, location description
- [ ] "Collect" → Info with the NFT. `success` decides which message Info shows.

## Info
- [ ] Success: success icon, "Congrats!", then the message passed in, or else "You redeemed the NFT: `<title>`!",
      then the NFT image
- [ ] Failure: error icon, "Woopsy!", then "In order to redeem this NFT you have to be in the correct location"
- [ ] Goes to Home after 5 seconds

## Wallet
- [ ] Red gradient banner: "Wallet", "EXP Balance: 582.34". Two buttons: "djnsj2ud" (clone icon) and "Settings",
      neither of which does anything.
- [ ] "My Vouchers": owned `voucher` and `voucherRedeemed` NFTs
- [ ] "My Collectables": owned `collectable` NFTs
- [ ] Each section shows its first 3 as image cards. Tapping a card → NFT detail.
- [ ] "View More" → Search with the section title and its full list
- [ ] An empty section shows "Nothing Here"

## NFT detail (reached only from Wallet)
- [ ] Square image, title, subtitle, then the location description below the buttons
- [ ] Unredeemed voucher: red "Redeem" marks it redeemed in the wallet → Info with "Voucher Redeemed!"
- [ ] Redeemed voucher: grey "Redeemed" (no action); "Code: #jdndn" with a copy icon (no action yet); "View QR Code"
      shows or hides a QR image below the description
- [ ] Collectable: "Marketplace" → Marketplace

## Marketplace / Settings
- [ ] Marketplace: green banner "Marketplace", "Buy and Sell your collectables", then "Under Development"
- [ ] Settings: teal banner "Settings", "Sammy", then "Under Development"

## Scanner
Unreachable, because no button navigates to it. If opened: asks for camera permission; any barcode → Info with
success after 0.5 s; a "Tap to Scan your NFT" button re-arms scanning.

## Seed data
- Catalogue: 11 NFTs. IDs 1–4 and 11 are collectables; 5–10 are vouchers. ID 2 ("Cyber kongz") has `success: false`,
  so it's the one NFT that can't be collected.
- Wallet at launch: ID 11 (collectable), ID 6 (voucher) and ID 7 (redeemed voucher).

## Known bugs (fixed in the rebuild, not ported)
- Map, NFT detail and Search read their params only on first mount. Navigating back to one already in the stack shows
  stale content.
- Collecting the same NFT twice adds it to the wallet twice.
- Map selects index 2 by default and falls back to index 0 when the NFT isn't found.
- Remote image URLs never render: the `instanceof String` check is always false. Both `.mp4` NFT images are dead links
  anyway.
- Info starts a new 5-second timer on every render and never clears it.
- Scanner shows "No access to camera" before the permission request finishes, and accepts any barcode.
- The QR header button should open Scanner, not Home.
- Dark mode is unreadable (black backgrounds with hard-coded black text).
- `useCachedResources` still loads the `space-mono` font, which nothing uses any more.

## Deliberate changes in the rebuild
- **Navigation:** under React Navigation 7, list items, cards and "View More" open a new screen, so Back returns to
  where you tapped and params are never stale. Header, footer and Info→Home go back to the screen if it's already open
  and push it otherwise (`navigate` with `pop: true`), as the old app did.
- **Scanner:** reachable from the header QR button. A QR code holding an NFT id (for example `5`) collects that NFT;
  any other code shows "That QR code isn't an Explorie NFT."
- **Subtitles:** every placeholder `sub` subtitle now shows the NFT's location name, and search matches on it.
- **Images:** the dead `.mp4` NFT images and the dead profile picture are replaced with bundled images. The dead MoMA
  location photo shows as a grey box. The redeemed-voucher QR image is bundled instead of hot-linked.
- **Map:** pins are anchored at the pointer's tip, not 84% across. The default selection is the first NFT.
- **Styling:** both "View More" links are the orange text style. Progress bars span their card. The wallet address
  button truncates with an ellipsis. Light mode only.
- **App icon:** the Android adaptive icon uses `adaptive-icon.png`, not the splash image.
- **Voucher code (feature):** "Code: #jdndn" copies the code to the clipboard.
- **Collecting:** the map card's "Collect" collects the NFT if it's in range and goes straight to Info. The ⓘ button
  opens the details screen, whose "Collect" does the same. Before, the map collected first and then opened details,
  where "Collect" collected nothing.
- **Wallet banner:** the address button copies the wallet address; "Settings" opens Settings.
- **Home:** "NFTs collected" counts the wallet (3 at launch, not a fixed 20), and its bar shows the share of the
  catalogue collected.

## Claiming through the server (after the rebuild)
- **Scanner:** a drop's QR poster holds `explorie:<drop id>:<claim code>`. Scanning one asks for location access, then
  sends the code, the phone's location and the wallet address to the [claim server](../server), with a "Claiming your
  NFT…" spinner in between. On success the NFT is added to the wallet and Info shows "Congrats!". On failure Info
  shows the server's reason (wrong code, too far from the drop, already claimed) or that the server couldn't be
  reached. A bare NFT id such as `5` is no longer accepted.
- **Map card and details screen:** "Collect" is now "Scan to collect" and opens the scanner. The app can't claim
  without the poster's code.
- **Location check:** the server checks the phone's real distance to the drop. The seed data's `success` flag is gone,
  so Cyber kongz is no longer special.
- **Wallet address:** comes from `EXPO_PUBLIC_WALLET_ADDRESS`. The banner shows it and copies it, or shows "No wallet
  address" when it's unset.
- **Drop data:** ids, titles, kinds and coordinates live in `src/data/drops.json`, which the server reads too.
