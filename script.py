from datetime import datetime
import instaloader
import json

# Compte sur lequel le bot tourne (creer en 1 pour l'occasion)
# Si error many Request = d'après la doc de instaloader cela permet de ne pas se faire reperepar insta
USERNAME = "identifiant"
MDP = "mdp"


# Changer les points gagnés ici si besoin
SCORELIKE = 1
SCORECOMMENTAIRE = 2

bot = instaloader.Instaloader()
bot.login(USERNAME, MDP)

########## Choisir le compte à SCRAP ##########
target_account = "cible"
profile = instaloader.Profile.from_username(bot.context, target_account)


data = []
player = {}
posts = []
for post in profile.get_posts():

    ts = datetime.timestamp(post.date_local)

    postObject = {
        "id": post.shortcode,
        "username": profile.username,
        "nbLikes": post.likes,
        "nbCommentaires": post.comments,
        "created_at": ts
    }

    ###############################
    # Pour recuperer les photo et bio de chaque post
    #  bot.download_post(post, target="data")
    ##############################

    postObject["accountLikes"] = []
    for like in post.get_likes():
        postObject["accountLikes"].append(like.username)
        
        try:
            if(player[like.username]):
                pass
        except:
            player[like.username] = {}

        try : 
            player[like.username]['score'] += SCORELIKE
        except:
            player[like.username]['score'] = SCORELIKE

        try : 
            player[like.username]['nbLike'] += 1
        except:
            player[like.username]['nbLike'] = 1

    postObject["accountComment"] = []
    for comment in post.get_comments():

        if(comment.owner.username in postObject["accountComment"]):
            pass
        else :
            postObject["accountComment"].append(comment.owner.username)
            try:
                if(player[comment.owner.username]):
                    pass
            except:
                player[comment.owner.username] = {}

            try : 
                player[comment.owner.username]['score'] += SCORECOMMENTAIRE
            except:
                player[comment.owner.username]['score'] = SCORECOMMENTAIRE

            try : 
                player[comment.owner.username]['nbComment'] += 1
            except:
                player[comment.owner.username]['nbComment'] = 1


    posts.append(postObject)


data.append(posts)

playerSortedByScore = {k: v for k, v in sorted(player.items(), reverse=True, key=lambda item: item[1].get('score')) }

data.append(playerSortedByScore)

f = open(f'data/data.json', mode="w")

f.write(json.dumps(data))