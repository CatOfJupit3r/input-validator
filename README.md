# Just Enough Schemas!

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> Ever felt like there wasn't enough validation in your life? Well, now there is!
>
> Just Enough Schemas is a simple, lightweight, and easy-to-use schema validation library for TypeScript.
> It's designed to be simple to use, but powerful enough to handle most validation needs.


## Features

- **Simple and Complex Schemas**: Define simple schemas with a single line, or complex schemas with nested objects and arrays. 
- **TypeScript Support**: Built using TypeScript and for TypeScript, Just Enough Schemas provides full type support.
- **Errors as Values**: Schemas does not throw any errors! Instead, they return special objects that will contain type of error.
- **Custom Schema Types**: Extended Schemas allow you to personalize your schemas with custom types.


## Install

```
npm install just-enough-schemas
```

## Usage

```ts
import { Schema, ExtendedSchema } from 'just-enough-schemas';

const schema = new Schema({
    name: 'string',
    age: 'number',
});
const valid = schema.check({
    name: 'John Doe',
    age: 42,
}); // sucessful validation

```

## API

For detailed overview of API, please refer to the [repo wiki][api-wiki-url].


## Contributing

Contributions are welcome! If you have a feature request or bug report, please open an issue. 

But, I doubt I will fix it myself...

[build-img]:https://github.com/CatOfJupit3r/just-enough-schemas/actions/workflows/release.yml/badge.svg

[build-url]:https://github.com/CatOfJupit3r/just-enough-schemas/actions/workflows/release.yml

[downloads-img]:https://img.shields.io/npm/dt/typescript-npm-package-template

[downloads-url]:https://www.npmtrends.com/typescript-npm-package-template

[npm-img]:https://img.shields.io/npm/v/typescript-npm-package-template

[npm-url]:https://www.npmjs.com/package/just-enough-schemas

[issues-img]:https://img.shields.io/github/issues/ryansonshine/typescript-npm-package-template

[issues-url]:https://github.com/CatOfJupit3r/just-enough-schemas/issues

[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg

[semantic-release-url]:https://github.com/semantic-release/semantic-release

[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg

[commitizen-url]:http://commitizen.github.io/cz-cli/

[api-wiki-url]:https://github.com/CatOfJupit3r/just-enough-schemas/wiki