from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
from . import views
from .views import MyTokenObtainPairView

def csrf(request):
    return JsonResponse({'csrfToken': request.META.get('CSRF_COOKIE', '')})

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('csrf/', csrf),
    path('user/<str:pk>/', views.getUser, name="getUser"),
    path('user/recipes/<str:pk>/', views.getUserRecipes, name="getUserRecipes"),
    path('register/', views.postUser, name="postUser"),
    path('categories/', views.getCategories, name="getCategories"),
    path('recipe/', views.manageRecipes, name="manageRecipes"),
    path('recipe/<str:pk>/', views.manageRecipe, name="manageRecipe"),
    path('recipe-components/<str:pk>/', views.manageRecipeComponents, name="manageRecipeComponents"),
    path('recipe-components/<str:pk>/ingredient-unit', views.manageIngredientUnit, name="manageIngredientUnit"),
    path('recipe-components/<str:pk>/ingredient-unit/<str:sk>/', views.deleteIngredientUnit, name="deleteIngredientUnit"),
    path('review/', views.postReview, name="postReview"),
    path('review/user-review/<str:pk>/<str:sk>/', views.getReviewUser, name="getReviewUser"),
    path('review/<str:pk>/', views.manageReview, name="manageReview"),
    path('steps/<str:pk>/', views.manageSteps, name="manageSteps"),
    path('steps/<str:pk>/<str:sk>/', views.putStepsSwap, name="putStepsSwap"),
    path('profile/<str:pk>/', views.manageProfile, name="manageProfile"),
    path('messages/<str:pk>/', views.manageMessages, name="manageMessages"),
]
