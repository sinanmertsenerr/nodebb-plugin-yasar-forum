# nodebb-plugin-yasar-forum

The theme layer of [Yaşar Forum](https://yu.uniforum.app): the site's custom CSS and JavaScript, served as static files the browser can cache.

NodeBB's ACP custom CSS and JS are inlined into every HTML page. At Yaşar Forum they add up to about 325 KB per page. This plugin serves the same code as two files instead:

- `static/custom.css` is linked right after NodeBB's own stylesheet, the same place the inline `<style>` had.
- `static/custom.js` is loaded with `defer` after NodeBB's bundle. It runs before `app.coldLoad()`, inside its own function scope, just like the inline custom JS did.
- File URLs carry a content hash, and NodeBB serves plugin static files with a 60-day cache.

The small early script under ACP → Appearance → Custom Content → Custom Header stays there, because it has to run before the page is painted.

## Switching over

1. Install and activate the plugin, then rebuild and restart.
2. In ACP → Appearance → Custom Content, turn off **Enable Custom CSS** and **Enable Custom JavaScript**. The plugin takes over at once.

While those switches are on, the plugin adds nothing, so the code never loads twice. Turning them back on is the rollback.

## Editing

Edit `src/custom.scss` and `src/custom.js`, then build:

    npm install
    npm run build

This compiles the SCSS (compressed, same Sass version as NodeBB), wraps the JavaScript and updates the hashes in `static/manifest.json`. Commit the built files, tag a release and install that tag on the server.

## License

MIT
