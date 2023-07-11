Bienvenue sur le repository pour le jeu de piste pour le FEEL Ensimag !

## Presentation des épreuves

| Syntax      | Description | Auteur | Solution
| ----------- | ----------- | ----------- |  ----------- |
| readme.html      | 01-t3rm1n4l.html       | Paul | check the CSS and find the file |
| 01-t3rm1n4l.html   | 02-m4r10-n3v3r-d13d.html        | Paul | Check the JS and find the file |
| 02-m4r10-n3v3r-d13d.html   | 03-h3110-y0u-4r3-4w350m3.html        | Paul | Check HTTP Headers and find the `X-Flag` |
| 03-h3110-y0u-4r3-4w350m3.html   | TBD        | TBD-Auteur | TBD |
| TBD-3   | TBD-4        | TBD-Auteur | TBD |
| TBD-4   | TBD-5        | TBD-Auteur | TBD |
| TBD-5   | TBD-6        | TBD-Auteur | TBD |
| TBD-6   | TBD-7        | TBD-Auteur | TBD |
| TBD-7   | TBD-FINAL       | Paul | TBD |

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
uvicorn main:app --reload
```

## Comment rajouter un scénario ?

- Créez votre fichier html dans le dossier `templates/` (eg. `02-th15-15-fun.html`) - un nom pas facilement trouvable
- Rajoutez vos scripts/feuilles de style CSS dans le dossier `static`
- Faites références dans vos fichiers HTML à vos scripts JS ou feuilles de style de la manière suivante : 

```html
<link rel="stylesheet" href="{{ url_for('static', path='/readme.css') }}">
```

- L'indice de votre scénario/challenge doit amener sur la page suivante (eg. la solution de `02-th15-15-fun.html` doit amener sur `03-wh04-th15-w45-cr4zy.html`)
