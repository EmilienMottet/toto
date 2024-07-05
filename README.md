# Repository Jeu de Piste 


## Introduction

Bienvenue sur le repository du jeu de piste en ligne Michelin !

Ce jeu consiste à naviguer à travers plusieurs pages, chacune contenant un défi. En réussissant chaque défi, vous obtiendrez un flag. Collectez tous les flags pour terminer le jeu !

## How to play

1. **Commencez le jeu** : Rendez-vous sur la première page du jeu ([Voir déployment](https://github.com/michelin/treasure-hunt?tab=readme-ov-file#Deployment)).
2. **Résolvez le défi** : Chaque page contiendra un défi unique que vous devrez résoudre pour obtenir un flag.
3. **Obtenez le flag** : Une fois le défi résolu, un flag vous sera fourni. Notez-le bien !
4. **Continuez l'aventure** : Utilisez le flag pour accéder à la page suivante où un nouveau défi vous attend.
5. **Terminez le jeu** : Répétez le processus jusqu'à ce que vous ayez collecté tous les flags et atteint la fin du jeu.

Les flags sont de la forme `X_S0M3-Str1NgS.html` où X est le numéro du challenge.
Par exemple un flag pourrait être : `1_tH15-15-N0t-TH3-B3g1NN1ng.html`

## Deployment

### Requirement

- Avoir un compte Vercel. Si vous n'en avez pas, inscrivez-vous sur [vercel.com](vercel.com)
  
### Easy way to Deploy

Vous pouvez immédiatement lancer le jeu de piste ici : 
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmichelin%2Ftreasure-hunt)

### Step to deploy locally


## Contributing

Nous sommes ravis que vous souhaitiez contribuer à notre jeu de piste en ligne ! Voici comment vous y prendre.

1. Forkez le Projet : Commencez par forker le repository sur votre propre compte GitHub.
2. Clonez votre Fork : Clonez votre fork sur votre machine locale.  
```bash
git clone https://github.com/utilisateur/Jeu-de-Piste.git
cd Jeu-de-Piste
```
3. Créez une Branche : Créez une nouvelle branche pour votre fonctionnalité ou correction de bug.
```bash
git checkout -b ma-nouvelle-branche
```
4. Faites vos Modifications : Apportez les modifications nécessaires dans votre branche.
5. Testez vos Modifications : Assurez-vous que toutes les fonctionnalités sont correctement testées et fonctionnent comme prévu.
6. Commitez vos Modifications : Commitez vos modifications avec un message de commit clair et concis.
7. Poussez vers votre Fork : Poussez vos modifications vers votre fork sur GitHub.
```bash
    git push origin ma-nouvelle-branche
```
8. Ouvrez une Pull Request : Allez sur le repository original et ouvrez une pull request depuis votre fork.

<!-- 
### Règles de Contribution

- Style de Code : Assurez-vous que votre code suit les conventions de style de ce projet.
- Documentation : Mettez à jour la documentation pour refléter vos modifications si nécessaire. -->

### Just add a scenario 

- Créez votre fichier html dans le dossier `templates/` (eg. `th15-15-fun.html`) - un nom pas facilement trouvable
- Rajoutez vos scripts/feuilles de style CSS dans le dossier `static`
- Faites références dans vos fichiers HTML à vos scripts JS ou feuilles de style de la manière suivante : 

```html
<link rel="stylesheet" href="{{ url_for('static', path='/02-th15-15-fun.css') }}">
```

- Ecrivez le fichier `config.yml` en s'inspirant des autres.
- Ajoutez le nom du fichier dans un des paths de `paths_config.py`

## Support

Si vous avez des questions ou des problèmes, n'hésitez pas à contacter notre équipe à l'adresse suivante : jeu-de-piste-devoxx@michelin.com

Bonne chance et amusez-vous bien !