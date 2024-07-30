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
    path('categories/', views.getCategories, name="get-categories"),
    path('recipe/', views.manageRecipes, name="manageRecipes"),
    path('profile/<str:pk>/', views.manageProfile, name="manageProfile"),
]
