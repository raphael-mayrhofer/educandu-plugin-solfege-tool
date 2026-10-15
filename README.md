# Educandu Plugin: Solfege Tool

Interactive Solfege Tool for [Open Music Academy](https://openmusic.academy/) and Educandu.

The plugin renders melodies entered in simplified ABC notation. Its content model stores the melody, time signature, key, display mode, tempo and width. ABCJS 6.2.3 is loaded by the display component for responsive notation and playback.

## Development

The project requires Node.js 20 and Yarn 1.

```sh
yarn install
yarn gulp lint
yarn gulp test
yarn gulp build
```

Start the local Educandu test application with:

```sh
yarn gulp dev
```

## Plugin type

```text
raphael-mayrhofer/educandu-plugin-solfege-tool
```

## License

MIT
