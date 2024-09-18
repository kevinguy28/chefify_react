from django.contrib import admin
from .models import Categories, Ingredient, Profile, Recipe, Steps, RecipeComponents, IngredientUnit, Message, Review
# Register your models here.

admin.site.register(Categories)
admin.site.register(Ingredient)
admin.site.register(Profile)
admin.site.register(Recipe)
admin.site.register(Steps)
admin.site.register(RecipeComponents)
admin.site.register(IngredientUnit)
admin.site.register(Message)
admin.site.register(Review)