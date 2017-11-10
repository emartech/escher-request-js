# Escher Request JS

The EscherRequest library is for creating HTTP requests to an Escher authenticated API. The default settings
are set for the Emarsys services, but possible to override them with the options parameter.

## Usage

```javascript
const escherRequest = EscherRequest.create('escher.key', 'escher.secret', {
  host: 'example.com',
  credentialScope: 'eu/service/ems_request'
});

const heroId = 1;
let response = await escherRequest.get(`/heroes/${heroId}`);
console.log(response);

let response = await escherRequest.post('/heroes', {
  name: 'Captain America',
  sex: 'male'
});
console.log(response);
```