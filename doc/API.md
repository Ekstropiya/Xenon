# Documentation: API
###### V0.0.1-A

### Requests

##### GET ``/api/requests``

Fetch requests chronologically. By default it will only return the first request to fifteenth.

###### Query Parameters

|       Key | Example | Default Value | Aliases | Description                                       |
| --------: | :------ | :------------ | ------- | ------------------------------------------------- |
| ``begin`` | ``5``   | ``0``         | ``b``   | Will begin the list at the nth request ever made. |
|   ``end`` | ``30``  | ``15``         | ``e``   | Will end the list at the nth request ever made.   |

###### Example Response

```json
[
  {
    "timestamp": "1633897225038",
    "id": "f35ec11355f67fe3d3c8a33a7198fdcb5c849c5c",
    "method": "GET",
    "host": "https://duckduckgo.com",
    "url": "https://duckduckgo.com/ac/?q=discord",
    "httpVersion": "1.1",
    "response": {
      "id": "e8ad7390d8a2a3ce4826624b2d3cebed3b6596b7",
      "timestamp": "1633897225040",
      "status": 200,
      "headers": [
        {
          "id": 19,
          "key": "content-encoding",
          "value": "gzip"
        },
        ...
      ]
    },
    "headers": [
      {
        "id": 1,
        "key": "host",
        "value": "https://duckduckgo.com"
      },
      ...
    ]
  }
]
```

##### GET ``/api/requests/:id``

Fetch a single request by ID.

###### Request Parameters

|    Key | Example                                      | Default Value | Description                     |
| -----: | :------------------------------------------- | :------------ | ------------------------------- |
| ``id`` | ``f35ec11355f67fe3d3c8a33a7198fdcb5c849c5c`` |               | The ID of the request to fetch. |

###### Example Response

```json
{
  "timestamp": "1633897225038",
  "id": "f35ec11355f67fe3d3c8a33a7198fdcb5c849c5c",
  "method": "GET",
  "host": "https://duckduckgo.com",
  "url": "https://duckduckgo.com/ac/?q=discord",
  "httpVersion": "1.1",
  "response": {
    "id": "e8ad7390d8a2a3ce4826624b2d3cebed3b6596b7",
    "timestamp": "1633897225040",
    "status": 200,
    "headers": [
      {
        "id": 1,
        "key": "server",
        "value": "nginx"
      },
      ...
    ]
  },
  "headers": [
    {
      "id": 1,
      "key": "host",
      "value": "https://duckduckgo.com"
    },
    ...
  ]
}
```

##### GET ``/api/requests/:id/response``

Fetch the response object of a request.

###### Request Parameters

|    Key | Example                                      | Default Value | Description                     |
| -----: | :------------------------------------------- | :------------ | ------------------------------- |
| ``id`` | ``f35ec11355f67fe3d3c8a33a7198fdcb5c849c5c`` |               | The ID of the request to fetch. |

###### Example Response

```json
{
  "id": "e8ad7390d8a2a3ce4826624b2d3cebed3b6596b7",
  "timestamp": "1633897225040",
  "status": 200,
  "headers": [
    {
      "id": 1,
      "key": "server",
      "value": "nginx"
    },
    ...
  ]
}
```

##### GET ``/api/requests/:id/response/payload``

Fetch the response payload of a requests response.

###### Request Parameters

|    Key | Example                                      | Default Value | Description                     |
| -----: | :------------------------------------------- | :------------ | ------------------------------- |
| ``id`` | ``f35ec11355f67fe3d3c8a33a7198fdcb5c849c5c`` |               | The ID of the request to fetch. |

###### Example Response

```json
{
  "id": 1,
  "content": "<!DOCTYPE html>\n<html>\n<body>...",
  "type": "text/html; charset=UTF-8"
}
```

---