from decimal import Decimal

from django.core.paginator import Paginator

from django.db.models import Q

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import CategoriesSerializer, ProfileSerializer, RecipeSerializer, StepsSerializer, IngredientSerializer, RecipeComponentsSerializer, MessageSerailizer, ReviewSerializer
from .models import Categories, Ingredient, Profile, Recipe, User, Steps, RecipeComponents, IngredientUnit, Message, Review


# Create your views here.

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# User (pk = user.user_id) --> Get User instance. Create User instance and Profile associated with User.
@api_view(['GET'])
def getUser(request, pk):
    user = User.objects.get(id=pk)
    data = request.data
    if request.method == "GET":
        # Get User Review Information
        review = Review.objects.filter(user=user)
        reviewSerializer = ReviewSerializer(review, many=True)
        userData = {
            'reviews': reviewSerializer.data,
        }
        return Response(userData)

@api_view(['POST'])
def postUser(request):
    data = request.data
    if request.method == "POST":
        username = data["username"]
        password = data["password"]
        if(len(password) < 8):
            return Response({"message": "Password length must by 8 characters!"}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create(username=username, password=password)
        if(user):
            Profile.objects.create(user=user)
            return Response({"message": "Account created!"}, status=status.HTTP_200_OK)
    return Response({"message": "Account creation failed!"}, status=status.HTTP_400_BAD_REQUEST)

# User (pk = user.user.id) --> Get all User Recipes.
@api_view(['GET'])
def getUserRecipes(request, pk):
    if request.method == "GET":
        user = User.objects.get(id=pk)
        recipes = Recipe.objects.filter(user=user)
        seralizer = RecipeSerializer(recipes, many=True)
        return Response(seralizer.data)

# Categories --> Get all Categories
@api_view(['GET'])
def getCategories(request):
    if request.method == "GET":
        categories = Categories.objects.all()
        serializer = CategoriesSerializer(categories, many=True)
        return Response(serializer.data)
    
# Profile (pk = profile.id) --> Add Ingredient to User Profile, Get Ingredient/Shopping List from User Profile, Delete Ingredient from User Profile
@api_view(['POST', 'GET', 'DELETE'])
def manageProfile(request, pk):
    data = request.data
    profile = Profile.objects.get(id=pk)
    if request.method == "POST":
        try:
            ingredient = Ingredient.objects.get(name=data['name'].capitalize())
        except Ingredient.DoesNotExist:
            ingredient = Ingredient.objects.create(name=data['name'].capitalize())

        if(data['type'] == "ingredientsList"):
            if not ingredient in profile.ingredientsList.all():
                profile.ingredientsList.add(ingredient)
                return Response({"message": "Ingredient added to list."}, status=status.HTTP_200_OK)    
            return Response({"message": "Ingredient already in list."}, status=status.HTTP_200_OK)
        elif(data['type'] == "shoppingList"):
            if not ingredient in profile.shoppingList.all():
                profile.shoppingList.add(ingredient)
                return Response({"message": "Ingredient added to shopping list."}, status=status.HTTP_200_OK)    
            return Response({"message": "Ingredient already in shopping list."}, status=status.HTTP_200_OK)
        return Response({"message": "Nothing could be added"}, status=status.HTTP_200_OK)
    elif request.method == "GET":
        try:
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)
        except:
            return Response({"message": "No Ingredient List found"}, status=status.HTTP_404_NOT_FOUND)
    
    elif request.method == "DELETE":
        try:
            ingredient = Ingredient.objects.get(name=data['name'].capitalize())
            if(data['type'] == "ingredientsList"):
                profile.ingredientsList.remove(ingredient)
                return Response({"message": "Ingredient removed from list."}, status=status.HTTP_200_OK)
            elif(data['type'] == "shoppingList"):
                profile.shoppingList.remove(ingredient)
                return Response({"message": "Ingredient removed from shopping list."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Ingredient could not be found."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"message": "Ingredient could not be found."}, status=status.HTTP_404_NOT_FOUND)

# Recipes --> Create Recipe, Get all Recipes (RecipeTab.js)
@api_view(['POST', 'GET'])
def manageRecipes(request):
    data = request.data
    
    if request.method == "POST":
        try:
            user = User.objects.get(id=data["user_id"])
            category = Categories.objects.get(name=data["category"])
            Recipe.objects.create(name=data["name"], user=user, categories=category, privacy=data["privacy"])
            return Response({"message": "Recipe Created"}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "User could not be found."}, status=status.HTTP_404_NOT_FOUND)
    elif request.method == "GET":
        c_recipes = Recipe.objects.all()
        q = request.GET.get('category') if request.GET.get('category') != None else ''
        c_recipes = Recipe.objects.filter(Q(categories__name__icontains= q) & (Q(privacy='public')))
        serializer = RecipeSerializer(c_recipes, many=True)
        return Response(serializer.data)

# Recipe --> Get singular recipe (RecipePage.js)
@api_view(['GET'])
def manageRecipe(request, pk):
    if request.method == "GET":
        try:
            recipe = Recipe.objects.get(id=pk)
            serializer = RecipeSerializer(recipe)
            return(Response(serializer.data))
        except:
            return Response({"message": "Recipe could not be retrieved."}, status=status.HTTP_400_BAD_REQUEST)

# Reviews (pk = recipe.id, sk = user.user_id) --> Get use review
@api_view(['GET'])
def getReviewUser(request, pk, sk):
    data = request.data
    if request.method == "GET":
        try:
            recipe = Recipe.objects.get(id=pk)
            user = User.objects.get(id=sk)
            review = Review.objects.get(recipe=recipe,user=user)
            serializer = ReviewSerializer(review)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            print("review doesn't exist")
            return Response({"message": "Review doesn't exist"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def postReview(request):
    data = request.data
    user = User.objects.get(id=data["user_id"])
    recipe = Recipe.objects.get(id=data["recipe_id"])
    print(data["rating"])
    Review.objects.create(recipe=recipe, user=user, review_text=data["review_text"],rating=data["rating"])
    recipe.reviewers.add(user)
    return Response({"message": "Step was created"}, status=status.HTTP_200_OK)

# Review (pk = recipe.id(GET, PUT) & pk = review.id(DEL)) --> Reviews of Recipe & Delete Review
@api_view(['GET', 'PUT', 'DELETE'])
def manageReview(request, pk):
    data = request.data
    if request.method == "GET":
        recipe = Recipe.objects.get(id=pk)
        reviews = Review.objects.filter(recipe=recipe).order_by("-updated")
        pageNumber = request.GET.get('page', 1)
        paginator = Paginator(reviews, 3)
        page = paginator.get_page(pageNumber)
        serializer = ReviewSerializer(page, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == "PUT":
        recipe = Recipe.objects.get(id=pk)
        user = User.objects.get(id=data["user_id"])
        review = Review.objects.get(recipe=recipe, user=user)
        review.rating = data["rating"]
        review.review_text = data["review_text"]
        review.save()
        return Response({"message": "Step was created"}, status=status.HTTP_200_OK)
    elif request.method == "DELETE":
        review = Review.objects.get(id=pk)
        recipe = Recipe.objects.get(id=review.recipe.id)
        review.delete()
        recipe.reviewers.remove(review.user)
        return Response({"message": "Step was created"}, status=status.HTTP_200_OK)
    return Response({"message": "Step was created"}, status=status.HTTP_200_OK) 

# Steps (pk = recipe.id) --> Steps of Recipe
@api_view(['POST', 'GET', 'DELETE'])
def manageSteps(request, pk):
    data = request.data
    if request.method == "POST":
        try:

            recipe = Recipe.objects.get(id=pk)
            user = User.objects.get(id=data["user_id"])
            last_step = Steps.objects.filter(recipe=recipe).order_by('-order').first()
            if last_step:
                last_step = last_step.order + 1
            else:
                last_step= 1
            description = data["description"]

            Steps.objects.create(recipe=recipe,description=description,order=last_step,user=user)
            return Response({"message": "Step was created"}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Steps could not be created."}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "GET":
        try:
            recipe = Recipe.objects.get(id=pk)
            steps = Steps.objects.filter(recipe=recipe)
            serializer = StepsSerializer(steps, many=True)
            return Response(serializer.data)
        except:
            return Response({"message": "Steps could not be found."}, status=status.HTTP_404_NOT_FOUND)
    elif request.method == "DELETE":
        try:
            step = Steps.objects.get(id=pk)
            step.delete()
            return Response({"message" : "Step was deleted."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Steps could not be found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def putStepsSwap(request, pk, sk):
    if request.method == "PUT":
        try:
            step1 = Steps.objects.get(id=pk)
            step2 = Steps.objects.get(id=sk)
            print(step1.order)
            print(step2.order)
            orderTmp = step1.order
            step1.order = step2.order
            step2.order = orderTmp
            step1.save()
            step2.save()
            print(step1.order)
            print(step2.order)
            print("-----------------------")
            return Response({"message": "Step order was swapped"}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Steps could not be swapped."}, status=status.HTTP_404_NOT_FOUND)
# Recipe Components (pk = recipe.id) --> Recipe Components of Recipe
@api_view(['POST', 'GET', 'DELETE'])
def manageRecipeComponents(request, pk):
    data = request.data
    recipe = Recipe.objects.get(id=pk)
    if request.method == "POST":
        try:
            RecipeComponents.objects.create(name=data["name"], recipe=recipe)
            return Response({"message": "Recipe Component was created."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Recipe Component could not be created."}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "GET":
        try:
            recipeComponents = RecipeComponents.objects.filter(recipe=recipe)
            serializer = RecipeComponentsSerializer(recipeComponents, many=True)
            return Response(serializer.data)
        except:
            return Response({"message": "Recipe Components could not be found."}, status=status.HTTP_404_NOT_FOUND)
    elif request.method == "DELETE":
        try:
            recipeComponents = RecipeComponents.objects.get(id=pk)
            recipeComponents.delete()
            return Response({"message" : "Component has been deleted"}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Recipe Components could not be found."}, status=status.HTTP_404_NOT_FOUND)

# IngredientUnit (pk = recipeComponent.id) --> Ingredient Unit of Recipe Component
@api_view(['POST', 'GET'])    
def manageIngredientUnit(request, pk):
    data = request.data
    if request.method == "POST":
        try:
            recipeComponent = RecipeComponents.objects.get(id=pk)
            if not Ingredient.objects.filter(name=data["ingredient"]).exists():
                ingredient = Ingredient.objects.create(name=data["ingredient"])
            else:
                ingredient = Ingredient.objects.get(name=data["ingredient"])

            ingredientUnit = IngredientUnit.objects.create(ingredient=ingredient, unit=data["unit"], quantity=data["quantity"])
            recipeComponent.ingredientsList.add(ingredientUnit)
            return Response({"message": "Ingredient was added to recipe component."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Recipe Components could not be found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(["DELETE"])
def deleteIngredientUnit(request, pk, sk):
    if request.method == "DELETE":
        try:
            component = RecipeComponents.objects.get(id=pk)
            ingredient = IngredientUnit.objects.get(id=sk)
            component.ingredientsList.remove(ingredient)
            ingredient.delete()
            return Response({"message": "Ingredient was added to recipe component."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Recipe Components could not be found."}, status=status.HTTP_404_NOT_FOUND)

# Messages (pk = recipe.id) --> All messages in recipe
@api_view(["POST", "GET"])
def manageMessages(request, pk):
    data = request.data 
    recipe = Recipe.objects.get(id=pk)
    user = request.user
    if request.method == "POST":
        Message.objects.create(recipe=recipe, user=user,body=data["body"])
        return Response({"message": "okay"}, status=status.HTTP_200_OK)
    elif request.method == "GET":
        
        # messages = Message.objects.filter(recipe=recipe)
        # serializer = MessageSerailizer(messages, many=True)
        # return Response(serializer.data)
        
        messages = Message.objects.filter(recipe=recipe).order_by("-created")
        pageNumber = request.GET.get('page', 1)
        paginator = Paginator(messages, 3)
        page = paginator.get_page(pageNumber)
        serializer = MessageSerailizer(page, many=True)
        print("bithc ass")
        return Response(serializer.data, status=status.HTTP_200_OK)
            
