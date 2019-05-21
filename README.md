
# `tubby` — youtube playlist search

- ⚡ [***demo: chasemoskal.com/tubby***](https://chasemoskal.com/tubby)
- web component to display a youtube playlist with a search bar

## using the `<tubby-youtube-explorer>` component on your webpage

1. **first, you need access to the youtube api, and have your api key ready**

    - login with the google developer console, and get yourself a youtube api key
    - you have to whitelist your domains with that api key
    - you can have an api key that allows 'localhost' for testing

2. **install tubby on your page**

    - include the following snippet on your page

      ```html
      <script type="importmap-shim">
        {
          "imports": {
            "lit-html/": "https://unpkg.com/lit-html@1.0.0/",
            "lit-html": "https://unpkg.com/lit-html@1.0.0/lit-html.js",
            "lit-element/": "https://unpkg.com/lit-element@2.1.0/",
            "lit-element": "https://unpkg.com/lit-element@2.1.0/lit-element.js",
            "tubby/": "https://unpkg.com/tubby@0.3.0-dev.3/",
            "tubby": "https://unpkg.com/tubby@0.3.0-dev.3/dist/index.js"
          }
        }
      </script>
      <script type="module-shim">
        import "tubby/dist/register-all.js"
      </script>
      <script src="https://unpkg.com/es-module-shims@0.2.3/dist/es-module-shims.js"></script>
      ```

      here's what's going on in this snippet

      - **import maps**
        - we provide an import map which locates `tubby` and its dependencies
        - of course, for the import map, we're using guy bedford's awesome polyfill: [es-module-shims](https://github.com/guybedford/es-module-shims)
        - if you're from the future, you won't need the `-shim`'s
      - **register the web components**
        - we run `import "tubby/dist/register-all.js"` to register the `<tubby-youtube-explorer>` component

3. **place the explorer html on your page**

    ```html
    <tubby-youtube-explorer
      search
      max-description-length="360"
      api-key="AIzaSyDeHpB9W14feQs8myoWgFAZOCrDeKMLRwE"
      playlist-id="UUL_f53ZEJxp8TtlOkHwMV9Q"
      canned="dist-demo/canned-videos.json"
      >
    </tubby-youtube-explorer>
    ```

    the youtube explorer fetches the specified youtube playlist, and displays video thumbnails in a grid formation, and optionally has a searchbar for filtering the video selection

    youtube's api limits us to 50 videos at a time, so tubby does the hard work and requests every video sequentially, using back-to-back calls until it finds every video in the playlist

    tubby has a simple dev-time caching mechanism i call "canning videos"

4. **know how to configure the explorer for your use-case**

    all of tubby's configurable properties are optional, but you probably want to use a combination that loads some videos

    - **⚓ string attributes `[api-key]` and `[playlist-id]`**  
      tubby will fetch all the videos in that playlist

    - **⚓ string attributes `[api-key]` and `[channel-id]`**  
      tubby will make an extra round trip to find the playlist called "uploads".  
      it is faster to provide the `[playlist-id]` attribute instead

    - **⚓ string attribute `[canned]` url**  
      tubby will fetch these cached videos.  
      if a playlist is also being fetched, the canned videos will provide a headstart that can prevent many round-trips and greatly improve the loading time.  
      more on canning videos later in the readme

    - **⚓ boolean attribute `[search]`**  
      tubby will display a search bar that the user can use to narrow the video listing

    - **⚓ number attribute `[max-description-length]`**  
      character number limit for video descriptions

    *optional javascript stuff*  
    ```js

    // we can create the explorer programmatically
    const explorer = document.createElement("tubby-youtube-explorer")
    document.body.appendChild(explorer)

    // we can set the attributes as properties
    explorer["search"] = true
    explorer["max-description-length"] = 360
    explorer["api-key"] = "AIzaSyDeHpB9W14feQs8myoWgFAZOCrDeKMLRwE" 
    explorer["playlist-id"] = "UUL_f53ZEJxp8TtlOkHwMV9Q"
    explorer["canned"] = "dist-demo/canned-videos.json"

    // the explorer supports these callbacks
    explorer.onReady = () => console.log(`tubby loaded ${explorer.videos.length} videos`)
    explorer.onError = error => console.warn(error)

    // in addition to the two callbacks, there are matching custom events
    explorer.addEventListener("ready", () => console.info("ready"))
    explorer.addEventListener("error", () => console.info("error"))
    ```

5. **know how to style the explorer**

    ```html
    <style>
      tubby-video-explorer {
        --focus-outline: 2px solid #0ef;
        --tubby-search-focus-outline-offset: -4px;
        --tubby-pending-bg: rgba(0,0,0, 0.2);
        --tubby-error-bg: rgba(128,0,0, 0.2);
        --tubby-pending-color: white;
        --tubby-error-color: yellow;
        --tubby-search-icon-color: rgba(0,0,0, 0.5);
        --tubby-results-blink-color: rgba(255,255,255, 0.5);
        --tubby-grid-bg: rgba(0,0,0, 0.2);
        --tubby-video-color: white;
        --tubby-video-bg: linear-gradient(to bottom right,
          rgba(25,25,25, 0.95) 32%,
          rgba(25,25,25, 0.6)
        );
      }
    </style>
    ```

6. **canning videos with tubby's `tubby-download` commandline tool**

    you can give tubby a headstart (greatly reducing load times for large playlists), by using the `tubby-download` cli to generate a cache of "canned" videos in a json file, here's how

    - `npm install tubby`  
      *install tubby into your npm package*

    - `tubby-download --api-key=AIzaSyDeHpB9W14feQs8myoWgFAZOCrDeKMLRwE --playlist-id=UUL_f53ZEJxp8TtlOkHwMV9Q > dist/canned-videos.json`  
      *call the tubby binary in a package.json script, supply the api-key and playlist-id, and specify where tubby should write the canned videos json file*

    - then you just provide the `[canned]` attribute like so: `<tubby-youtube-explorer canned="dist/canned-videos.json">`

## tubby is open source and contributions are welcome!

please consider opening an issue or contributing pull requests :)
