Bienvenue sur le repository pour le jeu de piste pour le FEEL Ensimag !

> le jeu est disponible à l'adresse suivante : https://jeu-de-piste-ensimag.vercel.app/ 🚀🔥

## Presentation des épreuves

| Syntax      | Description | Auteur | Solution
| ----------- | ----------- | ----------- |  ----------- |
| `readme.html`      | `01-t3rm1n4l.html`       | Paul | check the CSS and find the file |
| `01-t3rm1n4l.html`   | `02-m4r10-n3v3r-d13d.html`        | Paul | Check the JS and find the file |
| `02-m4r10-n3v3r-d13d.html`   | `03-h3110-y0u-4r3-4w350m3.html`        | Paul | Check HTTP Headers and find the `X-Flag` |
| `03-h3110-y0u-4r3-4w350m3.html`   | `04-7h3-4n5w3r-15-4-5h4m3.html`        | Paul | Solve the equation and send the result in the `result` variable |
| `04-7h3-4n5w3r-15-4-5h4m3.html`   | `05-x0r-15-n0t-m1l1t4ry-gr4d3-3ncrypt10n.html`        | Paul | retrieve the Javascript and XOR the bytes with the defined function |
| `05-x0r-15-n0t-m1l1t4ry-gr4d3-3ncrypt10n.html`   | `06-us3r-4g3n7-15-4n-1n73rn4710n4l-574nd4rd.html`        | Paul | Change the `User-Agent` to anything with `Ensimag` in it (both lowercase/uppercase works) |
| `06-us3r-4g3n7-15-4n-1n73rn4710n4l-574nd4rd.html`   | `07-Y0u-c4n-b3-pr0ud-0f-y0ur53lf.html`       | Paul | Follow the instructions and create a small program to find the right number between 0 and 1000000 with only 25 tries + 25 seconds (dichotomy powa) |
| `07-Y0u-c4n-b3-pr0ud-0f-y0ur53lf.html`   | `08-1BM-3ncOd1ng-t0-1s0.html`        | Emilien | `8Pdg8cLUYPOVg9aE8ZWHYKPwYPGi8EuIo5STJQ== | base64 -d | iconv -f IBM-1047 -t ISO8859-1` |
| `08-1BM-3ncOd1ng-t0-1s0.html`   | `08-d3c0pIled-JavAAA.html`       | Emilien | decode base64 then use any java decompiler (like http://www.javadecompilers.com/) |

## Comment lancer le projet ?

Assez simple, premièrement se créer un environnement virtuel Python3 :

```bash
python3 -m venv .venv
```

Ensuite, installer les dépendances :

```bash
pip install -r requirements.txt
```

Puis lancer le projet :

```bash
python main.py
```

## Comment rajouter un scénario ?

- Créez votre fichier html dans le dossier `templates/` (eg. `02-th15-15-fun.html`) - un nom pas facilement trouvable
- Rajoutez vos scripts/feuilles de style CSS dans le dossier `static`
- Faites références dans vos fichiers HTML à vos scripts JS ou feuilles de style de la manière suivante : 

```html
<link rel="stylesheet" href="{{ url_for('static', path='/readme.css') }}">
```

- L'indice de votre scénario/challenge doit amener sur la page suivante (eg. la solution de `02-th15-15-fun.html` doit amener sur `03-wh04-th15-w45-cr4zy.html`)
