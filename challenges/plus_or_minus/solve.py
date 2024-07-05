import requests

url = "https://challenges-devoxx.azurewebsites.net/dev/challenges/5_us3r-4g3n7-15-4n-1n73rn4710n4l-574nd4rd.html"
response = requests.request("PUT", url)

identifier = response.json()["id"]

def recherche_dichotomique():
    """
    Algorithme de recherche dichotomique pour trouver un nombre dans une liste triée.

    Arguments :
    liste : La liste triée dans laquelle chercher la cible.
    cible : Le nombre que l'on cherche.

    Retourne :
    L'index de la cible dans la liste, ou None si la cible n'est pas présente.

    """

    gauche = 0
    droite = 1000000

    while gauche <= droite:
        milieu = (gauche + droite) // 2

        data = {
            'id': identifier,
            'number': milieu
        }
        print(f" Milieu is {milieu}")
        req = requests.post("https://challenges-devoxx.azurewebsites.net/dev/challenges/5_us3r-4g3n7-15-4n-1n73rn4710n4l-574nd4rd.html", data=data)
        content = str(req.content)
        print(f"{content}")
        if 'high' in content:
            droite = milieu - 1
        elif 'low' in content:
            gauche = milieu + 1
        else:
            print(f"Found the number: {milieu}")
            break
    return None

recherche_dichotomique()
