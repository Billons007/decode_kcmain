# `decode-kcmain`

A script to decode kancolle's `main.js`

## Install

```sh
npm install
```

## Usage

### Decode main.js
```sh
./src/decode.js FilePath
```
The decode main.js should will in `./dist/main.js`

### MakeDiff
Need decode
```sh
./src/makediff.js OldFilePath NewFilePath
```
The diff file should will in `./diff/change.diff`