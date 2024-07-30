from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import CategoriesSerializer, IngredientSerializer, ProfileSerializer
from .models import Categories, Ingredient, Profile, Recipe, User


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

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def getCategories(request):
    if request.method == "GET":
        categories = Categories.objects.all()
        serializer = CategoriesSerializer(categories, many=True)
        return Response(serializer.data)
    
@api_view(['POST', 'GET', 'DELETE'])
# @permission_classes([IsAuthenticated])
def manageProfile(request, pk):
    data = request.data
    profile = Profile.objects.get(user=pk)

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
    
@api_view(['POST', 'GET', 'DELETE'])
def manageRecipes(request):
    data = request.data
    
    if request.method == "POST":
        try:
            user = User.objects.get(id=data["user_id"])
            category = Categories.objects.get(name=data["category"])
        except:
            return Response({"message": "User could not be found."}, status=status.HTTP_404_NOT_FOUND)
        
        Recipe.objects.create(name=data["name"], user=user, categories=category, privacy=data["privacy"])

    return Response({"message": "Recipe Created"}, status=status.HTTP_200_OK)