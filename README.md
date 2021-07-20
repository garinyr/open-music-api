# open-music-api

## Project API open music Dicoding

### note : this is for study purpose only

<br>

**Method : POST** <br>
**URL : /songs**

```
Body Request:
{
"title": string,
"year": number,
"performer": string,
"genre": string,
"duration": number
}
```

**Method : GET** <br>
**URL : /songs**

```
Response Body:
{
    "status": "success",
    "data": {
        "songs": [
            {
                "id": "song-Qbax5Oy7L8WKf74l",
                "title": "Kenangan Mantan",
                "performer": "Dicoding"
            },
        ]
    }
}
```

**Method : GET** <br>
**URL : /songs/{songId}**

```
Response Body:
{
    "status": "success",
    "data": {
        "song": {
            "id": "song-Qbax5Oy7L8WKf74l",
            "title": "Kenangan Mantan",
            "year": 2021,
            "performer": "Dicoding",
            "genre": "Indie",
            "duration": 120,
            "insertedAt": "2021-03-05T06:14:28.930Z",
            "updatedAt": "2021-03-05T06:14:30.718Z"
        }
    }
}
```

**Method : PUT** <br>
**URL : /songs/{songId}**

```
Body Request:
{
    "title": string,
    "year": number,
    "performer": string,
    "genre": string,
    "duration": number
}
```

**Method : DELETE** <br>
**URL : /songs/{songId}**

```
Response Body:
{
    "status": "success",
    "message": "lagu berhasil dihapus"
}
```
