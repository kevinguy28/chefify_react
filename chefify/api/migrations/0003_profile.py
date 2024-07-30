# Generated by Django 5.0.7 on 2024-07-21 22:56

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_ingredientunit_recipecomponents_recipe'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('user_ingredients_list', models.ManyToManyField(blank=True, to='api.ingredient')),
                ('user_recipe_list', models.ManyToManyField(blank=True, to='api.recipe')),
            ],
        ),
    ]
