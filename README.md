Bienvenue sur le repository pour de template pour jeu de piste !

> le jeu est disponible à l'adresse suivante : https://jeu-de-piste-ensimag.vercel.app/ 🚀🔥

## Presentation des épreuves
### Intro
| Syntax      | Next | Auteur | Solution
| ----------- | ----------- | ----------- |  ----------- |
| `readme.html`      | `01-ch00Z3-uR-PASS.html`       | Paul | check the CSS and find the file TODO: Update readme with the new Next | 

### Chemin Dev `/dev`
| Syntax      | Next | Auteur | Solution
| ----------- | ----------- | ----------- |  ----------- |
| `01-t3rm1n4l.html`   | `02-m4r10-n3v3r-d13d.html`        | Paul | Check the JS and find the file TODO: update New flag |
| `02-m4r10-n3v3r-d13d.html`   | `03-h3110-y0u-4r3-4w350m3.html`        | Paul | Check HTTP Headers and find the `X-Flag` |
| `03-h3110-y0u-4r3-4w350m3.html`   | `04-7h3-4n5w3r-15-4-5h4m3.html`        | Paul | Solve the equation and send the result in the `result` variable |
| `04-7h3-4n5w3r-15-4-5h4m3.html`   | `05-x0r-15-n0t-m1l1t4ry-gr4d3-3ncrypt10n.html`        | Paul | retrieve the Javascript and XOR the bytes with the defined function |
| `05-x0r-15-n0t-m1l1t4ry-gr4d3-3ncrypt10n.html`   | `06-us3r-4g3n7-15-4n-1n73rn4710n4l-574nd4rd.html`        | Paul | Change the `User-Agent` to anything with `${TARGET_NAME}` in it (both lowercase/uppercase works) |
| `06-us3r-4g3n7-15-4n-1n73rn4710n4l-574nd4rd.html`   | `07-Y0u-c4n-b3-pr0ud-0f-y0ur53lf.html`       | Paul | Follow the instructions and create a small program to find the right number between 0 and 1000000 with only 25 tries + 25 seconds (dichotomy powa) |
| 07 à renommer `11-wh3r3_15_4z1z.html`   | `12-0h_4p1_d4y.html`     | Jeremy | Download the zip and find the file with the given information (info in html with opacity 0) `find . -name "*.txt" \| grep Flag` ==> The flag inside is vaulted with ansible-vault (the key is : leeloo) ==> ansible-vault decrypt |
| 08 à renommer `13-1m4g1n3_Y0u_f1Nd_P4r4d153.html`   | 08_45.78,3.093.html challenge ?   | Jeremy | coordonate Michelin Carmes : @45.78,3.093, TODO: on dit d'encoder les coordonerr en base 64 et les mettres dans l'url |

