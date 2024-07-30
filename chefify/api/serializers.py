from rest_framework.serializers import ModelSerializer
from .models import Categories, Ingredient, Profile, Recipe, User

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
    class Meta:
        model = Profile
        fields = '__all__'

class RecipeSerializer(ModelSerializer):
    user = UserSerializer()
    class Meta:
        models = Recipe
        fields = '__all__'


        
        