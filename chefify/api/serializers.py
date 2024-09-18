from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User
from .models import Categories, Ingredient, Profile, Recipe, Steps, IngredientUnit, RecipeComponents, Message, Review

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class CategoriesSerializer(ModelSerializer):
    class Meta:
        model = Categories
        fields = '__all__'

class IngredientSerializer(ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'

class ProfileSerializer(ModelSerializer):
    ingredientsList = IngredientSerializer(many=True)
    shoppingList = IngredientSerializer(many=True)
    user = UserSerializer()
    class Meta:
        model = Profile
        fields = '__all__'

class RecipeSerializer(ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Recipe
        fields = '__all__'
        
class StepsSerializer(ModelSerializer):
    recipe = RecipeSerializer()
    user = UserSerializer()
    class Meta:
        model = Steps
        fields = '__all__'

class IngredientUnitSerializer(ModelSerializer):
    ingredient = IngredientSerializer()
    class Meta:
        model = IngredientUnit
        fields = '__all__'

class RecipeComponentsSerializer(ModelSerializer):
    recipe = RecipeSerializer()
    ingredientsList = IngredientUnitSerializer(many=True)
    class Meta:
        model = RecipeComponents
        fields = '__all__'

class MessageSerailizer(ModelSerializer):
    recipe = RecipeSerializer()
    user = UserSerializer()
    class Meta:
        model = Message
        fields = '__all__'

class ReviewSerializer(ModelSerializer):
    recipe = RecipeSerializer()
    user = UserSerializer()
    class Meta:
        model = Review
        fields = '__all__'

    

        