### Chemin Ops `ops`
| Syntax      | Next | Auteur | Solution
| ----------- | ----------- | ----------- |  ----------- |
| `01-t3rm1n4l.html`   | `02-m4r10-n3v3r-d13d.html`        | Paul | Check the JS and find the file |
| `02-m4r10-n3v3r-d13d.html`   | `03-h3110-y0u-4r3-4w350m3.html`        | Paul | Check HTTP Headers and find the `X-Flag` |
| 03 à renommer `05-x0r-15-n0t-m1l1t4ry-gr4d3-3ncrypt10n.html`   | `06-us3r-4g3n7-15-4n-1n73rn4710n4l-574nd4rd.html`        | Paul | Change the `User-Agent` to anything with `${TARGET_NAME}` in it (both lowercase/uppercase works) |
| 04 à renommer `07-Y0u-c4n-b3-pr0ud-0f-y0ur53lf.html`   | `08-1BM-3ncOd1ng-t0-1s0.html`        | Emilien | `8Phg8cLUYPOVg9aE8ZWHYKPwYPGi8EuIo5STJQ== \| base64 -d \| iconv -f IBM-1047 -t ISO8859-1` |
| 05 à renommer `08-1BM-3ncOd1ng-t0-1s0.html`   | `08-d3c0pIled-JavAAA.html`       | Emilien | decode base64 then use any java decompiler (like http://www.javadecompilers.com/) |
| 06 à renommer `10-AG3_0F_3MP1R3_II.html`   | `11-wh3r3_15_4z1z.html`       | Jeremy | find hidden passphrase in image metadata (example exiftool) and then extract embeded txt in image thanks to passphrase (steghide extract -sf file).Finally decode message (caesar encoding with padding 7) |
| 07 à renommer `11-wh3r3_15_4z1z.html`   | `12-0h_4p1_d4y.html`     | Jeremy | Download the zip and find the file with the given information (info in html with opacity 0) `find . -name "*.txt" \| grep Flag` ==> The flag inside is vaulted with ansible-vault (the key is : leeloo) ==> ansible-vault decrypt |
| 08 à renommer `13-1m4g1n3_Y0u_f1Nd_P4r4d153.html`   | 08_45.78,3.093.html challenge ?   | Jeremy | coordonate Michelin Carmes : @45.78,3.093, TODO: on dit d'encoder les coordonerr en base 64 et les mettres dans l'url |

### Chemin Sec `sec`
| Syntax      | Next | Auteur | Solution
| ----------- | ----------- | ----------- |  ----------- |
| `01-t3rm1n4l.html`   | `02-m4r10-n3v3r-d13d.html`        | Paul | Check the JS and find the file |
| `02-m4r10-n3v3r-d13d.html`   | `03-h3110-y0u-4r3-4w350m3.html`        | Paul | Check HTTP Headers and find the `X-Flag` |
|03 à renommer `05-x0r-15-n0t-m1l1t4ry-gr4d3-3ncrypt10n.html`   | `06-us3r-4g3n7-15-4n-1n73rn4710n4l-574nd4rd.html`        | Paul | Change the `User-Agent` to anything with `${TARGET_NAME}` in it (both lowercase/uppercase works) |
|04 à renommer `07-Y0u-c4n-b3-pr0ud-0f-y0ur53lf.html`   | `08-1BM-3ncOd1ng-t0-1s0.html`        | Emilien | `8Phg8cLUYPOVg9aE8ZWHYKPwYPGi8EuIo5STJQ== \| base64 -d \| iconv -f IBM-1047 -t ISO8859-1` |
|05 à renommer `08-1BM-3ncOd1ng-t0-1s0.html`   | `08-d3c0pIled-JavAAA.html`       | Emilien | decode base64 then use any java decompiler (like http://www.javadecompilers.com/) |
|06 à renommer `10-AG3_0F_3MP1R3_II.html`   | `11-wh3r3_15_4z1z.html`       | Jeremy | find hidden passphrase in image metadata (example exiftool) and then extract embeded txt in image thanks to passphrase (steghide extract -sf file).Finally decode message (caesar encoding with padding 7) |
|07 à renommer `11-wh3r3_15_4z1z.html`   | `12-0h_4p1_d4y.html`     | Jeremy | Download the zip and find the file with the given information (info in html with opacity 0) `find . -name "*.txt" \| grep Flag` ==> The flag inside is vaulted with ansible-vault (the key is : leeloo) ==> ansible-vault decrypt |
|08 à renommer `13-1m4g1n3_Y0u_f1Nd_P4r4d153.html`   | 08_45.78,3.093.html challenge ?   | Jeremy | coordonate Michelin Carmes : @45.78,3.093, TODO: on dit d'encoder les coordonerr en base 64 et les mettres dans l'url |

### Chemin Data `data`
| `01-t3rm1n4l.html`   | `02-m4r10-n3v3r-d13d.html`        | Paul | Check the JS and find the file |
| `12-0h_4p1_d4y.html`   | `13-1m4g1n3_Y0u_f1Nd_P4r4d153.html`     | Jeremy | https://659c5f70633f9aee79079838.mockapi.io/api_chall_12/challenge/13 |
| `13-1m4g1n3_Y0u_f1Nd_P4r4d153.html`   | 08_45.78,3.093.html challenge ?   | Jeremy | coordonate Michelin Carmes : @45.78,3.093, TODO: on dit d'encoder les coordonerr en base 64 et les mettres dans l'url |


#TODO : 
- rajouter un timestamp encoder dans le flag pour avoir un côté unique
- renomer la derniere page 

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

## Déployer une instance
[![Deploy avec Vercel](https://vercel.com/button)](https://vercel.com/new/import?s=https%3A%2F%2Fgithub.com%2FPaulSec%2Fjeu-de-piste-ensimag&project-name=jeu-de-piste&framework=other&totalProjects=1&remainingProjects=1&env=DISPLAY_NAME&env=TARGET_NAME)
