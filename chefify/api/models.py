from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Categories(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name
    
class Ingredient(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name
    
class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ingredientsList = models.ManyToManyField(Ingredient, blank=True, related_name='ingredientsList')
    shoppingList = models.ManyToManyField(Ingredient, blank=True, related_name='shoppingList')

    def __str__(self):
        return str(self.user) + "'s Profile"

class Recipe(models.Model):
    STATUS_CHOICES = {
        'private': 'Private',
        'public': 'Public',
        'friends': 'Friends',
    }
    name = models.CharField(max_length=50)
    categories = models.ForeignKey(Categories, on_delete=models.SET_NULL, null=True,blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    ingredients_list = models.ManyToManyField(Ingredient, blank=True, null=True)
    privacy = models.CharField(max_length=15, choices=STATUS_CHOICES, default='private')
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
