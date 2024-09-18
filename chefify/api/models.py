from django.db import models
from django.db.models import F
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.dispatch import receiver
from django.utils import timezone

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
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    STATUS_CHOICES = {
        'private': 'Private',
        'public': 'Public',
        'friends': 'Friends',
    }
    RATING_CHOICES = [(i/2, str(i/2)) for i in range(0, 11)]
    name = models.CharField(max_length=50)
    categories = models.ForeignKey(Categories, on_delete=models.SET_NULL, null=True,blank=True)
    ingredientsList = models.ManyToManyField(Ingredient, blank=True)
    privacy = models.CharField(max_length=15, choices=STATUS_CHOICES, default='private')
    rating = models.DecimalField(max_digits=2, decimal_places=1,choices=RATING_CHOICES,validators=[MinValueValidator(0.0), MaxValueValidator(5.0)], default=0.0)
    reviewers = models.ManyToManyField(User, blank=True, related_name="reviewed_recipes")
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def update_rating(self):
        reviews = Review.objects.filter(recipe=self)
        print(reviews)
        total_reviews = self.reviewers.count()
        print(total_reviews)
        if total_reviews > 0:
            print("xxx")
            sum_ratings = reviews.aggregate(total=models.Sum('rating'))['total']
            print(sum_ratings)
            average = round((sum_ratings / total_reviews) * 2) / 2  # Round to the nearest 0.
            print(average)
            self.rating = average
        else:
            print("yyyy")
            self.rating = 0.0  # No reviews, so set rating to 0
        self.save()

    def remove_user(self, review_instance):
        user = review_instance.user 
        self.reviewers.remove(user)
        self.save()
        self.update_rating()
        
    def __str__(self):
        return self.name
    
class Steps(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    title = models.CharField(max_length=50, default="")
    description = models.TextField()
    order = models.PositiveIntegerField()
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return("Step-"+ str(self.order) + ": " + self.title[0:30])
    
    def delete(self, *args, **kwargs):
        # Update the order of instances with a larger order value
        Steps.objects.filter(order__gt=self.order).update(order=F('order') - 1)
        # Call the superclass delete method to delete the instance
        super(Steps, self).delete(*args, **kwargs)

class Review(models.Model):
    RATING_CHOICES = [(i/2, str(i/2)) for i in range(1, 11)]
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=2, decimal_places=1,choices=RATING_CHOICES,validators=[MinValueValidator(0.0), MaxValueValidator(5.0)])
    review_text = models.TextField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'recipe'], name='unique_review_per_user_per_recipe')
        ]

    def __str__(self):
        return f"Review: {self.rating}"

class IngredientUnit(models.Model):
    UNIT_CHOICES = {
        'tbsp': 'Tablespoon',
        'tsp': 'Teaspoon',
        'cup': 'Cup',
        'oz': 'Ounce',
        'g': 'Gram',
        'kg': 'Kilogram',
        'ml': 'Milliliter',
        'L':'Liter',
        'pinch': 'Pinch',
        'dash': 'Dash',
    }

    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='units')
    unit = models.CharField(max_length=15, choices=UNIT_CHOICES)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)


    def __str__(self):
        return f"{self.quantity} {self.unit} {self.ingredient.name}"
    
class RecipeComponents(models.Model):
    name = models.CharField(max_length=30, blank=False)
    ingredientsList = models.ManyToManyField(IngredientUnit, blank = True)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, default=None)

    def __str__(self):
        return self.name

class Message(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField()
    updated = models.DateTimeField(auto_now= True)
    created = models.DateTimeField(auto_now_add= True)

    class Meta:
        ordering = ['-updated', '-created']

    def __str__(self) -> str:
        return self.body[0:30]
    